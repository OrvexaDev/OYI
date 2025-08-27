#!/bin/bash

# OYI - Open in your IDE Extension
# Test Script for Ubuntu Compatibility
#
# Copyright (c) 2025 Orvexa by KAGEYOSHI
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
# Developed by Orvexa by KAGEYOSHI
# GitHub: https://github.com/OrvexaDev/OYI

# Simple test to verify Ubuntu compatibility
echo "🧪 Testing Ubuntu compatibility..."

# Set environment variables
export VSCODE_TEST_ENV=true
export NODE_ENV=test
export CI=true

# Check if we're on Ubuntu
if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo "📊 Detected OS: $NAME $VERSION"
fi

# Check Node.js version
echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Check if required dependencies are available
echo "🔍 Checking dependencies..."
if command -v xvfb-run &> /dev/null; then
    echo "✅ xvfb-run available"
else
    echo "❌ xvfb-run not available"
fi

# Test basic npm commands
echo "🧪 Testing npm ci..."
if npm ci --silent; then
    echo "✅ npm ci successful"
else
    echo "❌ npm ci failed"
    exit 1
fi

echo "🧪 Testing compilation..."
if npm run compile --silent; then
    echo "✅ Compilation successful"
else
    echo "❌ Compilation failed"
    exit 1
fi

echo "✅ All basic checks passed!"
exit 0
