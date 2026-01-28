#!/usr/bin/env bun
/**
 * Development wrapper that allows `bun dev <phrase>` to work as `bun dev -- search <phrase>`
 * If the first argument is not a known command, it's treated as a search phrase.
 */

const args = process.argv.slice(2);
const commands = ['search', 'config', 'auth', 'help', '--help', '-h', '-V', '--version', '-m', '--model'];

// If first arg doesn't look like a command or flag, treat it as a search phrase
if (args.length > 0 && !commands.includes(args[0]) && !args[0].startsWith('-')) {
  args.unshift('search');
}

// If no arguments, show help
if (args.length === 0) {
  args.push('--help');
}

// Update process.argv for the CLI to use
process.argv = ['bun', 'confluence-search', ...args];

// Now import and run the CLI
await import('./src/index.ts');


