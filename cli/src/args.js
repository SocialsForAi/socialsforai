/** Flags that never take a value. Everything else takes the next argument (or `--flag=value`). */
export const BOOLEAN_FLAGS = new Set([
  "help",
  "version",
  "dry-run",
  "approval",
  "wait",
  "no-wait",
  "require-approval",
  "force",
  "no-save",
]);

/** Flags that may be given more than once; their values are collected into an array. */
export const REPEATABLE_FLAGS = new Set(["media"]);

const ALIASES = { h: "help", v: "version" };

export class UsageError extends Error {}

/**
 * Minimal argv parser: positionals, `--flag value`, `--flag=value`, boolean flags, `--` to stop.
 * Returns { positionals: string[], flags: Record<string, string | boolean | string[]> }.
 */
export function parseArgs(argv) {
  const positionals = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--") {
      positionals.push(...argv.slice(i + 1));
      break;
    }
    if (/^-[a-zA-Z]$/.test(arg) && ALIASES[arg[1]]) {
      flags[ALIASES[arg[1]]] = true;
      continue;
    }
    if (!arg.startsWith("--") || arg === "--") {
      positionals.push(arg);
      continue;
    }
    const eq = arg.indexOf("=");
    const name = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
    let value;
    if (BOOLEAN_FLAGS.has(name)) {
      value = eq === -1 ? true : arg.slice(eq + 1) !== "false";
    } else if (eq !== -1) {
      value = arg.slice(eq + 1);
    } else {
      if (i + 1 >= argv.length) throw new UsageError(`--${name} needs a value.`);
      value = argv[++i];
    }
    if (REPEATABLE_FLAGS.has(name)) {
      (flags[name] ??= []).push(value);
    } else {
      flags[name] = value;
    }
  }
  return { positionals, flags };
}

export function list(value) {
  if (value === undefined || value === true) return undefined;
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function integer(value, flag) {
  if (value === undefined) return undefined;
  const n = Number(value);
  if (!Number.isInteger(n)) throw new UsageError(`--${flag} must be a whole number.`);
  return n;
}

export function jsonFlag(value, flag) {
  if (value === undefined) return undefined;
  try {
    return JSON.parse(String(value));
  } catch {
    throw new UsageError(`--${flag} must be valid JSON.`);
  }
}
