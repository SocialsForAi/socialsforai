#!/usr/bin/env node
import { main } from "../src/cli.js";

main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (err) => {
    process.stderr.write(`${JSON.stringify({ error: { code: "cli_crash", message: String(err?.message ?? err) } }, null, 2)}\n`);
    process.exitCode = 1;
  },
);
