#!/bin/bash

# Script to test the extension in a Linux-like environment
# This helps simulate the GitHub Actions Ubuntu environment

echo "🐧 Setting up Linux-like test environment..."

# Set environment variables that would be present in CI
export VSCODE_TEST_ENV=true
export NODE_ENV=test
export CI=true
export DISPLAY=:99.0

# Check if xvfb is available (for GUI applications)
if command -v xvfb-run &> /dev/null; then
    echo "✅ xvfb found - will use virtual display"
    export LINUX_DISPLAY_CMD="xvfb-run -a"
else
    echo "⚠️  xvfb not found - install with: sudo apt-get install xvfb"
    export LINUX_DISPLAY_CMD=""
fi

# Show environment info
echo "📊 Environment information:"
echo "   NODE_ENV: $NODE_ENV"
echo "   VSCODE_TEST_ENV: $VSCODE_TEST_ENV"
echo "   CI: $CI"
echo "   DISPLAY: $DISPLAY"
echo "   Platform: $(uname -s)"
echo "   Architecture: $(uname -m)"

# Run the tests
echo "🧪 Running tests in Linux environment..."
npm test

echo "✅ Linux environment test completed!"
