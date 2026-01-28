import Conf from 'conf';

/**
 * Model alias mapping for convenient shortcuts
 */
export const MODEL_ALIASES: Record<string, string> = {
  claude: 'claude-sonnet-4.5',
  sonnet: 'claude-sonnet-4.5',
  haiku: 'claude-haiku-4.5',
  opus: 'claude-opus-4.5',
  gpt: 'gpt-5',
  gpt5: 'gpt-5',
  codex: 'gpt-5.2-codex',
  gemini: 'gemini-3-pro-preview',
};

export interface CLIConfig {
  confluenceUrl: string;
  confluenceToken: string;
  defaultModel: string;
  availableModels: string[];
  firstRunComplete: boolean;
}

const schema = {
  confluenceUrl: {
    type: 'string' as const,
    default: '',
  },
  confluenceToken: {
    type: 'string' as const,
    default: '',
  },
  defaultModel: {
    type: 'string' as const,
    default: 'claude-sonnet-4.5',
  },
  availableModels: {
    type: 'array' as const,
    default: [] as string[],
  },
  firstRunComplete: {
    type: 'boolean' as const,
    default: false,
  },
};

export const config = new Conf<CLIConfig>({
  projectName: 'confluence-search-cli',
  schema,
});

/**
 * Resolve model alias to actual model ID
 */
export function resolveModel(modelOrAlias: string): string {
  return MODEL_ALIASES[modelOrAlias.toLowerCase()] || modelOrAlias;
}

/**
 * Get the effective model (from override or config)
 */
export function getEffectiveModel(override?: string): string {
  if (override) {
    return resolveModel(override);
  }
  return config.get('defaultModel');
}

/**
 * Check if first run setup is needed
 */
export function isFirstRun(): boolean {
  return !config.get('firstRunComplete');
}

/**
 * Mark first run as complete
 */
export function completeFirstRun(): void {
  config.set('firstRunComplete', true);
}

/**
 * Save available models from API
 */
export function saveAvailableModels(models: string[]): void {
  config.set('availableModels', models);
}

/**
 * Set default model
 */
export function setDefaultModel(model: string): void {
  config.set('defaultModel', resolveModel(model));
}

/**
 * Reset config to defaults
 */
export function resetConfig(): void {
  config.clear();
}

/**
 * Set Confluence URL
 */
export function setConfluenceUrl(url: string): void {
  config.set('confluenceUrl', url.trim());
}

/**
 * Get Confluence URL
 */
export function getConfluenceUrl(): string {
  return config.get('confluenceUrl');
}

/**
 * Set Confluence token
 */
export function setConfluenceToken(token: string): void {
  config.set('confluenceToken', token.trim());
}

/**
 * Get Confluence token
 */
export function getConfluenceToken(): string {
  return config.get('confluenceToken');
}

/**
 * Check if Confluence is configured
 */
export function isConfluenceConfigured(): boolean {
  return !!(getConfluenceUrl() && getConfluenceToken());
}

/**
 * Get config file path (for display)
 */
export function getConfigPath(): string {
  return config.path;
}
