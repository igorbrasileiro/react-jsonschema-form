// @ts-nocheck
/* eslint-disable */
// Deno script to append .ts to relative import/export specifiers within src/
// - Processes .ts and .tsx files
// - For specifiers like './foo' with no extension, will append '.ts' only if './foo.ts' exists
// - Leaves imports to packages, URLs, absolute paths, and already extended specifiers unchanged
// - Skips adding .ts if the only match is .tsx to avoid breaking component imports

// Usage (from project root or package directory):
// deno run -A tools/fix-import-extensions.ts

type FileEdit = {
  path: string;
  before: string;
  after: string;
  changed: boolean;
};

const SRC_DIR = new URL("../src/", import.meta.url);

function isRelativePath(spec: string): boolean {
  return spec.startsWith("./") || spec.startsWith("../");
}

function hasExtension(spec: string): boolean {
  // If last path segment contains a dot, consider it as having an extension
  const last = spec.split("/").pop() ?? spec;
  return last.includes(".");
}

async function fileExists(path: string): Promise<boolean> {
  try {
    const info = await Deno.stat(path);
    return info.isFile;
  } catch (_err) {
    return false;
  }
}

function resolveFromFile(filePath: string, spec: string): string {
  const fileDir = filePath.substring(0, filePath.lastIndexOf("/")) + "/";
  return new URL(spec, new URL(fileDir, "file://" + (fileDir.startsWith("/") ? "" : "/"))).pathname;
}

async function maybeFixSpecifier(filePath: string, spec: string): Promise<string> {
  if (!isRelativePath(spec)) return spec;

  const resolvedBase = resolveFromFile(filePath, spec);

  // Case 1: spec already has extension
  if (hasExtension(spec)) {
    // If it's .ts and exists, keep
    if (spec.endsWith('.ts')) {
      if (await fileExists(resolvedBase)) return spec;
      // If './foo.ts' does not exist but './foo/index.ts' exists, fix it
      const noTs = spec.replace(/\.ts$/, '');
      const resolvedNoTs = resolveFromFile(filePath, noTs);
      const indexTs = `${resolvedNoTs}/index.ts`;
      if (await fileExists(indexTs)) return `${noTs}/index.ts`;
    }
    return spec;
  }

  // Case 2: no extension -> prefer `foo.ts` if present, otherwise `foo/index.ts`
  const candidateTs = `${resolvedBase}.ts`;
  if (await fileExists(candidateTs)) {
    return `${spec}.ts`;
  }
  const indexTs = `${resolvedBase}/index.ts`;
  if (await fileExists(indexTs)) {
    return `${spec}/index.ts`;
  }

  // Do NOT change when only .tsx exists; safer to skip
  return spec;
}

// Regex captures module specifiers in import/export statements (including type and export forms)
// Handles multi-line import blocks like:
// import {
//   A,
//   B,
// } from './path'
// Also handles dynamic import('...') but avoids replacing when not a string literal
const IMPORT_EXPORT_REGEX = /\b(import\s+(?:type\s+)?[\s\S]*?\bfrom\s*|export\s+(?:\*|\{[\s\S]*?\})\s*from\s*)('|")([^'"\n]+)\2|\bimport\s*\(\s*('|")([^'"\n]+)\4\s*\)/g;

async function processFile(path: string): Promise<FileEdit> {
  const before = await Deno.readTextFile(path);
  let changed = false;

  const after = await replaceAsync(before, IMPORT_EXPORT_REGEX, async (...args) => {
    const match = args[0] as string;
    const fromPrefix = (args[1] as string) || ""; // present for static import/export
    const quote1 = (args[2] as string) || "";
    const spec1 = (args[3] as string) || "";
    const quote2 = (args[4] as string) || ""; // present for dynamic import
    const spec2 = (args[5] as string) || "";

    if (spec1) {
      const updated = await maybeFixSpecifier(path, spec1);
      if (updated !== spec1) changed = true;
      return `${fromPrefix}${quote1}${updated}${quote1}`;
    }
    if (spec2) {
      const updated = await maybeFixSpecifier(path, spec2);
      if (updated !== spec2) changed = true;
      return `import(${quote2}${updated}${quote2})`;
    }
    return match;
  });

  if (changed) {
    await Deno.writeTextFile(path, after);
  }

  return { path, before, after, changed };
}

async function replaceAsync(
  str: string,
  regex: RegExp,
  asyncFn: (...args: unknown[]) => Promise<string>
): Promise<string> {
  const promises: Array<Promise<string>> = [];
  const parts: string[] = [];
  let lastIndex = 0;

  for (const match of str.matchAll(regex)) {
    const index = match.index ?? 0;
    parts.push(str.slice(lastIndex, index));
    promises.push(asyncFn(...(match as unknown as RegExpMatchArray)));
    lastIndex = index + match[0].length;
  }

  const replacements = await Promise.all(promises);
  let result = "";
  for (let i = 0; i < replacements.length; i++) {
    result += parts[i] + replacements[i];
  }
  result += str.slice(lastIndex);
  return result;
}

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(dir)) {
    const full = `${dir}${dir.endsWith("/") ? "" : "/"}${entry.name}`;
    if (entry.isDirectory) {
      yield* walk(full);
    } else if (entry.isFile && (full.endsWith(".ts") || full.endsWith(".tsx"))) {
      // Only process files in src/
      if (full.includes("/src/")) {
        yield full;
      }
    }
  }
}

async function main(): Promise<void> {
  const argPath = Deno.args[0];
  const edits: FileEdit[] = [];

  if (argPath) {
    let target = argPath;
    if (!argPath.startsWith("/")) {
      // resolve relative to CWD
      target = new URL(argPath, new URL("./", `file://${Deno.cwd()}/`)).pathname;
    }
    const stat = await Deno.stat(target);
    if (stat.isFile) {
      if (target.includes("/src/") && (target.endsWith(".ts") || target.endsWith(".tsx"))) {
        edits.push(await processFile(target));
      } else {
        console.log(`Skipping non-src or non-ts(x) file: ${target}`);
      }
    } else if (stat.isDirectory) {
      for await (const filePath of walk(target)) {
        edits.push(await processFile(filePath));
      }
    }
  } else {
    const srcPath = SRC_DIR.pathname;
    for await (const filePath of walk(srcPath)) {
      edits.push(await processFile(filePath));
    }
  }

  const changed = edits.filter((e) => e.changed);
  console.log(`Scanned ${edits.length} files. Updated ${changed.length} files.`);
  if (changed.length) {
    for (const e of changed) {
      console.log(`Updated: ${e.path}`);
    }
  }
}

if (import.meta.main) {
  await main();
}


