# Release Description Automation

This directory contains the automation system for generating GitHub Release descriptions in English (en-US).

## Overview

The release description automation follows a structured workflow to generate standardized release notes based on Git history analysis and predefined templates.

## Command Usage

```bash
# Generate release description for stable releases
--nodeVersion release

# Generate release description for preview releases  
--nodeVersion preview
```

Or using npm scripts:

```bash
# Generate with npm (add --nodeVersion parameter)
npm run generate:release-description -- --nodeVersion release
npm run generate:release-description -- --nodeVersion preview
```

Or directly:

```bash
# Direct execution
node scripts/generate-release-description.js --nodeVersion release
node scripts/generate-release-description.js --nodeVersion preview
```

## Automation Flow

### Phase 1: Input Validation
- Validates `{{VersioType}}` parameter (release|preview)
- Reads version from `package.json`
- Converts version to hyphenated format for filename

### Phase 2: Git Analysis
- Determines commit range (last tag → HEAD)
- Categorizes commits:
  - **Features**: `feat:`, `feature:`
  - **Fixes**: `fix:`, `bug:`
  - **Breaking Changes**: `breaking:`, `!:`
  - **Improvements**: `perf:`, `improve:`
  - **Documentation**: `docs:`, `doc:`
  - **Maintenance**: Other commits

### Phase 3: Directory Management
- Targets `DeploymentPackage/{{VersioType}}/` folder
- Cleans existing `.md` files before generation

### Phase 4: Template Processing
- Loads English (en-US) template from `Template-{{VersioType}}.md`
- Fills template with analyzed data
- Ensures all content is in English (en-US)

### Phase 5: File Generation
- Saves as `node-OYI-{{VersioType}}-v{{Version(with-hyphens)}}.md`
- Example: `node-OYI-release-v2-0-0.md`

## File Structure

```
DeploymentPackage/
├── Template-Release.md          # English template for stable releases
├── Template-Preview.md          # English template for preview releases
├── Release/                     # Generated stable release descriptions
│   └── node-OYI-release-v*.md
└── Preview/                     # Generated preview release descriptions
    └── node-OYI-preview-v*.md
```

## GitHub Actions Integration

The generated `.md` files are designed to be consumed by GitHub Actions workflows:

1. **Read**: Workflow reads the generated `.md` file
2. **Publish**: Uses content as GitHub Release description
3. **Mark**: Sets appropriate release type (release/pre-release)
4. **Cleanup**: Deletes the `.md` file after successful consumption

## Language Requirements

- **Mandatory**: All content MUST be in English (en-US)
- **Scope**: Templates, categories, summaries, error messages
- **Validation**: Content verification before saving/publishing

## Template Variables

### Common Variables
- `{{VERSION}}` - Version from package.json
- `{{DATE}}` - Current date in en-US format
- `{{COMMIT_SHA}}` - Current commit hash

### Auto-generated Content
- Categorized commit lists
- Change summaries
- Generation timestamp

## Error Handling

- **Missing Template**: Clear English error message
- **No Changes**: "No user-facing changes." message
- **Invalid Version**: Validation with English messages
- **File Operations**: Detailed logging in English

## Best Practices

1. **Commit Conventions**: Use Conventional Commits for better categorization
2. **Template Maintenance**: Keep templates updated and in English
3. **Version Sync**: Ensure `package.json` version is current
4. **Testing**: Test automation before important releases

## Examples

### Successful Generation
```bash
$ npm run generate:release-description -- --nodeVersion preview

🚀 Starting release description automation...
📝 Phase 1: Input validation
   Version Type: preview
   Version: current
📊 Phase 2: Git analysis
   Features: 2, Fixes: 1, Breaking changes: 0
✅ Generated: node-OYI-preview-v2-0-0.md
```

### Usage in Workflow
```yaml
# GitHub Actions example
- name: Generate Release Description
  run: npm run generate:release-description -- --nodeVersion release

- name: Create GitHub Release
  uses: actions/create-release@v1
  with:
    body_path: DeploymentPackage/Release/node-OYI-release-v${{ steps.version.outputs.value }}.md
    prerelease: false
```

## Troubleshooting

### Common Issues
1. **Template not found**: Ensure `Template-Release.md` and `Template-Preview.md` exist
2. **Git history empty**: Check that repository has commits and tags
3. **Permission errors**: Verify write permissions to DeploymentPackage directory
4. **Invalid version**: Check `package.json` version format

### Validation Commands
```bash
# Check templates exist
ls DeploymentPackage/Template-*.md

# Check package.json version
node -e "console.log(require('./package.json').version)"

# Check Git history
git log --oneline -10
```
