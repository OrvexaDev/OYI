# Troubleshooting Guide

This guide helps resolve common issues with the OYI extension, particularly those that might occur in CI/CD environments or different operating systems.

## 🐛 Common Issues

### Ubuntu/Linux Test Failures

**Problem**: Tests fail on Ubuntu in GitHub Actions with `Missing X server or $DISPLAY` errors.

**Symptoms**:
- CI pipeline shows test failures on Ubuntu
- Error messages: `Missing X server or $DISPLAY`
- `The platform failed to initialize. Exiting.`
- Exit code: SIGSEGV

**Root Cause**: VS Code requires a graphical environment to initialize, even in test mode.

**Solutions**:

1. **Correct xvfb Setup** (implemented in our CI):
   ```bash
   # Install required packages
   sudo apt-get update -qq
   sudo apt-get install -y xvfb libxss1 libgtk-3-0 libgtk-3-dev libgconf-2-4 libnss3 libxrandr2 libasound2 libatk1.0-0 libdrm2 libxcomposite1 libxdamage1 libxfixes3 libatspi2.0-0 libxss1 libgbm1
   
   # Run tests with virtual display
   xvfb-run -a --server-args="-screen 0 1024x768x24 -ac +extension RANDR" npm test
   ```

2. **Environment Variables**:
   ```bash
   export VSCODE_TEST_ENV=true
   export NODE_ENV=test
   export CI=true
   export DISPLAY=:99.0
   export ELECTRON_DISABLE_GPU=true
   export ELECTRON_DISABLE_SECURITY_WARNINGS=true
   ```

3. **VS Code Test Configuration** (.vscode-test.mjs):
   ```javascript
   export default defineConfig({
     files: 'out/test/**/*.test.js',
     env: {
       VSCODE_TEST_ENV: 'true',
       NODE_ENV: 'test'
     },
     launchArgs: process.env.CI ? [
       '--disable-gpu', 
       '--no-sandbox', 
       '--disable-dev-shm-usage',
       '--disable-extensions',
       '--disable-background-timer-throttling',
       '--disable-backgrounding-occluded-windows',
       '--disable-renderer-backgrounding'
     ] : [],
     timeout: process.env.CI ? 60000 : 30000
   });
   ```

4. **Test Scripts**: Use our provided scripts:
   ```bash
   npm run test:ubuntu  # For Ubuntu-specific testing
   npm run test:basic   # For basic compatibility check
   ```

### CodeQL Security Analysis Failures

**Problem**: CodeQL fails to upload results with permission errors.

**Symptoms**:
- GitHub Actions shows "Upload failed: 422 Unprocessable Entity"
- Error mentions insufficient permissions for security-events
- CodeQL analysis completes but upload fails

**Root Cause**: Missing required permissions for CodeQL to upload security analysis results.

**Solution**:

Update your workflow permissions in `.github/workflows/ci.yml`:

```yaml
permissions:
  contents: read
  security-events: write
  actions: read
  # For CodeQL analysis and result upload
```

Ensure CodeQL step has proper configuration:

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v3
  with:
    languages: typescript

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v3
  with:
    category: "/language:typescript"
```

### Security Analysis Failures

**Problem**: npm audit fails with moderate vulnerabilities.

**Solutions**:

1. **Adjust Audit Level**:
   ```bash
   npm audit --audit-level=high
   ```

2. **Continue on Error** (for CI):
   ```yaml
   - name: Run npm audit
     run: |
       npm audit --audit-level=moderate || echo "⚠️ Some vulnerabilities found, but continuing build"
       npm audit --audit-level=critical --audit-level=high
     continue-on-error: true
   ```

### IDE Detection Issues

**Problem**: Extension doesn't detect installed IDEs.

**Solutions**:

1. **Check Platform Support**:
   Ensure the IDE supports your platform:
   ```typescript
   const supportedPlatforms = ['win32', 'darwin', 'linux'];
   ```

2. **Custom Paths**:
   Configure custom IDE paths in VS Code settings:
   ```json
   {
     "oyi.customPaths": {
       "rider": "/custom/path/to/rider",
       "intellij": "/custom/path/to/idea"
     }
   }
   ```

3. **Path Validation**:
   The extension validates paths for security. Ensure paths don't contain:
   - Command injection characters: `;`, `&`, `|`, `` ` ``, `$`, `(`, `)`, `{`, `}`, `[`, `]`
   - Directory traversal: `..`
   - Command flags: starting with `-`
   - Null bytes: `\0`

### Performance Issues

**Problem**: Extension is slow to detect IDEs or process files.

**Solutions**:

1. **Limit File Scanning**:
   The extension scans for project files. Large projects might be slow.

2. **Disable Unused IDEs**:
   ```json
   {
     "oyi.enabledIDEs": ["visualstudio", "rider", "intellij"]
   }
   ```

3. **Cache IDE Paths**:
   Once detected, IDE paths are cached for better performance.

## 🔧 Platform-Specific Issues

### Windows

**Problem**: Visual Studio detection fails.

**Solution**:
- Install vswhere.exe (usually in VS installer)
- Check registry entries for VS installations
- Verify devenv.exe paths

### macOS

**Problem**: App bundle paths not recognized.

**Solution**:
- Use full path to executable inside app bundle
- Example: `/Applications/Xcode.app/Contents/MacOS/Xcode`

### Linux

**Problem**: Shell scripts not executable.

**Solution**:
- Ensure IDE shell scripts have execute permissions
- Check shebang lines in scripts
- Verify PATH environment variable

## 🛠️ Development Issues

### TypeScript Errors

**Problem**: Type checking fails.

**Solution**:
```bash
npm run check-types
```

### ESLint Warnings

**Problem**: Linting fails with unused variables.

**Common Fix**:
```typescript
// Instead of
.filter(([_, ide]) => condition)

// Use
.filter(([, ide]) => condition)
```

### Test Environment

**Problem**: Tests behave differently in different environments.

**Solution**:
Check environment variables:
```typescript
const isTestEnv = process.env['NODE_ENV'] === 'test' || 
                 process.env['VSCODE_TEST_ENV'] === 'true' ||
                 process.env['CI'] === 'true';
```

## 📊 Debugging

### Enable Debug Logging

Set these environment variables for verbose logging:
```bash
DEBUG=oyi:*
VSCODE_LOG_LEVEL=trace
```

### Check Extension Logs

1. Open VS Code
2. Go to Help → Toggle Developer Tools
3. Check Console for errors

### Verify Configuration

Check your settings:
```bash
code --list-extensions | grep oyi
```

## 🆘 Getting Help

If you're still experiencing issues:

1. **Check GitHub Issues**: [https://github.com/OrvexaDev/OYI/issues](https://github.com/OrvexaDev/OYI/issues)
2. **Create Bug Report**: Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml)

### Bug Report Information

When reporting bugs, include:

- Operating System and version
- VS Code version
- Extension version
- Error messages from Developer Tools console
- Steps to reproduce the issue
- Expected vs actual behavior

---

Made with ❤️ by [Orvexa by KAGEYOSHI](https://github.com/OrvexaDev)
