import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import logSymbols from 'log-symbols';
import Table from 'cli-table3';
import {
  getConfluenceUrl,
  getConfluenceToken,
  getConfluenceUsername,
  isConfluenceConfigured,
} from '../lib/config.js';
import { showBanner } from '../lib/banner.js';

/**
 * Create an OSC 8 hyperlink that works in VS Code terminal and other modern terminals.
 * This works in VS Code terminal, Windows Terminal, and other modern terminals.
 */
function hyperlink(text: string, url: string): string {
  // OSC 8 hyperlink format: \x1b]8;;URL\x07TEXT\x1b]8;;\x07
  return `\x1b]8;;${url}\x07${text}\x1b]8;;\x07`;
}

interface SearchOptions {
  phrase: string;
  limit?: number;
  model?: string | undefined;
}

interface SearchResult {
  id: string;
  title: string;
  space: string;
  spaceKey: string;
  url: string;
  updatedBy: string;
  updatedDate: string;
}

/**
 * Search Confluence for documents matching the phrase
 */
export async function searchConfluence(options: SearchOptions) {
  const spinner = ora();

  try {
    // Show beautiful banner
    showBanner({ showTaglines: false });

    // Check if Confluence is configured
    if (!isConfluenceConfigured()) {
      spinner.fail('Confluence not configured');
      console.log(
        boxen(
          chalk.yellow('⚠️  Environment variables required\n\n') +
            chalk.white('Set your Atlassian credentials:\n\n') +
            chalk.cyan('ATLASSIAN_API_TOKEN=<token>\n') +
            chalk.cyan('ATLASSIAN_EMAIL=<your-email>\n\n') +
            chalk.dim('Optional (defaults to Relias):\n') +
            chalk.cyan('ATLASSIAN_URL=<confluence-url>\n\n') +
            chalk.dim(
              'Create API token: https://id.atlassian.com/manage-profile/security/api-tokens'
            ),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'yellow',
            title: 'Setup Required',
            titleAlignment: 'center',
          }
        )
      );
      process.exit(1);
    }

    const confluenceUrl = getConfluenceUrl();
    const confluenceToken = getConfluenceToken();
    const confluenceUsername = getConfluenceUsername();
    const limit = options.limit || 10;

    spinner.start(chalk.cyan(`Searching Confluence for "${chalk.bold(options.phrase)}"...`));

    // Query Confluence REST API (v1 CQL search)
    const searchUrl = new URL(`${confluenceUrl.replace(/\/$/, '')}/rest/api/content/search`);
    searchUrl.searchParams.append('cql', `type=page AND text~"${options.phrase}"`);
    searchUrl.searchParams.append('limit', limit.toString());
    searchUrl.searchParams.append('expand', 'space,history,version');

    // Use Basic auth (email:token) like the reference project
    const authString = confluenceUsername
      ? Buffer.from(`${confluenceUsername}:${confluenceToken}`).toString('base64')
      : Buffer.from(`user:${confluenceToken}`).toString('base64');

    const response = await fetch(searchUrl.toString(), {
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        spinner.fail('Authentication failed');
        console.log(
          chalk.red(logSymbols.error),
          'Invalid ATLASSIAN_API_TOKEN. Please check your token and username.'
        );
      } else if (response.status === 404) {
        spinner.fail('Not found');
        console.log(
          chalk.red(logSymbols.error),
          'Confluence API endpoint not found. Please verify CONFLUENCE_URL.'
        );
      } else {
        spinner.fail('Search failed');
        console.log(chalk.red(logSymbols.error), `HTTP ${response.status}: ${response.statusText}`);
      }
      process.exit(1);
    }

    const data: {
      results?: Array<{
        id: string;
        title: string;
        space?: { key: string; name: string };
        history?: { createdDate?: string };
        version?: { when?: string; by?: { displayName?: string } };
        _links?: { webui?: string };
      }>;
    } = (await response.json()) as {
      results?: Array<{
        id: string;
        title: string;
        space?: { key: string; name: string };
        history?: { createdDate?: string };
        version?: { when?: string; by?: { displayName?: string } };
        _links?: { webui?: string };
      }>;
    };

    const results: SearchResult[] =
      data.results?.map((item) => ({
        id: item.id,
        title: item.title || 'Untitled',
        space: item.space?.name || item.space?.key || 'Unknown',
        spaceKey: item.space?.key || '',
        // Use short pageId URL format to avoid cli-table3 truncation issues with long URLs
        url: `${confluenceUrl.replace(/\/$/, '')}/pages/viewpage.action?pageId=${item.id}`,
        updatedBy: item.version?.by?.displayName || 'Unknown',
        updatedDate: item.version?.when
          ? new Date(item.version.when).toISOString().split('T')[0]!
          : 'N/A',
      })) || [];

    spinner.stop();

    if (results.length === 0) {
      console.log(chalk.gray('No documents found matching your search.\nTry different keywords.'));
      return;
    }

    // Fixed column widths (like PRS project)
    const titleWidth = 60;
    const fixedWidths = { space: 8, updatedBy: 18, date: 12 };
    // Table width = sum of colWidths + 5 borders; banner content = table width - 2 (for ╔ and ╗)
    const bannerWidth =
      titleWidth + fixedWidths.space + fixedWidths.updatedBy + fixedWidths.date + 3;

    // Build header banner
    const titleText = `Confluence Search Results (${results.length} found)`;
    const currentTime = new Date().toLocaleTimeString();
    const centerPos = Math.floor(bannerWidth / 2);
    const centerStart = centerPos - Math.floor(titleText.length / 2);
    const spacesToCenter = Math.max(1, centerStart - 1);
    const spacesToRight = Math.max(
      1,
      bannerWidth - spacesToCenter - titleText.length - currentTime.length - 2
    );

    const styledLine =
      ' ' +
      ' '.repeat(spacesToCenter) +
      titleText +
      ' '.repeat(spacesToRight) +
      chalk.dim(currentTime) +
      ' ';

    console.log(chalk.cyan.bold(`╔${'═'.repeat(bannerWidth)}╗`));
    console.log(chalk.cyan.bold('║') + styledLine + chalk.cyan.bold('║'));
    console.log(chalk.cyan.bold(`╚${'═'.repeat(bannerWidth)}╝`));

    // Create table with fixed column widths (required for hyperlinks to display correctly)
    const table = new Table({
      head: [
        chalk.cyan.bold('Title'),
        chalk.cyan.bold('Space'),
        chalk.cyan.bold('Updated By'),
        chalk.cyan.bold('Date'),
      ],
      style: {
        head: [],
        border: ['cyan'],
        compact: false,
      },
      chars: {
        top: '─',
        'top-mid': '┬',
        'top-left': '┌',
        'top-right': '┐',
        bottom: '─',
        'bottom-mid': '┴',
        'bottom-left': '└',
        'bottom-right': '┘',
        left: '│',
        'left-mid': '├',
        mid: '─',
        'mid-mid': '┼',
        right: '│',
        'right-mid': '┤',
        middle: '│',
      },
      colWidths: [titleWidth, fixedWidths.space, fixedWidths.updatedBy, fixedWidths.date],
      wordWrap: false,
    });

    // Add rows - truncate titles first, then apply hyperlink (like PRS)
    for (const result of results) {
      let title = result.title;
      const maxTitleLen = titleWidth - 4;
      if (title.length > maxTitleLen) {
        title = `${title.substring(0, maxTitleLen - 3)}...`;
      }

      // Create clickable link using OSC 8 hyperlink escape sequences
      // This works in VS Code terminal, Windows Terminal, and other modern terminals
      const titleLink = chalk.cyan(hyperlink(title, result.url));

      table.push([
        titleLink,
        chalk.yellow(result.spaceKey),
        chalk.dim(result.updatedBy),
        chalk.gray(result.updatedDate),
      ]);
    }

    console.log(table.toString());
  } catch (error) {
    spinner.fail('Search error');
    console.error(
      chalk.red(logSymbols.error),
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
    process.exit(1);
  }
}
