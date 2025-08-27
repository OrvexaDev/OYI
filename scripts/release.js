#!/usr/bin/env node

/**
 * ==================================================================================
 * OYI - Open in your IDE Extension
 * Release Management Script
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
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Função para obter argumentos da linha de comando
function getArgs() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('❌ Uso: node release.js <tipo-de-versao>');
        console.error('   Tipos: patch, minor, major');
        console.error('   Exemplo: node release.js patch');
        process.exit(1);
    }
    return args[0];
}

// Função para validar o tipo de versão
function validateVersionType(type) {
    const validTypes = ['patch', 'minor', 'major'];
    
    // Sanitize input
    if (typeof type !== 'string' || type.length === 0) {
        console.error(`❌ Tipo de versão inválido: ${type}`);
        console.error(`   Tipos válidos: ${validTypes.join(', ')}`);
        process.exit(1);
    }
    
    // Remove any dangerous characters
    const sanitizedType = type.replace(/[^a-zA-Z]/g, '');
    
    if (!validTypes.includes(sanitizedType)) {
        console.error(`❌ Tipo de versão inválido: ${type}`);
        console.error(`   Tipos válidos: ${validTypes.join(', ')}`);
        process.exit(1);
    }
    
    return sanitizedType;
}

// Função para incrementar versão
function incrementVersion(currentVersion, type) {
    const parts = currentVersion.split('.').map(Number);
    
    switch (type) {
        case 'major':
            parts[0]++;
            parts[1] = 0;
            parts[2] = 0;
            break;
        case 'minor':
            parts[1]++;
            parts[2] = 0;
            break;
        case 'patch':
            parts[2]++;
            break;
    }
    
    return parts.join('.');
}

// Function to update package.json
function updatePackageJson(newVersion) {
    const packagePath = './package.json';
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✅ package.json updated to version ${newVersion}`);
}

// Function to execute git command
function gitCommand(command) {
    // Validate command to prevent injection
    const allowedCommands = [
        /^git add package\.json$/,
        /^git commit -m "chore: bump version to \d+\.\d+\.\d+"$/,
        /^git tag v\d+\.\d+\.\d+$/,
        /^git push$/,
        /^git push --tags$/
    ];
    
    const isValid = allowedCommands.some(pattern => pattern.test(command));
    if (!isValid) {
        console.error(`❌ Command not allowed: ${command}`);
        return false;
    }
    
    try {
        execSync(command, { 
            stdio: 'inherit',
            timeout: 30000 // 30 second timeout
        });
        return true;
    } catch (error) {
        console.error(`❌ Error executing: ${command}`);
        console.error(error.message);
        return false;
    }
}

// Main function
function main() {
    const versionType = getArgs();
    const sanitizedVersionType = validateVersionType(versionType);
    
    console.log(`🚀 Starting ${sanitizedVersionType} release...`);
    
    // Generate package.nls files
    console.log('🌐 Generating package.nls localization files...');
    try {
        execSync('node scripts/create-package-nls.js', { stdio: 'inherit' });
        console.log('✅ Localization files generated successfully!');
    } catch (error) {
        console.error('❌ Error generating localization files:', error.message);
        process.exit(1);
    }
    
    // Check if we're on main/master branch
    try {
        const currentBranch = execSync('git branch --show-current', { 
            encoding: 'utf8',
            timeout: 5000
        }).trim();
        if (currentBranch !== 'main' && currentBranch !== 'master') {
            console.warn(`⚠️  You are on branch '${currentBranch}', not on 'main' or 'master'`);
            console.warn('   Are you sure you want to continue? (Ctrl+C to cancel)');
        }
    } catch (error) {
        console.error('❌ Error checking current branch');
        process.exit(1);
    }
    
    // Read current version
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const currentVersion = packageJson.version;
    const newVersion = incrementVersion(currentVersion, sanitizedVersionType);
    
    console.log(`📦 Current version: ${currentVersion}`);
    console.log(`📦 New version: ${newVersion}`);
    
    // Check for uncommitted changes
    try {
        execSync('git diff-index --quiet HEAD --', { stdio: 'ignore' });
    } catch {
        console.error('❌ There are uncommitted changes. Commit or stash your changes first.');
        process.exit(1);
    }
    
    // Update package.json
    updatePackageJson(newVersion);
    
    // Commit changes
    console.log('📝 Committing changes...');
    if (!gitCommand('git add package.json')) {
        process.exit(1);
    }
    if (!gitCommand(`git commit -m "chore: bump version to ${newVersion}"`)) {
        process.exit(1);
    }
    
    // Create tag
    console.log(`🏷️  Creating tag v${newVersion}...`);
    if (!gitCommand(`git tag v${newVersion}`)) {
        process.exit(1);
    }
    
    // Push changes and tag
    console.log('📤 Pushing changes to remote repository...');
    if (!gitCommand('git push')) {
        process.exit(1);
    }
    if (!gitCommand('git push --tags')) {
        process.exit(1);
    }
    
    console.log('');
    console.log('🎉 Release created successfully!');
    console.log(`   Version: ${newVersion}`);
    console.log(`   Tag: v${newVersion}`);
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Check the pipeline on Azure DevOps');
    console.log('   2. Wait for automatic publication to VS Code Marketplace');
    console.log('   3. Verify that the extension has been updated in the marketplace');
    console.log('');
    console.log('🔗 Useful links:');
    console.log(`   - Azure DevOps: https://dev.azure.com/[your-org]/[your-project]/_build`);
    console.log(`   - Marketplace: https://marketplace.visualstudio.com/items?itemName=${packageJson.publisher}.${packageJson.name}`);
}

main();
