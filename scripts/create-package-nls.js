/**
 * ==================================================================================
 * OYI - Open in your IDE Extension
 * Package NLS Generator Script
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
const path = require('path');

// Read all localization files from l10n folder
const l10nDir = './l10n';
const nlsDir = './nls';

// Ensure nls folder exists
if (!fs.existsSync(nlsDir)) {
    fs.mkdirSync(nlsDir);
}

const files = fs.readdirSync(l10nDir);

files.forEach(file => {
    if (file.startsWith('bundle.l10n.') && file.endsWith('.json')) {
        try {
            // Read the complete localization file
            const fullPath = path.join(l10nDir, file);
            const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            
            // Extract only the necessary keys for package.json
            const packageNls = {
                "extension.displayName": content["extension.displayName"],
                "extension.description": content["extension.description"],
                "command.openInIDE.title": content["command.openInIDE.title"],
                "configuration.title": content["configuration.title"],
                "configuration.enabledIDEs.description": content["configuration.enabledIDEs.description"],
                "configuration.customIDEPaths.description": content["configuration.customIDEPaths.description"],
                "configuration.defaultIDE.description": content["configuration.defaultIDE.description"]
            };
            
            // Determine the package.nls file name
            let packageFile, packageFileOrganized;
            if (file === 'bundle.l10n.json') {
                packageFile = 'package.nls.json'; // Root for Marketplace
                packageFileOrganized = path.join(nlsDir, 'package.nls.json'); // Organized folder
            } else {
                const locale = file.replace('bundle.l10n.', '').replace('.json', '');
                packageFile = `package.nls.${locale}.json`; // Root for Marketplace
                packageFileOrganized = path.join(nlsDir, `package.nls.${locale}.json`); // Organized folder
            }
            
            // Write package.nls file in root (for Marketplace)
            fs.writeFileSync(packageFile, JSON.stringify(packageNls, null, '\t'));
            console.log(`Created: ${packageFile}`);
            
            // Write package.nls file in organized folder (backup/organization)
            fs.writeFileSync(packageFileOrganized, JSON.stringify(packageNls, null, '\t'));
            console.log(`Created: ${packageFileOrganized}`);
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    }
});

console.log('Package localization files created successfully!');
