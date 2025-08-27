# Contributing to OYI - Open in your IDE

Thank you for your interest in contributing to **OYI - Open in your IDE**! This project is maintained by **Orvexa by KAGEYOSHI** and we welcome community contributions.

## 🤝 How to Contribute

### 1. Reporting Issues

- Use the [GitHub Issues](https://github.com/OrvexaDev/OYI/issues) to report bugs or request features
- Search existing issues before creating a new one
- Provide detailed information including:
  - Operating System and version
  - VS Code version
  - Extension version
  - Steps to reproduce the issue
  - Expected vs actual behavior

### 2. Suggesting Features

- Open a GitHub Issue with the label "enhancement"
- Describe the feature and its benefits
- Explain how it fits with the extension's goals

### 3. Code Contributions

#### Prerequisites

- Node.js (version 18 or higher)
- npm
- Git
- VS Code

#### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/OYI.git
cd OYI

# Install dependencies
npm install

# Start development
npm run watch
```

#### Development Workflow

1. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   - Press `F5` to run the extension in a new Extension Development Host window
   - Test the functionality thoroughly
   - Run tests: `npm test`

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add support for new IDE"
   ```

5. **Push and create a Pull Request**

#### Coding Standards

- **TypeScript**: Use TypeScript for all code
- **ESLint**: Follow the existing ESLint configuration
- **Comments**: Add JSDoc comments for functions and classes
- **Naming**: Use camelCase for variables and functions, PascalCase for classes
- **Formatting**: Use the existing Prettier configuration

#### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 4. Adding New IDE Support

To add support for a new IDE:

1. **Update IDE_DEFINITIONS** in `src/extension.ts`:
   ```typescript
   newIDE: {
     name: 'newIDE',
     displayName: 'New IDE Name',
     icon: '$(icon-name)',
     supportedExtensions: ['.ext1', '.ext2'],
     supportedPlatforms: ['win32', 'darwin', 'linux'],
     defaultPaths: {
       win32: ['C:\\Path\\To\\IDE\\ide.exe'],
       darwin: ['/Applications/IDE.app/Contents/MacOS/IDE'],
       linux: ['/usr/bin/ide', '/opt/ide/bin/ide']
     }
   }
   ```

2. **Add localization strings** in `l10n/bundle.l10n.json`

3. **Update configuration** in `package.json` (contributes.configuration.properties)

4. **Test thoroughly** on target platforms

### 5. Localization

We support multiple languages. To add or improve translations:

1. **Find the base file**: `l10n/bundle.l10n.json`
2. **Create/update language file**: `l10n/bundle.l10n.{locale}.json`
3. **Add translations** for all keys
4. **Test** the translations in VS Code

## 🏛️ Legal and Attribution

### Intellectual Property

- **Trademark Protection**: The names "Orvexa", "KAGEYOSHI", and "Orvexa by KAGEYOSHI" are trademarks and must not be used without permission
- **Copyright**: All original code is copyrighted to Orvexa by KAGEYOSHI
- **Attribution**: Contributors retain copyright to their contributions but grant license to the project

### Contributor License Agreement (CLA)

By contributing to this project, you agree that:

1. **You grant** Orvexa by KAGEYOSHI a perpetual, worldwide, non-exclusive, royalty-free license to use, modify, and distribute your contributions
2. **You retain** copyright to your contributions
3. **You confirm** that you have the right to make the contribution
4. **You understand** that your contributions will be publicly available under the MIT license

### Attribution

All contributors will be recognized in the project documentation. Significant contributors may be listed in the README.md file.

## 🛡️ Security

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. **Email** orvexa.support@kageyoshi.com with details
3. **Allow time** for us to address the issue before public disclosure

## 📞 Contact

- **GitHub Issues**: For bugs and feature requests
- **Email**: orvexa.support@kageyoshi.com for other inquiries

## 📜 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Be constructive** in feedback and discussions
- **Focus on** what is best for the community
- **Show empathy** towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Spamming or trolling
- Publishing private information without permission
- Any conduct that could reasonably be considered inappropriate

### Enforcement

Project maintainers have the right to remove, edit, or reject contributions that do not align with this Code of Conduct.

---

Thank you for contributing to **OYI - Open in your IDE**! Together, we can make development workflows more efficient for everyone.

**Orvexa by KAGEYOSHI** - *Innovation in Developer Tools*
