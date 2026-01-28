import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import logSymbols from 'log-symbols';
import gradient from 'gradient-string';
import { getConfluenceUrl, getConfluenceToken, isConfluenceConfigured } from '../lib/config.js';

interface SearchOptions {
  phrase: string;
  limit?: number;
  model?: string | undefined;
}

interface SearchResult {
  id: string;
  title: string;
  space: string;
  excerpt: string;
  url: string;
}

/**
 * Search Confluence for documents matching the phrase
 */
export async function searchConfluence(options: SearchOptions) {
  const spinner = ora();

  try {
    // Check if Confluence is configured
    if (!isConfluenceConfigured()) {
      spinner.fail('Confluence not configured');
      console.log(
        boxen(
          chalk.yellow('⚠️  Environment variables required\n\n') +
            chalk.white('Set your Confluence credentials:\n\n') +
            chalk.cyan('export CONFLUENCE_URL=<url>\n') +
            chalk.cyan('export CONFLUENCE_TOKEN=<token>\n\n') +
            chalk.dim('Example URL: https://yourcompany.atlassian.net/wiki/api/v2\n') +
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
    const limit = options.limit || 10;

    spinner.start(chalk.cyan(`Searching Confluence for "${chalk.bold(options.phrase)}"...`));

    // Query Confluence API
    const searchUrl = new URL(`${confluenceUrl.replace(/\/$/, '')}/api/v2/search`);
    searchUrl.searchParams.append('text', options.phrase);
    searchUrl.searchParams.append('limit', limit.toString());

    const response = await fetch(searchUrl.toString(), {
      headers: {
        Authorization: `Bearer ${confluenceToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        spinner.fail('Authentication failed');
        console.log(
          chalk.red(logSymbols.error),
          'Invalid Confluence token. Please update your configuration.'
        );
      } else if (response.status === 404) {
        spinner.fail('Not found');
        console.log(
          chalk.red(logSymbols.error),
          'Confluence URL not found. Please verify your configuration.'
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
        container?: { title: string };
        excerpt?: string;
        _links?: { webui?: string };
      }>;
    } = (await response.json()) as {
      results?: Array<{
        id: string;
        title: string;
        container?: { title: string };
        excerpt?: string;
        _links?: { webui?: string };
      }>;
    };

    const results: SearchResult[] =
      data.results?.map((item) => ({
        id: item.id,
        title: item.title || 'Untitled',
        space: item.container?.title || 'Unknown',
        excerpt: item.excerpt ? item.excerpt.replace(/<[^>]*>/g, '') : 'No preview available',
        url: `${confluenceUrl.replace(/\/$/, '')}/wiki${item._links?.webui || ''}`,
      })) || [];

    spinner.succeed(`Found ${results.length} result${results.length !== 1 ? 's' : ''}`);

    if (results.length === 0) {
      console.log(chalk.gray('No documents found matching your search.\nTry different keywords.'));
      return;
    }

    // Display results with beautiful formatting
    for (let i = 0; i < results.length; i++) {
      const result = results[i]!;
      const gradientText = gradient(['#0052CC', '#00A4EF']);

      const heading = gradientText(`[${i + 1}/${results.length}] ${result.title}`);
      const content =
        chalk.gray(`📁 Space: `) +
        chalk.cyan(result.space) +
        '\n\n' +
        chalk.gray('📄 Preview:\n') +
        chalk.white(result.excerpt.substring(0, 200)) +
        (result.excerpt.length > 200 ? chalk.gray('...') : '') +
        '\n\n' +
        chalk.dim(`🔗 ${result.url}`);

      console.log(
        boxen(heading + '\n' + content, {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: '#0052CC',
        })
      );
    }

    console.log(
      chalk.dim(`\n✨ Search completed in Confluence | Page 1/${Math.ceil(results.length / limit)}`)
    );
  } catch (error) {
    spinner.fail('Search error');
    console.error(
      chalk.red(logSymbols.error),
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
    process.exit(1);
  }
}
