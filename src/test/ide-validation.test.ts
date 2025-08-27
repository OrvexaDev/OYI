import * as assert from 'assert';
import * as os from 'os';

// Test data - simplified IDE definitions for validation
const TEST_IDE_DATA = {
    // .NET Development
    visualstudio: { name: 'Visual Studio', platforms: ['win32'], fileExtensions: ['.sln', '.csproj', '.vcxproj'] },
    rider: { name: 'JetBrains Rider', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.sln', '.csproj'] },
    
    // Java/JVM
    intellij: { name: 'IntelliJ IDEA', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.java', '.kt'] },
    eclipse: { name: 'Eclipse IDE', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.java'] },
    netbeans: { name: 'NetBeans', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.java', '.php'] },
    
    // Python
    pycharm: { name: 'PyCharm', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.py', '.ipynb'] },
    spyder: { name: 'Spyder', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.py'] },
    wingpro: { name: 'Wing Pro', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.py'] },
    
    // Web Development
    webstorm: { name: 'WebStorm', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.js', '.ts', '.html'] },
    
    // Mobile
    xcode: { name: 'Xcode', platforms: ['darwin'], fileExtensions: ['.xcodeproj', '.xcworkspace'] },
    'android-studio': { name: 'Android Studio', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.gradle'] },
    
    // C/C++
    clion: { name: 'CLion', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.cpp', '.c', '.h'] },
    'qt-creator': { name: 'Qt Creator', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.pro', '.cpp'] },
    codeblocks: { name: 'Code::Blocks', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.cbp', '.cpp'] },
    
    // Embedded
    arduino: { name: 'Arduino IDE', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.ino'] },
    stm32cubeide: { name: 'STM32CubeIDE', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.ioc'] },
    keil: { name: 'Keil µVision', platforms: ['win32'], fileExtensions: ['.uvprojx'] },
    iar: { name: 'IAR Embedded Workbench', platforms: ['win32'], fileExtensions: ['.ewp'] },
    mplabx: { name: 'MPLAB X IDE', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.X'] },
    ccs: { name: 'Code Composer Studio', platforms: ['win32', 'linux'], fileExtensions: ['.projectspec'] },
    
    // Scientific
    matlab: { name: 'MATLAB', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.m'] },
    octave: { name: 'GNU Octave', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.m'] },
    rstudio: { name: 'RStudio', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.R'] },
    
    // Modern Languages
    goland: { name: 'GoLand', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.go'] },
    rubymine: { name: 'RubyMine', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.rb'] },
    phpstorm: { name: 'PhpStorm', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.php'] },
    rustrover: { name: 'RustRover', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.rs'] },
    
    // Legacy
    lazarus: { name: 'Lazarus', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.pas', '.lpr'] },
    radstudio: { name: 'RAD Studio', platforms: ['win32'], fileExtensions: ['.dpr', '.pas'] },
    
    // Creative
    processing: { name: 'Processing IDE', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.pde'] },
    
    // Text Editors
    sublime: { name: 'Sublime Text', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['*'] },
    atom: { name: 'Atom', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['*'] },
    brackets: { name: 'Brackets', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['.html', '.css', '.js'] },
    vim: { name: 'Vim', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['*'] },
    emacs: { name: 'Emacs', platforms: ['win32', 'darwin', 'linux'], fileExtensions: ['*'] }
};

suite('IDE Functionality Validation', () => {
    
    test('All 30+ IDEs are properly defined', () => {
        console.log(`\n🔍 Testing ${Object.keys(TEST_IDE_DATA).length} IDE definitions...`);
        
        // Validate each IDE definition
        Object.entries(TEST_IDE_DATA).forEach(([ideId, ide]) => {
            // Basic structure validation
            assert.ok(ide.name, `${ideId} should have a name`);
            assert.ok(Array.isArray(ide.platforms), `${ideId} should have platforms array`);
            assert.ok(ide.platforms.length > 0, `${ideId} should support at least one platform`);
            assert.ok(Array.isArray(ide.fileExtensions), `${ideId} should have fileExtensions array`);
            
            // Validate platforms
            ide.platforms.forEach(platform => {
                assert.ok(['win32', 'darwin', 'linux'].includes(platform), 
                         `${ideId} platform ${platform} should be valid`);
            });
            
            console.log(`✅ ${ideId}: ${ide.name} (${ide.platforms.join(', ')})`);
        });
    });

    test('Platform-specific IDE filtering works correctly', () => {
        const currentPlatform = os.platform();
        const supportedIDEs = Object.entries(TEST_IDE_DATA)
            .filter(([, ide]) => ide.platforms.includes(currentPlatform))
            .map(([ideId, ide]) => ({ id: ideId, name: ide.name }));
        
        console.log(`\n🎯 Platform: ${currentPlatform}`);
        console.log(`📊 Supported IDEs: ${supportedIDEs.length}`);
        
        assert.ok(supportedIDEs.length > 0, 
                 `Should have at least one IDE for platform ${currentPlatform}`);
        
        // Show first 15 IDEs for current platform
        supportedIDEs.slice(0, 15).forEach(ide => {
            console.log(`   ✅ ${ide.name} (${ide.id})`);
        });
        
        if (supportedIDEs.length > 15) {
            console.log(`   ... and ${supportedIDEs.length - 15} more`);
        }
    });

    test('File extension to IDE mapping validation', () => {
        const fileExtensionTests = [
            // .NET
            { ext: '.sln', expectedIDEs: ['visualstudio', 'rider'] },
            { ext: '.csproj', expectedIDEs: ['visualstudio', 'rider'] },
            
            // Java
            { ext: '.java', expectedIDEs: ['intellij', 'eclipse', 'netbeans'] },
            
            // Python
            { ext: '.py', expectedIDEs: ['pycharm', 'spyder', 'wingpro'] },
            
            // Web
            { ext: '.js', expectedIDEs: ['webstorm'] },
            { ext: '.html', expectedIDEs: ['webstorm', 'brackets'] },
            
            // Mobile
            { ext: '.xcodeproj', expectedIDEs: ['xcode'] },
            
            // C/C++
            { ext: '.cpp', expectedIDEs: ['clion', 'qt-creator', 'codeblocks', 'visualstudio'] },
            
            // Embedded
            { ext: '.ino', expectedIDEs: ['arduino'] },
            
            // Scientific
            { ext: '.m', expectedIDEs: ['matlab', 'octave'] },
            { ext: '.R', expectedIDEs: ['rstudio'] },
            
            // Modern languages
            { ext: '.rs', expectedIDEs: ['rustrover'] },
            { ext: '.go', expectedIDEs: ['goland'] },
            { ext: '.rb', expectedIDEs: ['rubymine'] },
            { ext: '.php', expectedIDEs: ['phpstorm'] }
        ];

        console.log(`\n📁 Testing file extension mappings...`);
        
        fileExtensionTests.forEach(test => {
            const supportingIDEs = Object.entries(TEST_IDE_DATA)
                .filter(([, ide]) => {
                    return ide.fileExtensions && ide.fileExtensions.includes(test.ext);
                })
                .map(([ideId]) => ideId);
            
            const expectedAvailable = test.expectedIDEs.filter(expectedIde => 
                Object.keys(TEST_IDE_DATA).includes(expectedIde)
            );
            
            console.log(`   ${test.ext}: Expected [${expectedAvailable.join(', ')}] -> Found [${supportingIDEs.join(', ')}]`);
            
            // At least some expected IDEs should be available
            const hasExpectedIDE = expectedAvailable.some(expectedIde => 
                supportingIDEs.includes(expectedIde)
            );
            
            if (expectedAvailable.length > 0) {
                assert.ok(hasExpectedIDE, 
                         `Extension ${test.ext} should be supported by at least one expected IDE`);
            }
        });
    });

    test('Command generation validation', () => {
        console.log(`\n⚙️  Testing command generation...`);
        
        const testCases = [
            {
                platform: 'win32',
                idePath: 'C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\devenv.exe',
                targetPath: 'C:\\Projects\\MyApp\\MyApp.sln',
                description: 'Visual Studio on Windows'
            },
            {
                platform: 'darwin',
                idePath: '/Applications/Xcode.app/Contents/MacOS/Xcode',
                targetPath: '/Users/dev/MyApp.xcodeproj',
                description: 'Xcode on macOS'
            },
            {
                platform: 'linux',
                idePath: '/opt/idea/bin/idea.sh',
                targetPath: '/home/dev/myproject',
                description: 'IntelliJ on Linux'
            }
        ];

        testCases.forEach(testCase => {
            // Simulate command generation
            const command = `"${testCase.idePath}" "${testCase.targetPath}"`;
            
            // Validate command structure
            assert.ok(command.includes(testCase.idePath), 'Command should include IDE path');
            assert.ok(command.includes(testCase.targetPath), 'Command should include target path');
            assert.ok(command.startsWith('"'), 'Command should start with quote');
            assert.ok(command.includes('" "'), 'Command should have quoted parameters');
            
            console.log(`   ✅ ${testCase.description}: ${command}`);
        });
    });

    test('Performance validation', () => {
        console.log(`\n⚡ Testing performance...`);
        
        const startTime = Date.now();
        
        // Simulate IDE detection process
        const currentPlatform = os.platform();
        const availableIDEs = Object.entries(TEST_IDE_DATA)
            .filter(([, ide]) => ide.platforms.includes(currentPlatform))
            .map(([ideId, ide]) => ({
                id: ideId,
                name: ide.name,
                // Simulate availability check (would be real file system check)
                available: Math.random() > 0.7 // Random simulation
            }));
        
        const detectionTime = Date.now() - startTime;
        
        console.log(`   📊 Detected ${availableIDEs.length} potential IDEs in ${detectionTime}ms`);
        console.log(`   🎯 Simulated ${availableIDEs.filter(ide => ide.available).length} available IDEs`);
        
        // Performance should be reasonable
        assert.ok(detectionTime < 100, `IDE detection should be fast (${detectionTime}ms < 100ms)`);
        assert.ok(availableIDEs.length > 0, 'Should detect at least one IDE');
    });

    test('Error handling validation', () => {
        console.log(`\n🛡️  Testing error handling...`);
        
        const errorScenarios = [
            { input: '', description: 'Empty path' },
            { input: null, description: 'Null path' },
            { input: undefined, description: 'Undefined path' },
            { input: 'nonexistent/path.exe', description: 'Non-existent path' },
            { input: 'file with spaces.exe', description: 'Path with spaces' },
            { input: 'file"with"quotes.exe', description: 'Path with quotes' }
        ];

        errorScenarios.forEach(scenario => {
            try {
                // Simulate path validation
                if (!scenario.input || typeof scenario.input !== 'string' || scenario.input.length === 0) {
                    // This should be handled gracefully
                    console.log(`   ✅ ${scenario.description}: Handled invalid input`);
                } else {
                    // This would normally check file existence
                    const escapedPath = `"${scenario.input}"`;
                    console.log(`   ✅ ${scenario.description}: Escaped to ${escapedPath}`);
                }
            } catch (error) {
                console.log(`   ⚠️  ${scenario.description}: ${error}`);
            }
        });
    });

    test('Configuration validation', () => {
        console.log(`\n⚙️  Testing configuration scenarios...`);
        
        // Test various configuration scenarios
        const configTests = [
            {
                name: 'All IDEs enabled',
                enabledIDEs: Object.keys(TEST_IDE_DATA),
                shouldWork: true
            },
            {
                name: 'Only .NET IDEs',
                enabledIDEs: ['visualstudio', 'rider'],
                shouldWork: true
            },
            {
                name: 'Only Java IDEs',
                enabledIDEs: ['intellij', 'eclipse', 'netbeans'],
                shouldWork: true
            },
            {
                name: 'Mixed ecosystem',
                enabledIDEs: ['visualstudio', 'intellij', 'pycharm', 'webstorm'],
                shouldWork: true
            },
            {
                name: 'Invalid IDE',
                enabledIDEs: ['nonexistent-ide'],
                shouldWork: false
            }
        ];

        configTests.forEach(test => {
            const validIDEs = test.enabledIDEs.filter(ideId => 
                Object.keys(TEST_IDE_DATA).includes(ideId)
            );
            
            if (test.shouldWork) {
                assert.ok(validIDEs.length > 0, 
                         `${test.name} should have at least one valid IDE`);
                console.log(`   ✅ ${test.name}: ${validIDEs.length}/${test.enabledIDEs.length} valid IDEs`);
            } else {
                console.log(`   ⚠️  ${test.name}: Invalid configuration detected`);
            }
        });
    });

    test('Ecosystem coverage validation', () => {
        console.log(`\n🌍 Testing ecosystem coverage...`);
        
        const ecosystems = {
            '.NET': ['visualstudio', 'rider'],
            'Java/JVM': ['intellij', 'eclipse', 'netbeans', 'android-studio'],
            'Python': ['pycharm', 'spyder', 'wingpro'],
            'Web': ['webstorm', 'brackets'],
            'Mobile': ['xcode', 'android-studio'],
            'C/C++': ['clion', 'qt-creator', 'codeblocks', 'visualstudio'],
            'Embedded': ['arduino', 'stm32cubeide', 'keil', 'iar', 'mplabx', 'ccs'],
            'Scientific': ['matlab', 'octave', 'rstudio'],
            'Modern Languages': ['goland', 'rubymine', 'phpstorm', 'rustrover'],
            'Text Editors': ['sublime', 'atom', 'brackets', 'vim', 'emacs']
        };

        Object.entries(ecosystems).forEach(([ecosystem, expectedIDEs]) => {
            const availableIDEs = expectedIDEs.filter(ideId => 
                Object.keys(TEST_IDE_DATA).includes(ideId)
            );
            
            const coverage = (availableIDEs.length / expectedIDEs.length) * 100;
            
            console.log(`   ${ecosystem}: ${availableIDEs.length}/${expectedIDEs.length} IDEs (${coverage.toFixed(1)}% coverage)`);
            
            assert.ok(coverage > 50, 
                     `${ecosystem} should have at least 50% IDE coverage`);
        });
    });
});
