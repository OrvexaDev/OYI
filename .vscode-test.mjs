import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	env: {
		VSCODE_TEST_ENV: 'true',
		NODE_ENV: 'test'
	},
	// Use headless mode in CI environments
	launchArgs: process.env.CI ? [
		'--disable-gpu', 
		'--no-sandbox', 
		'--disable-dev-shm-usage',
		'--disable-extensions',
		'--disable-background-timer-throttling',
		'--disable-backgrounding-occluded-windows',
		'--disable-renderer-backgrounding'
	] : [],
	// Set timeout for CI
	timeout: process.env.CI ? 60000 : 30000
});
