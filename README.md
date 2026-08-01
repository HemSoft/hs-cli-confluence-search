# HemSoft CLI Template

[![Set it Free Loop](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FHemSoft%2Fhs-cli-confluence-search%2Fmain%2Fsfl.json&query=%24.version&prefix=v&label=Set%20it%20Free%20Loop&color=FFD700&style=flat&logo=githubactions&logoColor=white)](https://github.com/HemSoft/set-it-free-loop)
<!-- SFL_BADGE: auto-updated by deploy-workflow.ps1 -->
# HemSoft CLI Template

> 🚀 A production-ready CLI template for building AI-powered command-line tools

This template provides a solid foundation for creating professional CLI tools with AI capabilities,
beautiful terminal UI, and enterprise-grade quality tooling.

## ✨ What's Included

### Core Infrastructure

- **🎨 Beautiful Terminal UI**
  - Gradient-styled help screens with `gradient-string`
  - ASCII logo/banner with customizable branding
  - Progress spinners with `ora`
  - Styled output with `chalk` and `boxen`
  - Interactive prompts with `inquirer`

- **🤖 AI Integration**
  - GitHub Copilot CLI SDK integration
  - AIService abstraction for easy AI operations
  - Configurable model selection
  - First-run setup wizard

- **⚙️ Configuration System**
  - Persistent settings with `conf` package
  - Model aliases for convenience
  - Cross-platform config storage
  - Environment-agnostic setup

- **🔐 Authentication**
  - GitHub CLI integration for auth
  - Multi-account support
  - Copilot access verification
  - Comprehensive auth help system

- **📦 Argument Parsing**
  - Commander.js with styled help
  - Global and command-specific options
  - Subcommands with clean organization
  - Custom help formatting

### Quality Tooling

- **✅ Pre-commit Hooks** (Husky + lint-staged)
  - Auto-lint on commit
  - Auto-format on commit
  - Type-check before commit
  - Zero-config quality enforcement

- **🔍 Linting & Formatting**
  - ESLint with TypeScript support
  - Prettier for consistent formatting
  - Strict TypeScript configuration
  - Pre-configured rules for CLI development

- **🏗️ Build System**
  - TypeScript compilation
  - Source maps for debugging
  - Declaration files
  - Modern ES2022 target

### Development Environment

- **🐳 Dev Container Support**
  - Pre-configured Docker development environment
  - Node.js 22 LTS with TypeScript tooling
  - GitHub CLI pre-installed
  - Zsh with Oh My Zsh
  - All VS Code extensions included
  - Optimized for GitHub Copilot Workspace
  - Consistent development across all platforms

## 🚀 Quick Start

### 1. Clone This Template

```bash
# Clone to your new project directory
git clone <this-repo> my-awesome-cli
cd my-awesome-cli

# Remove template's git history
rm -rf .git

# Initialize your own repo
git init
```

### 2. Customize Your CLI

**Update `package.json`:**

```json
{
  "name": "@yourorg/your-cli-name",
  "description": "Your CLI description",
  "bin": {
    "your-cli": "dist/index.js"
  }
}
```

**Update branding in `src/lib/banner.ts`:**

- Change the ASCII logo (use [patorjk.com/software/taag](https://patorjk.com/software/taag/))
- Customize gradient colors
- Update branding text
- Modify version and taglines

**Update `src/lib/config.ts`:**

- Change `projectName` in the Conf constructor
- Add any custom config fields you need

**Update `src/index.ts`:**

- Change `program.name()` to your CLI name
- Update description
- Add your custom commands

**Update auth references:**
Find and replace in `src/commands/auth.ts` and `src/commands/config.ts`:

- `"HS CLI"` → Your CLI name
- `"hs-cli"` → Your CLI command name

### 3. Install Dependencies

```bash
npm install
```

This will:

- Install all dependencies
- Set up Husky pre-commit hooks automatically
- Configure git hooks for quality checks

### 4. Build and Test

```bash
# Build the project
npm run build

# Try the hello demo
npm run dev hello

# Check all quality tooling
npm run check
```

### 5. (Optional) Use Dev Container

For a consistent development environment across all platforms:

```bash
# Open in VS Code
code .

# Press F1 and select: Dev Containers: Reopen in Container
```

The dev container includes:

- Node.js 22 LTS with all dependencies
- GitHub CLI for authentication
- All VS Code extensions pre-installed
- Zsh shell with Oh My Zsh
- Automatic setup on container creation

See [`.devcontainer/README.md`](.devcontainer/README.md) for more details.

## 📖 Usage

### Development

```bash
# Run in dev mode with tsx (hot reload)
npm run dev [command]

# Build TypeScript
npm run build

# Run built version
npm start [command]
```

### Quality Checks

```bash
# Lint TypeScript files
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check

# Run all checks
npm run check
```

### Pre-commit Hooks

The template includes automatic quality checks that run before every commit:

- ✅ **ESLint** on staged files with auto-fix
- ✅ **Prettier** formatting on staged files  
- ✅ **TypeScript** type checking

If any check fails, the commit is blocked until you fix the issues.

**To skip hooks** (not recommended):

```bash
git commit --no-verify
```

## 🏗️ Project Structure

```text
hs-cli-template/
├── src/
│   ├── index.ts              # Main CLI entry point
│   ├── commands/             # Command implementations
│   │   ├── auth.ts          # GitHub authentication
│   │   ├── config.ts        # Configuration management
│   │   └── hello.ts         # Demo command (customize/remove)
│   └── lib/                 # Core services
│       ├── ai.ts           # AI service with Copilot SDK
│       ├── banner.ts       # Branded ASCII logo
│       └── config.ts       # Configuration system
├── .devcontainer/          # Dev container configuration
│   ├── devcontainer.json  # Container setup
│   └── README.md          # Dev container docs
├── dist/                    # Compiled JavaScript (generated)
├── .gitattributes          # Line ending enforcement
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint rules
├── .prettierrc           # Prettier formatting
└── .husky/              # Git hooks (generated by Husky)
```

## 🎯 Adding Commands

### 1. Create Command File

Create `src/commands/your-command.ts`:

```typescript
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import logSymbols from 'log-symbols';
import { AIService } from '../lib/ai.js';

interface YourCommandOptions {
  option1?: string;
  model?: string;
}

export async function yourCommand(options: YourCommandOptions) {
  const ai = new AIService(undefined, options.model);
  const spinner = ora();

  try {
    spinner.start('Processing...');

    // Your command logic here
    const result = await ai.prompt('Your prompt here');

    spinner.succeed('Complete!');

    console.log(
      boxen(chalk.cyan(result), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
      })
    );
  } catch (error) {
    spinner.fail('Operation failed');
    console.error(
      chalk.red(logSymbols.error),
      error instanceof Error ? error.message : 'Unknown error'
    );
    process.exit(1);
  } finally {
    await ai.close();
  }
}
```

### 2. Register in index.ts

```typescript
import { yourCommand } from './commands/your-command.js';

program
  .command('your-command')
  .description('Your command description')
  .option('-o, --option1 <value>', 'Option description')
  .showHelpAfterError(true)
  .action((options) => yourCommand({ ...options, model: globalModel }));
```

## 🎨 Customizing UI

### Banner

Edit `src/lib/banner.ts`:

```typescript
// Change ASCII art
const LOGO_LINES = [
  '  Your ASCII',
  '  Logo Here',
];

// Customize gradients
const myGradient = gradient(['#ff0000', '#00ff00']);

// Update showBanner() function
```

### Styled Help

The template includes custom help styling with:

- Lightning bolt for Usage
- Gradient-decorated section headers
- Italic gold descriptions with sparkles
- Custom symbols for Options/Commands

Modify `styleHelpText()` in `src/index.ts` to customize.

## 🤖 AI Service

The `AIService` class provides a simple interface for AI operations:

```typescript
import { AIService } from '../lib/ai.js';

const ai = new AIService('Your custom system message', 'claude');

// Send a prompt
const response = await ai.prompt('Your question here');

// Always close when done
await ai.close();
```

**Tips:**

- Use different system messages for different use cases
- Model can be overridden per instance
- Always call `close()` (use try/finally)
- Session persists across multiple prompts

## ⚙️ Configuration

The template uses `conf` for persistent configuration:

```typescript
import { config } from '../lib/config.js';

// Get values
const model = config.get('defaultModel');

// Set values
config.set('yourKey', 'yourValue');

// Add schema in src/lib/config.ts
export interface CLIConfig {
  defaultModel: string;
  yourKey: string;  // Add your fields
}
```

Config is stored at:

- Windows: `%APPDATA%/hs-cli/Config/config.json`
- macOS: `~/Library/Preferences/hs-cli/Config/config.json`
- Linux: `~/.config/hs-cli/Config/config.json`

## 🔧 TypeScript Configuration

The template uses strict TypeScript settings:

- `strict: true` - All strict checks
- `noUnusedLocals: true` - No unused variables
- `noImplicitReturns: true` - Explicit returns
- `noUncheckedIndexedAccess: true` - Safe array access
- `exactOptionalPropertyTypes: true` - Precise optionals

## 📦 Dependencies

### Production

- `@github/copilot-sdk` - AI capabilities
- `commander` - CLI framework
- `chalk`, `boxen`, `ora` - Terminal styling
- `gradient-string` - Gradient text
- `inquirer` - Interactive prompts
- `conf` - Configuration storage
- `cli-table3` - Table formatting
- `log-symbols` - Status symbols

### Dev Dependencies

- `typescript` - Type system
- `tsx` - TypeScript execution
- `eslint` - Linting
- `prettier` - Formatting
- `husky` - Git hooks
- `lint-staged` - Pre-commit linting

## 📝 Best Practices

### Command Implementation

✅ **Do:**

- Always close AIService in finally block
- Use spinners for long operations
- Provide helpful error messages
- Include progress feedback
- Handle errors gracefully

❌ **Don't:**

- Leave sessions open
- Use console.log for commands (use chalk/boxen)
- Forget to call `process.exit(1)` on errors
- Skip input validation

### Code Quality

✅ **Do:**

- Write type-safe code
- Use Prettier formatting
- Follow ESLint rules
- Write descriptive comments
- Test before committing

❌ **Don't:**

- Use `any` types
- Skip type annotations
- Ignore linting errors
- Bypass pre-commit hooks (without good reason)

## 🚢 Publishing

### 1. Build and Test

```bash
npm run check
npm run build
```

### 2. Update Version

```bash
npm version patch|minor|major
```

### 3. Publish to npm

```bash
npm publish --access public
```

### 4. Install Globally

```bash
npm install -g @yourorg/your-cli-name
```

## 🤝 Contributing to Your CLI

This template is designed to be customized for your specific CLI tool. Once you've created your CLI:

1. Remove or replace the `hello` demo command
2. Update this README for your CLI's specific features
3. Add your commands in `src/commands/`
4. Customize the banner and branding
5. Update auth messages if needed
6. Add any domain-specific services to `src/lib/`

## 📄 License

MIT © HemSoft Developments

## 🔗 Related

- [GitHub Copilot CLI SDK](https://github.com/github/copilot-cli-sdk)
- [Commander.js](https://github.com/tj/commander.js)
- [Chalk](https://github.com/chalk/chalk)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

---

Built with ❤️ by HemSoft Developments

This template is based on the architecture of Smart Git CLI
