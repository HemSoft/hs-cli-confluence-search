import chalk from 'chalk';
import gradient from 'gradient-string';

// Confluence Search CLI logo
// Sleek compass/search icon theme
const LOGO_LINES = [
  '   ███████████╗    ███████████╗',
  '  ╔═══════════════╗╔═══════════════╗',
  '  ║               ║║               ║',
  '  ║    Search     ║║  Confluence   ║',
  '  ║               ║║               ║',
  '  ╚═══════════════╝╚═══════════════╝',
  '         🔍   ⚡   📚',
];

// Gradient definitions
const cyan = gradient(['#00f0ff', '#00ff87']);
const gold = gradient(['#bf953f', '#fcf6ba', '#b38728', '#fbf5b7', '#aa771c']);

export interface BannerOptions {
  version?: string;
  showTaglines?: boolean;
}

/**
 * Display the CLI banner with HemSoft branding
 */
export function showBanner(options: BannerOptions = {}) {
  const { version = '1.0.0', showTaglines = true } = options;

  console.log();

  // Display logo with gradient
  for (const line of LOGO_LINES) {
    console.log(cyan(line));
  }

  // Version and branding
  console.log('  ' + chalk.dim(`version ${version}`));
  console.log('  ' + gold('✦ by HemSoft Developments ✦'));

  // Optional taglines
  if (showTaglines) {
    console.log(chalk.dim('  ═══════════════════════════════════════════'));
    console.log(chalk.hex('#00ff87')('  ⚡ ') + chalk.bold('Find anything in Confluence fast'));
    console.log(chalk.hex('#00f0ff')('  🎯 ') + chalk.dim('Beautiful terminal experience'));
  }

  console.log();
}
