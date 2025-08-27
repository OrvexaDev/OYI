#!/bin/bash

# OYI - Open in your IDE Extension
# Ubuntu-specific Test Script for CI Environments
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

# Ubuntu-specific test script for CI environments
echo "🐧 Setting up Ubuntu test environment..."

# Set critical environment variables
export VSCODE_TEST_ENV=true
export NODE_ENV=test
export CI=true
export DISPLAY=:99.0

# Additional Ubuntu-specific environment variables
export ELECTRON_DISABLE_GPU=true
export ELECTRON_DISABLE_SECURITY_WARNINGS=true
export ELECTRON_ENABLE_LOGGING=false
export DEBIAN_FRONTEND=noninteractive

echo "📊 Environment check:"
echo "   OS: $(uname -s) $(uname -r)"
echo "   Architecture: $(uname -m)"
echo "   NODE_ENV: $NODE_ENV"
echo "   VSCODE_TEST_ENV: $VSCODE_TEST_ENV"
echo "   CI: $CI"
echo "   DISPLAY: $DISPLAY"

# Check if xvfb is available
if ! command -v xvfb-run &> /dev/null; then
    echo "❌ xvfb-run not found, installing..."
    sudo apt-get update -qq
    sudo apt-get install -y xvfb
fi

# Check display server
echo "🖥️  Starting virtual display..."
if pgrep -x "Xvfb" > /dev/null; then
    echo "✅ Xvfb already running"
else
    echo "🚀 Starting Xvfb on display $DISPLAY"
fi

# Run tests with proper error handling
echo "🧪 Running tests..."
if xvfb-run -a --server-args="-screen 0 1024x768x24 -ac +extension RANDR" npm test; then
    echo "✅ Tests passed successfully!"
    exit 0
else
    echo "❌ Tests failed!"
    echo "📊 System information:"
    echo "   Free memory: $(free -h | grep '^Mem:' | awk '{print $7}')"
    echo "   Available disk: $(df -h / | tail -1 | awk '{print $4}')"
    echo "   Running processes: $(ps aux | wc -l)"
    exit 1
fi
