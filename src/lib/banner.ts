import chalk from 'chalk';
import gradient from 'gradient-string';

// Confluence search CLI logo
// Generate ASCII art at: https://patorjk.com/software/taag/
const LOGO_LINES = [
  '   ██████╗ ██████╗ ███╗   ██╗███████╗██╗     ██╗   ██╗███████╗███╗   ██╗ ██████╗███████╗',
  '  ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║     ██║   ██║██╔════╝████╗  ██║██╔════╝██╔════╝',
  '  ██║     ██║   ██║██╔██╗ ██║███████╗██║     ██║   ██║█████╗  ██╔██╗ ██║██║     █████╗  ',
  '  ██║     ██║   ██║██║╚██╗██║╚════██║██║     ██║   ██║██╔══╝  ██║╚██╗██║██║     ██╔══╝  ',
  '  ╚██████╗╚██████╔╝██║ ╚████║███████║███████╗╚██████╔╝███████╗██║ ╚████║╚██████╗███████╗',
  '   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝',
  '                                    Search',
];

// Gradient definitions (customize these!)
const vice = gradient(['#ff2e97', '#00f0ff']);
const gold = gradient(['#bf953f', '#fcf6ba', '#b38728', '#fbf5b7', '#aa771c']);
const greenGlow = gradient(['#00ff87', '#60efff']);

export interface BannerOptions {
  version?: string;
  showTaglines?: boolean;
}

/**
 * Display the CLI banner
 * Customize this for your tool!
 */
export function showBanner(options: BannerOptions = {}) {
  const { version = 'v1.0.0', showTaglines = true } = options;

  // Display logo with gradient
  for (const line of LOGO_LINES) {
    console.log(vice(line));
  }

  // Version
  console.log('  ' + greenGlow(`version ${version}`));

  // Branding
  console.log('  ' + gold('✦ by HemSoft Developments ✦'));

  // Optional taglines
  if (showTaglines) {
    console.log(chalk.dim('  ══════════════════════════════════════════════'));
    console.log(chalk.hex('#ff2e97')('  ⚡ ') + chalk.bold('Production-Ready CLI Template'));
    console.log(chalk.hex('#00f0ff')('  🤖 ') + chalk.dim('Powered by GitHub Copilot'));
  }

  console.log();
}

/**
 * Get just the logo as a string (for embedding elsewhere)
 */
export function getLogo(): string {
  return LOGO_LINES.map((line) => vice(line)).join('\n');
}

/**
 * Get the HemSoft branding line
 */
export function getBranding(): string {
  return gold('✦ by HemSoft Developments ✦');
}
