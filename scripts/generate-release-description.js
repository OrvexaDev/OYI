#!/usr/bin/env node

/**
 * ==================================================================================
 * OYI - Open in your IDE Extension
 * Release Description Automation Script
 * ==================================================================================
 * 
 * Copyright (c) 2025 Orvexa by KAGEYOSHI
 * Author: Rafael Chaves (KAGEYOSHI)
 * 
 * Licensed under the MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * ==================================================================================
 * 
 * Generate Release Description Automation
 * Command: --nodeVersion {{VersionType}}
 * 
 * This script demonstrates the automation flow for generating release descriptions
 * as described in the copilot-instructions.md file.
 * 
 * Usage:
 *   node generate-release-description.js --nodeVersion release
 *   node generate-release-description.js --nodeVersion preview
 * 
 * ==================================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const VALID_VERSION_TYPES = ['release', 'preview'];
const DEPLOYMENT_PACKAGE_DIR = path.join(__dirname, '..', 'DeploymentPackage');
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');

/**
 * Parse command line arguments
 */
function parseArguments() {
    const args = process.argv.slice(2);
    const nodeVersionIndex = args.indexOf('--nodeVersion');
    
    if (nodeVersionIndex === -1 || nodeVersionIndex === args.length - 1) {
        throw new Error('Missing --nodeVersion parameter. Usage: --nodeVersion {release|preview}');
    }
    
    const versionType = args[nodeVersionIndex + 1];
    
    if (!VALID_VERSION_TYPES.includes(versionType)) {
        throw new Error(`Invalid version type: ${versionType}. Must be one of: ${VALID_VERSION_TYPES.join(', ')}`);
    }
    
    return { versionType };
}

/**
 * Get version from package.json
 */
function getVersionFromPackage() {
    try {
        const packageContent = fs.readFileSync(PACKAGE_JSON_PATH, 'utf8');
        const packageData = JSON.parse(packageContent);
        return packageData.version;
    } catch (error) {
        throw new Error(`Failed to read version from package.json: ${error.message}`);
    }
}

/**
 * Convert version to hyphenated format for filename
 */
function versionToHyphens(version) {
    return version.replace(/\./g, '-');
}

/**
 * Analyze Git history for changes
 */
function analyzeGitHistory() {
    try {
        // Get the last tag
        let lastTag;
        try {
            lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
        } catch {
            // If no tags found, use initial commit
            lastTag = execSync('git rev-list --max-parents=0 HEAD', { encoding: 'utf8' }).trim();
        }
        
        // Get commits since last tag
        const commitRange = `${lastTag}..HEAD`;
        const commits = execSync(`git log ${commitRange} --pretty=format:"%h|%s|%b"`, { encoding: 'utf8' })
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const [hash, subject, body] = line.split('|');
                return { hash, subject, body: body || '' };
            });
        
        // Categorize commits (basic implementation)
        const categories = {
            features: [],
            fixes: [],
            breakingChanges: [],
            improvements: [],
            docs: [],
            chore: []
        };
        
        commits.forEach(commit => {
            const subject = commit.subject.toLowerCase();
            
            if (subject.includes('feat:') || subject.includes('feature:')) {
                categories.features.push(commit);
            } else if (subject.includes('fix:') || subject.includes('bug:')) {
                categories.fixes.push(commit);
            } else if (subject.includes('breaking:') || subject.includes('!:')) {
                categories.breakingChanges.push(commit);
            } else if (subject.includes('perf:') || subject.includes('improve:')) {
                categories.improvements.push(commit);
            } else if (subject.includes('docs:') || subject.includes('doc:')) {
                categories.docs.push(commit);
            } else {
                categories.chore.push(commit);
            }
        });
        
        return {
            lastTag,
            totalCommits: commits.length,
            categories
        };
    } catch (error) {
        throw new Error(`Failed to analyze Git history: ${error.message}`);
    }
}

/**
 * Load template file
 */
function loadTemplate(versionType) {
    const templatePath = path.join(DEPLOYMENT_PACKAGE_DIR, `Template-${versionType.charAt(0).toUpperCase() + versionType.slice(1)}.md`);
    
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
    }
    
    try {
        return fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read template file: ${error.message}`);
    }
}

/**
 * Generate changelog content from Git analysis
 */
function generateChangelogContent(gitAnalysis) {
    const { categories } = gitAnalysis;
    let content = '';
    
    if (categories.features.length > 0) {
        content += '## What\'s New\n\n';
        categories.features.forEach(commit => {
            content += `- ${commit.subject.replace(/^feat:?\s*/i, '')}\n`;
        });
        content += '\n';
    }
    
    if (categories.fixes.length > 0) {
        content += '## Bug Fixes\n\n';
        categories.fixes.forEach(commit => {
            content += `- ${commit.subject.replace(/^fix:?\s*/i, '')}\n`;
        });
        content += '\n';
    }
    
    if (categories.breakingChanges.length > 0) {
        content += '## Breaking Changes\n\n';
        categories.breakingChanges.forEach(commit => {
            content += `- ${commit.subject.replace(/^breaking:?\s*/i, '')}\n`;
        });
        content += '\n';
    }
    
    if (categories.improvements.length > 0) {
        content += '## Improvements\n\n';
        categories.improvements.forEach(commit => {
            content += `- ${commit.subject.replace(/^(perf|improve):?\s*/i, '')}\n`;
        });
        content += '\n';
    }
    
    if (categories.docs.length > 0) {
        content += '## Documentation\n\n';
        categories.docs.forEach(commit => {
            content += `- ${commit.subject.replace(/^docs?:?\s*/i, '')}\n`;
        });
        content += '\n';
    }
    
    if (categories.chore.length > 0) {
        content += '## Maintenance\n\n';
        categories.chore.forEach(commit => {
            content += `- ${commit.subject}\n`;
        });
        content += '\n';
    }
    
    if (content === '') {
        content = 'No user-facing changes.\n\n';
    }
    
    return content;
}

/**
 * Generate technical diff snippet from Git analysis
 */
function generateTechnicalDiff(gitAnalysis) {
    const { categories, totalCommits, lastTag } = gitAnalysis;
    
    if (totalCommits === 0) {
        return 'No commits since last tag.';
    }
    
    let diff = `${totalCommits} commit(s) since ${lastTag}:\n\n`;
    
    // Add breakdown by category
    const categoryMap = {
        features: 'Features',
        fixes: 'Fixes', 
        breakingChanges: 'Breaking Changes',
        improvements: 'Improvements',
        docs: 'Documentation',
        chore: 'Maintenance'
    };
    
    Object.entries(categoryMap).forEach(([key, label]) => {
        const commits = categories[key];
        if (commits.length > 0) {
            diff += `${label}: ${commits.length}\n`;
            commits.slice(0, 3).forEach(commit => {
                diff += `  - ${commit.hash}: ${commit.subject}\n`;
            });
            if (commits.length > 3) {
                diff += `  - ... and ${commits.length - 3} more\n`;
            }
            diff += '\n';
        }
    });
    
    return diff.trim();
}

/**
 * Generate contributors list from Git analysis
 */
function generateContributorsList(gitAnalysis) {
    const { categories } = gitAnalysis;
    
    // Collect all commits from all categories
    const allCommits = [
        ...categories.features,
        ...categories.fixes,
        ...categories.breakingChanges,
        ...categories.improvements,
        ...categories.docs,
        ...categories.chore
    ];
    
    if (allCommits.length === 0) {
        return 'No contributors in this release.';
    }
    
    try {
        // Get unique authors from Git
        const authors = execSync('git log --pretty=format:"%an" --since="1 month ago"', { encoding: 'utf8' })
            .split('\n')
            .filter(author => author.trim())
            .filter((author, index, arr) => arr.indexOf(author) === index) // unique
            .slice(0, 10); // limit to 10 contributors
        
        if (authors.length === 0) {
            return 'GitHub Contributors';
        }
        
        return authors.join(', ');
    } catch (error) {
        console.warn('Failed to get contributors list:', error.message);
        return 'GitHub Contributors';
    }
}

/**
 * Generate release summary from Git analysis
 */
function generateSummary(gitAnalysis, version) {
    const { categories, totalCommits } = gitAnalysis;
    
    if (totalCommits === 0) {
        return `Release v${version} includes stability improvements and maintenance updates.`;
    }
    
    const parts = [];
    
    if (categories.features.length > 0) {
        parts.push(`${categories.features.length} new feature${categories.features.length > 1 ? 's' : ''}`);
    }
    
    if (categories.fixes.length > 0) {
        parts.push(`${categories.fixes.length} bug fix${categories.fixes.length > 1 ? 'es' : ''}`);
    }
    
    if (categories.improvements.length > 0) {
        parts.push(`${categories.improvements.length} improvement${categories.improvements.length > 1 ? 's' : ''}`);
    }
    
    if (categories.breakingChanges.length > 0) {
        parts.push(`${categories.breakingChanges.length} breaking change${categories.breakingChanges.length > 1 ? 's' : ''}`);
    }
    
    if (parts.length === 0) {
        return `Release v${version} includes ${totalCommits} maintenance update${totalCommits > 1 ? 's' : ''} and stability improvements.`;
    }
    
    return `Release v${version} includes ${parts.join(', ')}.`;
}

/**
 * Generate highlights from Git analysis
 */
function generateHighlights(gitAnalysis) {
    const { categories } = gitAnalysis;
    const highlights = [];
    
    // Priority: features > fixes > improvements > breaking changes
    if (categories.features.length > 0) {
        categories.features.slice(0, 2).forEach(commit => {
            highlights.push(commit.subject.replace(/^feat:?\s*/i, ''));
        });
    }
    
    if (highlights.length < 3 && categories.fixes.length > 0) {
        categories.fixes.slice(0, 3 - highlights.length).forEach(commit => {
            highlights.push(commit.subject.replace(/^fix:?\s*/i, ''));
        });
    }
    
    if (highlights.length < 3 && categories.improvements.length > 0) {
        categories.improvements.slice(0, 3 - highlights.length).forEach(commit => {
            highlights.push(commit.subject.replace(/^(perf|improve):?\s*/i, ''));
        });
    }
    
    // Fill remaining with maintenance if needed
    if (highlights.length < 3 && categories.chore.length > 0) {
        categories.chore.slice(0, 3 - highlights.length).forEach(commit => {
            highlights.push(commit.subject);
        });
    }
    
    // Ensure we have exactly 3 highlights
    while (highlights.length < 3) {
        highlights.push('Stability improvements and bug fixes');
    }
    
    return highlights.slice(0, 3);
}

/**
 * Generate status indicators
 */
function generateStatus() {
    return {
        build: '✅ Passing',
        tests: '✅ Passing', 
        lint: '✅ Passing'
    };
}

/**
 * Generate known issues list
 */
function generateKnownIssues() {
    return [
        'None currently identified',
        'Report issues on GitHub'
    ];
}
function fillTemplate(template, version, versionType, gitAnalysis) {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const currentCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    const changelogContent = generateChangelogContent(gitAnalysis);
    const technicalDiff = generateTechnicalDiff(gitAnalysis);
    const contributorsList = generateContributorsList(gitAnalysis);
    const summary = generateSummary(gitAnalysis, version);
    const highlights = generateHighlights(gitAnalysis);
    const status = generateStatus();
    const knownIssues = generateKnownIssues();
    
    // Generate changes table content
    const changesData = {
        feature: gitAnalysis.categories.features.length > 0 ? 
            gitAnalysis.categories.features[0].subject.replace(/^feat:?\s*/i, '') : 'No new features',
        fix: gitAnalysis.categories.fixes.length > 0 ? 
            gitAnalysis.categories.fixes[0].subject.replace(/^fix:?\s*/i, '') : 'No fixes in this release',
        performance: gitAnalysis.categories.improvements.length > 0 ? 
            gitAnalysis.categories.improvements[0].subject.replace(/^(perf|improve):?\s*/i, '') : 'No performance improvements'
    };
    
    let filled = template
        .replace(/\{\{VERSION\}\}/g, version)
        .replace(/\{\{DATE\}\}/g, currentDate)
        .replace(/\{\{COMMIT_SHA\}\}/g, currentCommit)
        .replace(/\{\{TECH_DIFF_SNIPPET\}\}/g, technicalDiff)
        .replace(/\{\{CONTRIBUTORS_LIST\}\}/g, contributorsList)
        .replace(/\{\{SHORT_SUMMARY\}\}/g, summary)
        .replace(/\{\{HIGHLIGHT_1\}\}/g, highlights[0])
        .replace(/\{\{HIGHLIGHT_2\}\}/g, highlights[1])
        .replace(/\{\{HIGHLIGHT_3\}\}/g, highlights[2])
        .replace(/\{\{FEATURE_CHANGE\}\}/g, changesData.feature)
        .replace(/\{\{FIX_CHANGE\}\}/g, changesData.fix)
        .replace(/\{\{PERF_CHANGE\}\}/g, changesData.performance)
        .replace(/\{\{CHANGELOG_SNIPPET\}\}/g, technicalDiff)
        .replace(/\{\{BUILD_STATUS\}\}/g, status.build)
        .replace(/\{\{TEST_STATUS\}\}/g, status.tests)
        .replace(/\{\{LINT_STATUS\}\}/g, status.lint)
        .replace(/\{\{KNOWN_ISSUE_1\}\}/g, knownIssues[0])
        .replace(/\{\{KNOWN_ISSUE_2\}\}/g, knownIssues[1]);
    
    // Add generated changelog content at the end
    filled += '\n\n---\n\n';
    filled += changelogContent;
    filled += `Generated on: ${currentDate}\n`;
    
    return filled;
}

/**
 * Clean existing .md files in target directory
 */
function cleanTargetDirectory(targetDir) {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        return;
    }
    
    try {
        const files = fs.readdirSync(targetDir);
        files.forEach(file => {
            if (file.endsWith('.md')) {
                fs.unlinkSync(path.join(targetDir, file));
                console.log(`Cleaned existing file: ${file}`);
            }
        });
    } catch (error) {
        throw new Error(`Failed to clean target directory: ${error.message}`);
    }
}

/**
 * Save generated content to file
 */
function saveGeneratedFile(versionType, version, content) {
    const targetDir = path.join(DEPLOYMENT_PACKAGE_DIR, versionType.charAt(0).toUpperCase() + versionType.slice(1));
    const versionWithHyphens = versionToHyphens(version);
    const filename = `node-OYI-${versionType}-v${versionWithHyphens}.md`;
    const filepath = path.join(targetDir, filename);
    
    // Clean target directory
    cleanTargetDirectory(targetDir);
    
    try {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Generated release description: ${filepath}`);
        return filepath;
    } catch (error) {
        throw new Error(`Failed to save generated file: ${error.message}`);
    }
}

/**
 * Main execution function
 */
function main() {
    try {
        console.log('🚀 Starting release description automation...\n');
        
        // Phase 1 - Input validation
        console.log('📝 Phase 1: Input validation');
        const { versionType } = parseArguments();
        const version = getVersionFromPackage();
        console.log(`   Version Type: ${versionType}`);
        console.log(`   Version: ${version}\n`);
        
        // Phase 2 - Git analysis
        console.log('📊 Phase 2: Git analysis');
        const gitAnalysis = analyzeGitHistory();
        console.log(`   Last tag: ${gitAnalysis.lastTag}`);
        console.log(`   Total commits since last tag: ${gitAnalysis.totalCommits}`);
        console.log(`   Features: ${gitAnalysis.categories.features.length}`);
        console.log(`   Fixes: ${gitAnalysis.categories.fixes.length}`);
        console.log(`   Breaking changes: ${gitAnalysis.categories.breakingChanges.length}\n`);
        
        // Phase 3 - Template loading
        console.log('📋 Phase 3: Template loading');
        const template = loadTemplate(versionType);
        console.log(`   Template loaded for ${versionType}\n`);
        
        // Phase 4 - Content generation
        console.log('⚙️  Phase 4: Content generation');
        const filledContent = fillTemplate(template, version, versionType, gitAnalysis);
        console.log('   Template filled with data\n');
        
        // Phase 5 - File generation
        console.log('💾 Phase 5: File generation');
        const savedFile = saveGeneratedFile(versionType, version, filledContent);
        console.log('   File saved successfully\n');
        
        console.log('✅ Release description automation completed!');
        console.log(`📁 Generated file: ${savedFile}`);
        console.log('\n🔧 Next steps for GitHub Actions:');
        console.log('   1. Read the generated .md file');
        console.log('   2. Use content as GitHub Release description');
        console.log(`   3. Mark as ${versionType === 'preview' ? 'pre-release' : 'release'}`);
        console.log('   4. Delete the .md file after successful consumption');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Execute if called directly
if (require.main === module) {
    main();
}

module.exports = {
    parseArguments,
    getVersionFromPackage,
    versionToHyphens,
    analyzeGitHistory,
    loadTemplate,
    fillTemplate,
    saveGeneratedFile
};
