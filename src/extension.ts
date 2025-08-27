/**
 * OYI - Open in your IDE Extension
 * 
 * Copyright (c) 2025 Orvexa by KAGEYOSHI
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * Developed by Orvexa by KAGEYOSHI
 * GitHub: https://github.com/OrvexaDev/OYI
 * 
 * This extension adds a context menu option to open projects in various IDEs
 */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { execSync, spawn } from 'child_process';
import * as os from 'os';

// Localization helper function
function l10n(key: string, ...args: string[]): string {
	return vscode.l10n.t(key, ...args);
}

// IDE definitions
interface IDEDefinition {
	name: string;
	displayName: string;
	icon: string;
	supportedExtensions: string[];
	supportedPlatforms: NodeJS.Platform[];
	defaultPaths: {
		[platform: string]: string[];
	};
	projectFileExtensions?: string[];
}

// Workspace isolation options interface
interface WorkspaceIsolationOptions {
	enabled: boolean;
	useNewInstance: boolean;
	preventStartupConflicts: boolean;
	enhancedMode: boolean;
}

const IDE_DEFINITIONS: { [key: string]: IDEDefinition } = {
	visualstudio: {
		name: 'visualstudio',
		displayName: 'Visual Studio',
		icon: '$(window)',
		supportedExtensions: ['.sln', '.csproj', '.vbproj', '.fsproj', '.vcxproj'],
		supportedPlatforms: ['win32'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files\\Microsoft Visual Studio\\2022\\Professional\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\Enterprise\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\Professional\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Enterprise\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Professional\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Enterprise\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Professional\\Common7\\IDE\\devenv.exe',
				'C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\Common7\\IDE\\devenv.exe'
			]
		},
		projectFileExtensions: ['.sln', '.csproj', '.vbproj', '.fsproj', '.vcxproj']
	},
	rider: {
		name: 'rider',
		displayName: 'JetBrains Rider',
		icon: '$(symbol-class)',
		supportedExtensions: ['.sln', '.csproj', '.vbproj', '.fsproj'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\JetBrains\\Toolbox\\apps\\Rider\\ch-0\\*\\bin\\rider64.exe',
				'C:\\Program Files\\JetBrains\\JetBrains Rider *\\bin\\rider64.exe'
			],
			darwin: [
				'/Applications/Rider.app/Contents/MacOS/rider',
				'/Users/*/Library/Application Support/JetBrains/Toolbox/apps/Rider/ch-0/*/Rider.app/Contents/MacOS/rider'
			],
			linux: [
				'/opt/rider/bin/rider.sh',
				'~/jetbrains/rider/bin/rider.sh'
			]
		},
		projectFileExtensions: ['.sln', '.csproj', '.vbproj', '.fsproj']
	},
	clion: {
		name: 'clion',
		displayName: 'JetBrains CLion',
		icon: '$(symbol-class)',
		supportedExtensions: ['.vcxproj', '.cbp', '.pro'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\JetBrains\\Toolbox\\apps\\CLion\\ch-0\\*\\bin\\clion64.exe',
				'C:\\Program Files\\JetBrains\\JetBrains CLion *\\bin\\clion64.exe'
			],
			darwin: [
				'/Applications/CLion.app/Contents/MacOS/clion',
				'/Users/*/Library/Application Support/JetBrains/Toolbox/apps/CLion/ch-0/*/CLion.app/Contents/MacOS/clion'
			],
			linux: [
				'/opt/clion/bin/clion.sh',
				'~/jetbrains/clion/bin/clion.sh'
			]
		}
	},
	xcode: {
		name: 'xcode',
		displayName: 'Xcode',
		icon: '$(symbol-class)',
		supportedExtensions: ['.xcodeproj', '.xcworkspace'],
		supportedPlatforms: ['darwin'],
		defaultPaths: {
			darwin: [
				'/Applications/Xcode.app/Contents/MacOS/Xcode'
			]
		},
		projectFileExtensions: ['.xcodeproj', '.xcworkspace']
	},
	intellij: {
		name: 'intellij',
		displayName: 'IntelliJ IDEA',
		icon: '$(symbol-class)',
		supportedExtensions: ['.java', '.kt', '.scala', '.gradle', '.maven'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\JetBrains\\Toolbox\\apps\\IDEA-U\\ch-0\\*\\bin\\idea64.exe',
				'C:\\Program Files\\JetBrains\\IntelliJ IDEA *\\bin\\idea64.exe'
			],
			darwin: [
				'/Applications/IntelliJ IDEA.app/Contents/MacOS/idea',
				'/Users/*/Library/Application Support/JetBrains/Toolbox/apps/IDEA-U/ch-0/*/IntelliJ IDEA.app/Contents/MacOS/idea'
			],
			linux: [
				'/opt/idea/bin/idea.sh',
				'~/jetbrains/idea/bin/idea.sh'
			]
		},
		projectFileExtensions: ['.java', '.kt', '.scala', '.gradle', '.maven', 'pom.xml', 'build.gradle']
	},
	webstorm: {
		name: 'webstorm',
		displayName: 'WebStorm',
		icon: '$(symbol-class)',
		supportedExtensions: ['.js', '.ts', '.html', '.css', '.vue', '.jsx', '.tsx', '.json'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\JetBrains\\Toolbox\\apps\\WebStorm\\ch-0\\*\\bin\\webstorm64.exe',
				'C:\\Program Files\\JetBrains\\WebStorm *\\bin\\webstorm64.exe'
			],
			darwin: [
				'/Applications/WebStorm.app/Contents/MacOS/webstorm',
				'/Users/*/Library/Application Support/JetBrains/Toolbox/apps/WebStorm/ch-0/*/WebStorm.app/Contents/MacOS/webstorm'
			],
			linux: [
				'/opt/webstorm/bin/webstorm.sh',
				'~/jetbrains/webstorm/bin/webstorm.sh'
			]
		},
		projectFileExtensions: ['package.json', '.js', '.ts', '.vue', '.jsx', '.tsx']
	},
	pycharm: {
		name: 'pycharm',
		displayName: 'PyCharm',
		icon: '$(symbol-class)',
		supportedExtensions: ['.py', '.ipynb'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\JetBrains\\Toolbox\\apps\\PyCharm-P\\ch-0\\*\\bin\\pycharm64.exe',
				'C:\\Program Files\\JetBrains\\PyCharm *\\bin\\pycharm64.exe'
			],
			darwin: [
				'/Applications/PyCharm.app/Contents/MacOS/pycharm',
				'/Users/*/Library/Application Support/JetBrains/Toolbox/apps/PyCharm-P/ch-0/*/PyCharm.app/Contents/MacOS/pycharm'
			],
			linux: [
				'/opt/pycharm/bin/pycharm.sh',
				'~/jetbrains/pycharm/bin/pycharm.sh'
			]
		},
		projectFileExtensions: ['.py', 'requirements.txt', 'setup.py', 'pyproject.toml']
	},
	goland: {
		name: 'goland',
		displayName: 'GoLand',
		icon: '$(symbol-class)',
		supportedExtensions: ['.go', '.mod'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\JetBrains\\Toolbox\\apps\\Goland\\ch-0\\*\\bin\\goland64.exe',
				'C:\\Program Files\\JetBrains\\GoLand *\\bin\\goland64.exe'
			],
			darwin: [
				'/Applications/GoLand.app/Contents/MacOS/goland',
				'/Users/*/Library/Application Support/JetBrains/Toolbox/apps/Goland/ch-0/*/GoLand.app/Contents/MacOS/goland'
			],
			linux: [
				'/opt/goland/bin/goland.sh',
				'~/jetbrains/goland/bin/goland.sh'
			]
		},
		projectFileExtensions: ['.go', 'go.mod', 'go.sum']
	},
	rubymine: {
		name: 'rubymine',
		displayName: 'RubyMine',
		icon: '$(symbol-class)',
		supportedExtensions: ['.rb', '.erb'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\JetBrains\\Toolbox\\apps\\RubyMine\\ch-0\\*\\bin\\rubymine64.exe',
				'C:\\Program Files\\JetBrains\\RubyMine *\\bin\\rubymine64.exe'
			],
			darwin: [
				'/Applications/RubyMine.app/Contents/MacOS/rubymine',
				'/Users/*/Library/Application Support/JetBrains/Toolbox/apps/RubyMine/ch-0/*/RubyMine.app/Contents/MacOS/rubymine'
			],
			linux: [
				'/opt/rubymine/bin/rubymine.sh',
				'~/jetbrains/rubymine/bin/rubymine.sh'
			]
		},
		projectFileExtensions: ['.rb', 'Gemfile', 'Rakefile', '.gemspec']
	},
	phpstorm: {
		name: 'phpstorm',
		displayName: 'PhpStorm',
		icon: '$(symbol-class)',
		supportedExtensions: ['.php', '.html', '.css', '.js'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\JetBrains\\Toolbox\\apps\\PhpStorm\\ch-0\\*\\bin\\phpstorm64.exe',
				'C:\\Program Files\\JetBrains\\PhpStorm *\\bin\\phpstorm64.exe'
			],
			darwin: [
				'/Applications/PhpStorm.app/Contents/MacOS/phpstorm',
				'/Users/*/Library/Application Support/JetBrains/Toolbox/apps/PhpStorm/ch-0/*/PhpStorm.app/Contents/MacOS/phpstorm'
			],
			linux: [
				'/opt/phpstorm/bin/phpstorm.sh',
				'~/jetbrains/phpstorm/bin/phpstorm.sh'
			]
		},
		projectFileExtensions: ['.php', 'composer.json', 'composer.lock']
	},
	androidstudio: {
		name: 'androidstudio',
		displayName: 'Android Studio',
		icon: '$(device-mobile)',
		supportedExtensions: ['.java', '.kt', '.xml'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\Android\\Android Studio\\bin\\studio64.exe',
				'C:\\Users\\%USERNAME%\\AppData\\Local\\Android\\Sdk\\tools\\bin\\studio.bat'
			],
			darwin: [
				'/Applications/Android Studio.app/Contents/MacOS/studio'
			],
			linux: [
				'/opt/android-studio/bin/studio.sh',
				'~/android-studio/bin/studio.sh'
			]
		},
		projectFileExtensions: ['build.gradle', 'settings.gradle', 'AndroidManifest.xml']
	},
	eclipse: {
		name: 'eclipse',
		displayName: 'Eclipse IDE',
		icon: '$(symbol-class)',
		supportedExtensions: ['.java', '.xml', '.properties'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\eclipse\\eclipse.exe',
				'C:\\Program Files\\Eclipse\\eclipse.exe'
			],
			darwin: [
				'/Applications/Eclipse.app/Contents/MacOS/eclipse'
			],
			linux: [
				'/opt/eclipse/eclipse',
				'~/eclipse/eclipse'
			]
		},
		projectFileExtensions: ['.project', '.classpath', 'pom.xml']
	},
	netbeans: {
		name: 'netbeans',
		displayName: 'NetBeans IDE',
		icon: '$(symbol-class)',
		supportedExtensions: ['.java', '.php', '.html', '.js'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\NetBeans*\\netbeans\\bin\\netbeans64.exe',
				'C:\\netbeans\\bin\\netbeans.exe'
			],
			darwin: [
				'/Applications/NetBeans/Apache NetBeans *.app/Contents/MacOS/netbeans'
			],
			linux: [
				'/opt/netbeans/bin/netbeans',
				'~/netbeans/bin/netbeans'
			]
		}
	},
	qtcreator: {
		name: 'qtcreator',
		displayName: 'Qt Creator',
		icon: '$(symbol-class)',
		supportedExtensions: ['.pro', '.pri', '.cpp', '.h'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Qt\\Tools\\QtCreator\\bin\\qtcreator.exe',
				'C:\\Program Files\\Qt\\Tools\\QtCreator\\bin\\qtcreator.exe'
			],
			darwin: [
				'/Applications/Qt Creator.app/Contents/MacOS/Qt Creator'
			],
			linux: [
				'/opt/qtcreator/bin/qtcreator',
				'~/Qt/Tools/QtCreator/bin/qtcreator'
			]
		},
		projectFileExtensions: ['.pro', '.pri', 'CMakeLists.txt']
	},
	codeblocks: {
		name: 'codeblocks',
		displayName: 'Code::Blocks',
		icon: '$(symbol-class)',
		supportedExtensions: ['.cbp', '.cpp', '.c', '.h'],
		supportedPlatforms: ['win32', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\CodeBlocks\\codeblocks.exe',
				'C:\\Program Files (x86)\\CodeBlocks\\codeblocks.exe'
			],
			linux: [
				'/usr/bin/codeblocks',
				'/opt/codeblocks/bin/codeblocks'
			]
		},
		projectFileExtensions: ['.cbp', '.workspace']
	},
	sublimetext: {
		name: 'sublimetext',
		displayName: 'Sublime Text',
		icon: '$(symbol-string)',
		supportedExtensions: ['.txt', '.md', '.js', '.py', '.cpp', '.java', '.php', '.rb', '.go'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\Sublime Text\\sublime_text.exe',
				'C:\\Program Files\\Sublime Text 3\\sublime_text.exe'
			],
			darwin: [
				'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'
			],
			linux: [
				'/opt/sublime_text/sublime_text',
				'/usr/bin/subl'
			]
		}
	},
	atom: {
		name: 'atom',
		displayName: 'Atom',
		icon: '$(symbol-string)',
		supportedExtensions: ['.txt', '.md', '.js', '.py', '.cpp', '.java', '.php', '.rb', '.go'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\atom\\atom.exe'
			],
			darwin: [
				'/Applications/Atom.app/Contents/MacOS/Atom'
			],
			linux: [
				'/usr/bin/atom',
				'/opt/atom/atom'
			]
		}
	},
	brackets: {
		name: 'brackets',
		displayName: 'Brackets',
		icon: '$(symbol-string)',
		supportedExtensions: ['.html', '.css', '.js', '.php'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files (x86)\\Brackets\\Brackets.exe'
			],
			darwin: [
				'/Applications/Brackets.app/Contents/MacOS/Brackets'
			],
			linux: [
				'/opt/brackets/brackets'
			]
		}
	},
	vim: {
		name: 'vim',
		displayName: 'Vim',
		icon: '$(symbol-string)',
		supportedExtensions: ['.txt', '.md', '.js', '.py', '.cpp', '.java', '.php', '.rb', '.go', '.c', '.h'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\Vim\\vim90\\gvim.exe',
				'C:\\Program Files (x86)\\Vim\\vim90\\gvim.exe'
			],
			darwin: [
				'/usr/local/bin/vim',
				'/Applications/MacVim.app/Contents/MacOS/MacVim'
			],
			linux: [
				'/usr/bin/vim',
				'/usr/local/bin/vim'
			]
		}
	},
	emacs: {
		name: 'emacs',
		displayName: 'Emacs',
		icon: '$(symbol-string)',
		supportedExtensions: ['.txt', '.md', '.js', '.py', '.cpp', '.java', '.php', '.rb', '.go', '.el'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\Emacs\\bin\\runemacs.exe'
			],
			darwin: [
				'/Applications/Emacs.app/Contents/MacOS/Emacs',
				'/usr/local/bin/emacs'
			],
			linux: [
				'/usr/bin/emacs',
				'/usr/local/bin/emacs'
			]
		}
	},
	spyder: {
		name: 'spyder',
		displayName: 'Spyder',
		icon: '$(symbol-class)',
		supportedExtensions: ['.py', '.ipynb'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Spyder\\spyder.exe',
				'C:\\ProgramData\\Anaconda3\\Scripts\\spyder.exe',
				'C:\\Users\\%USERNAME%\\Anaconda3\\Scripts\\spyder.exe'
			],
			darwin: [
				'/Applications/Spyder.app/Contents/MacOS/spyder',
				'/opt/anaconda3/bin/spyder',
				'/usr/local/bin/spyder'
			],
			linux: [
				'/usr/bin/spyder',
				'/opt/anaconda3/bin/spyder',
				'~/.local/bin/spyder'
			]
		},
		projectFileExtensions: ['.py', 'requirements.txt', 'setup.py', 'pyproject.toml']
	},
	wingpro: {
		name: 'wingpro',
		displayName: 'Wing Pro',
		icon: '$(symbol-class)',
		supportedExtensions: ['.py', '.pyw'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files (x86)\\Wing Pro 9\\bin\\wing.exe',
				'C:\\Program Files\\Wing Pro 9\\bin\\wing.exe'
			],
			darwin: [
				'/Applications/Wing Pro 9.app/Contents/MacOS/wing'
			],
			linux: [
				'/usr/bin/wing',
				'/opt/wingware/wing-pro-9/bin/wing'
			]
		},
		projectFileExtensions: ['.py', '.wpr', 'requirements.txt']
	},
	rstudio: {
		name: 'rstudio',
		displayName: 'RStudio',
		icon: '$(symbol-class)',
		supportedExtensions: ['.r', '.R', '.Rmd', '.qmd'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\RStudio\\bin\\rstudio.exe',
				'C:\\Program Files\\RStudio\\rstudio.exe'
			],
			darwin: [
				'/Applications/RStudio.app/Contents/MacOS/RStudio'
			],
			linux: [
				'/usr/bin/rstudio',
				'/opt/rstudio/bin/rstudio'
			]
		},
		projectFileExtensions: ['.r', '.R', '.Rproj', '.Rmd', '.qmd']
	},
	matlab: {
		name: 'matlab',
		displayName: 'MATLAB',
		icon: '$(symbol-class)',
		supportedExtensions: ['.m', '.mlx', '.mat'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\MATLAB\\R2023b\\bin\\matlab.exe',
				'C:\\Program Files\\MATLAB\\R2023a\\bin\\matlab.exe',
				'C:\\Program Files\\MATLAB\\R2022b\\bin\\matlab.exe'
			],
			darwin: [
				'/Applications/MATLAB_R2023b.app/bin/matlab',
				'/Applications/MATLAB_R2023a.app/bin/matlab'
			],
			linux: [
				'/usr/local/MATLAB/R2023b/bin/matlab',
				'/opt/matlab/bin/matlab'
			]
		},
		projectFileExtensions: ['.m', '.mlx', '.prj']
	},
	octave: {
		name: 'octave',
		displayName: 'GNU Octave',
		icon: '$(symbol-class)',
		supportedExtensions: ['.m', '.oct'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\GNU Octave\\Octave-*\\mingw64\\bin\\octave-gui.exe',
				'C:\\Octave\\bin\\octave-gui.exe'
			],
			darwin: [
				'/Applications/Octave-*.app/Contents/Resources/usr/bin/octave',
				'/usr/local/bin/octave'
			],
			linux: [
				'/usr/bin/octave',
				'/usr/local/bin/octave'
			]
		}
	},
	lazarus: {
		name: 'lazarus',
		displayName: 'Lazarus',
		icon: '$(symbol-class)',
		supportedExtensions: ['.pas', '.pp', '.lpr', '.lfm'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\lazarus\\lazarus.exe',
				'C:\\Program Files\\Lazarus\\lazarus.exe'
			],
			darwin: [
				'/Applications/Lazarus.app/Contents/MacOS/lazarus'
			],
			linux: [
				'/usr/bin/lazarus',
				'/opt/lazarus/lazarus'
			]
		},
		projectFileExtensions: ['.lpi', '.lpk', '.pas']
	},
	radstudio: {
		name: 'radstudio',
		displayName: 'RAD Studio / Delphi',
		icon: '$(symbol-class)',
		supportedExtensions: ['.pas', '.dpr', '.dpk', '.cpp', '.h'],
		supportedPlatforms: ['win32'],
		defaultPaths: {
			win32: [
				'C:\\Program Files (x86)\\Embarcadero\\Studio\\*\\bin\\bds.exe',
				'C:\\Program Files\\Embarcadero\\Studio\\*\\bin\\bds.exe'
			]
		},
		projectFileExtensions: ['.dproj', '.cbproj', '.groupproj']
	},
	rustrover: {
		name: 'rustrover',
		displayName: 'RustRover',
		icon: '$(symbol-class)',
		supportedExtensions: ['.rs', '.toml'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\JetBrains\\Toolbox\\apps\\RustRover\\ch-0\\*\\bin\\rustrover64.exe',
				'C:\\Program Files\\JetBrains\\RustRover *\\bin\\rustrover64.exe'
			],
			darwin: [
				'/Applications/RustRover.app/Contents/MacOS/rustrover',
				'/Users/*/Library/Application Support/JetBrains/Toolbox/apps/RustRover/ch-0/*/RustRover.app/Contents/MacOS/rustrover'
			],
			linux: [
				'/opt/rustrover/bin/rustrover.sh',
				'~/jetbrains/rustrover/bin/rustrover.sh'
			]
		},
		projectFileExtensions: ['.rs', 'Cargo.toml', 'Cargo.lock']
	},
	ccs: {
		name: 'ccs',
		displayName: 'Code Composer Studio',
		icon: '$(symbol-class)',
		supportedExtensions: ['.c', '.cpp', '.h', '.asm'],
		supportedPlatforms: ['win32', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\ti\\ccs*\\ccs\\eclipse\\ccstudio.exe'
			],
			linux: [
				'/opt/ti/ccs*/ccs/eclipse/ccstudio',
				'~/ti/ccs*/ccs/eclipse/ccstudio'
			]
		},
		projectFileExtensions: ['.project', '.cproject', '.cfg']
	},
	mplabx: {
		name: 'mplabx',
		displayName: 'MPLAB X IDE',
		icon: '$(symbol-class)',
		supportedExtensions: ['.c', '.cpp', '.h', '.asm', '.s'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\Microchip\\MPLABX\\*\\mplab_platform\\bin\\mplab_ide.exe'
			],
			darwin: [
				'/Applications/microchip/mplabx/*/mplab_platform/bin/mplab_ide'
			],
			linux: [
				'/opt/microchip/mplabx/*/mplab_platform/bin/mplab_ide'
			]
		}
	},
	stm32cubeide: {
		name: 'stm32cubeide',
		displayName: 'STM32CubeIDE',
		icon: '$(symbol-class)',
		supportedExtensions: ['.c', '.cpp', '.h', '.ioc'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\ST\\STM32CubeIDE_*\\STM32CubeIDE\\stm32cubeide.exe'
			],
			darwin: [
				'/Applications/STM32CubeIDE.app/Contents/MacOS/stm32cubeide'
			],
			linux: [
				'/opt/st/stm32cubeide*/stm32cubeide',
				'~/STMicroelectronics/STM32Cube/STM32CubeIDE/stm32cubeide'
			]
		},
		projectFileExtensions: ['.project', '.cproject', '.ioc']
	},
	keil: {
		name: 'keil',
		displayName: 'Keil µVision',
		icon: '$(symbol-class)',
		supportedExtensions: ['.c', '.cpp', '.h', '.asm', '.s'],
		supportedPlatforms: ['win32'],
		defaultPaths: {
			win32: [
				'C:\\Keil_v5\\UV4\\UV4.exe',
				'C:\\Keil\\ARM\\UV4\\UV4.exe'
			]
		},
		projectFileExtensions: ['.uvprojx', '.uvoptx']
	},
	iar: {
		name: 'iar',
		displayName: 'IAR Embedded Workbench',
		icon: '$(symbol-class)',
		supportedExtensions: ['.c', '.cpp', '.h', '.asm', '.s'],
		supportedPlatforms: ['win32'],
		defaultPaths: {
			win32: [
				'C:\\Program Files (x86)\\IAR Systems\\Embedded Workbench *\\common\\bin\\IarIdePm.exe',
				'C:\\Program Files\\IAR Systems\\Embedded Workbench *\\common\\bin\\IarIdePm.exe'
			]
		},
		projectFileExtensions: ['.ewp', '.eww', '.ewd']
	},
	arduino: {
		name: 'arduino',
		displayName: 'Arduino IDE',
		icon: '$(symbol-class)',
		supportedExtensions: ['.ino', '.pde', '.c', '.cpp', '.h'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Program Files\\Arduino IDE\\Arduino IDE.exe',
				'C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Arduino IDE\\Arduino IDE.exe'
			],
			darwin: [
				'/Applications/Arduino IDE.app/Contents/MacOS/Arduino IDE'
			],
			linux: [
				'/usr/bin/arduino-ide',
				'/opt/arduino-ide/arduino-ide',
				'~/.local/bin/arduino-ide'
			]
		},
		projectFileExtensions: ['.ino', '.pde']
	},
	processing: {
		name: 'processing',
		displayName: 'Processing IDE',
		icon: '$(symbol-class)',
		supportedExtensions: ['.pde', '.java'],
		supportedPlatforms: ['win32', 'darwin', 'linux'],
		defaultPaths: {
			win32: [
				'C:\\Users\\%USERNAME%\\AppData\\Local\\Processing*\\processing.exe'
			],
			darwin: [
				'/Applications/Processing.app/Contents/MacOS/Processing'
			],
			linux: [
				'/opt/processing*/processing',
				'~/processing*/processing'
			]
		},
		projectFileExtensions: ['.pde']
	}
};

/**
 * In-memory cache for IDE executable paths. Once an IDE's
 * executable has been resolved the path is stored here to avoid
 * repeatedly searching the file system on subsequent invocations.
 * The cache is keyed by the IDE's key (e.g. "rider", "clion").
 * Cached paths are validated before use and cleared whenever the
 * extension's configuration changes. See clearIDECaches().
 */
const idePathCache: Record<string, string | undefined> = {};

/**
 * Clears all cached IDE paths. This should be called whenever
 * configuration affecting IDE detection changes (e.g. enabled
 * IDEs, custom paths) to ensure that outdated paths do not
 * persist across sessions. This function simply deletes all
 * keys from the cache.
 */
function clearIDECaches(): void {
	for (const key of Object.keys(idePathCache)) {
		delete idePathCache[key];
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('OYI - Open in your IDE extension by Orvexa by KAGEYOSHI is now active!');

	// Register the main command to open in IDE
	const disposable = vscode.commands.registerCommand('OpenInVisualStudio.openInIDE', async (uri: vscode.Uri) => {
		try {
			await openInIDE(uri);
		} catch (error) {
			vscode.window.showErrorMessage(l10n('failedToOpen', error instanceof Error ? error.message : String(error)));
		}
	});

	// Register dynamic commands for each IDE when only one is enabled
	const disposables = registerDynamicCommands();

	// Update command registration based on enabled IDEs
	updateCommandRegistration();

	// Watch for configuration changes. When settings related to this
	// extension change we both update the command registration and
	// clear any cached IDE executable paths to force re‑resolution.
	const configWatcher = vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('openInIDE')) {
			updateCommandRegistration();
			clearIDECaches();
		}
	});

	context.subscriptions.push(disposable, configWatcher, ...disposables);
}

function registerDynamicCommands(): vscode.Disposable[] {
	const disposables: vscode.Disposable[] = [];
	
	// Register commands for each IDE
	for (const [ideKey, ide] of Object.entries(IDE_DEFINITIONS)) {
		const command = `OpenInVisualStudio.openIn${ide.name}`;
		const disposable = vscode.commands.registerCommand(command, async (uri: vscode.Uri) => {
			try {
				await openInSpecificIDE(uri, ideKey);
			} catch (error) {
				vscode.window.showErrorMessage(l10n('failedToOpen', error instanceof Error ? error.message : String(error)));
			}
		});
		disposables.push(disposable);
	}
	
	return disposables;
}

function updateCommandRegistration() {
	const config = vscode.workspace.getConfiguration('openInIDE');
	const enabledIDEs: string[] = config.get('enabledIDEs', ['visualstudio', 'rider', 'clion']);
	const currentPlatform = os.platform();
	
	// Filter IDEs based on current platform
	const availableIDEs = enabledIDEs.filter(ideKey => {
		const ide = IDE_DEFINITIONS[ideKey];
		return ide && ide.supportedPlatforms.includes(currentPlatform);
	});

	// Update context for conditional menu items
	vscode.commands.executeCommand('setContext', 'openInIDE.availableIDEs', availableIDEs.length);
	vscode.commands.executeCommand('setContext', 'openInIDE.singleIDE', availableIDEs.length === 1);
	
	if (availableIDEs.length === 1) {
		const ide = IDE_DEFINITIONS[availableIDEs[0]];
		vscode.commands.executeCommand('setContext', 'openInIDE.singleIDEName', ide.displayName);
		vscode.commands.executeCommand('setContext', 'openInIDE.singleIDEKey', availableIDEs[0]);
	}
}

async function openInSpecificIDE(uri: vscode.Uri, ideKey: string) {
	if (!uri) {
		vscode.window.showErrorMessage(l10n('noFileSelected'));
		return;
	}

	const filePath = uri.fsPath;
	const config = vscode.workspace.getConfiguration('openInIDE');
	const customIDEPaths: { [key: string]: string } = config.get('customIDEPaths', {});

	// Find target path
	let targetPath = await findTargetPath(filePath, ideKey);
	if (!targetPath) {
		return;
	}

	// Find IDE path
	const idePath = await findIDEPath(ideKey, customIDEPaths);
	if (!idePath) {
		const ideName = IDE_DEFINITIONS[ideKey].displayName;
		vscode.window.showErrorMessage(l10n('ideNotFound', ideName));
		return;
	}

	// Open in selected IDE
	try {
        await launchIDE(idePath, targetPath);
		const ideName = IDE_DEFINITIONS[ideKey].displayName;
		vscode.window.showInformationMessage(l10n('openedInIde', path.basename(targetPath), ideName));
	} catch (error) {
		const ideName = IDE_DEFINITIONS[ideKey].displayName;
		throw new Error(l10n('failedToLaunch', ideName, error instanceof Error ? error.message : String(error)));
	}
}

async function openInIDE(uri: vscode.Uri) {
	if (!uri) {
		vscode.window.showErrorMessage(l10n('noFileSelected'));
		return;
	}

	const filePath = uri.fsPath;
	const config = vscode.workspace.getConfiguration('openInIDE');
	const enabledIDEs: string[] = config.get('enabledIDEs', ['visualstudio', 'rider', 'clion']);
	const customIDEPaths: { [key: string]: string } = config.get('customIDEPaths', {});
	const defaultIDE: string = config.get('defaultIDE', 'visualstudio');

	// Filter IDEs based on current platform and enabled list
	const currentPlatform = os.platform();
	let availableIDEs = enabledIDEs.filter(ideKey => {
		const ide = IDE_DEFINITIONS[ideKey];
		return ide && ide.supportedPlatforms.includes(currentPlatform);
	});

	// Use content‑based heuristics to reorder IDEs. Suggestions for the
	// selected project are placed at the beginning of the list. This
	// preserves the original order of non‑recommended IDEs. Only IDEs
	// that are both enabled and platform‑supported will be considered.
	const contentSuggestions = suggestIDEsForProject(filePath);
	if (contentSuggestions.length > 0) {
		const recommended = contentSuggestions.filter(key => availableIDEs.includes(key));
		const others = availableIDEs.filter(key => !recommended.includes(key));
		availableIDEs = [...recommended, ...others];
	}

	if (availableIDEs.length === 0) {
		vscode.window.showErrorMessage(l10n('noIDEsEnabled'));
		return;
	}

	let selectedIDE: string;

	if (availableIDEs.length === 1) {
		// Only one IDE available, use it directly
		selectedIDE = availableIDEs[0];
		
		// Update the title for single IDE usage
		const ideName = IDE_DEFINITIONS[selectedIDE].displayName;
		const singleIDETitle = l10n('openIn', ideName);
		
		// We can't dynamically change the title after registration, but we can provide feedback
		console.log(`Using single IDE mode: ${singleIDETitle}`);
	} else {
		// Multiple IDEs available, let user choose
		const ideOptions = availableIDEs.map(ideKey => ({
			label: IDE_DEFINITIONS[ideKey].displayName,
			detail: ideKey,
			picked: ideKey === defaultIDE
		}));

		const selected = await vscode.window.showQuickPick(ideOptions, {
			placeHolder: l10n('selectIDE')
		});

		if (!selected) {
			return; // User cancelled
		}

		selectedIDE = selected.detail;
	}

	// Find target path
	let targetPath = await findTargetPath(filePath, selectedIDE);
	if (!targetPath) {
		return;
	}

	// Find IDE path
	const idePath = await findIDEPath(selectedIDE, customIDEPaths);
	if (!idePath) {
		const ideName = IDE_DEFINITIONS[selectedIDE].displayName;
		vscode.window.showErrorMessage(l10n('ideNotFound', ideName));
		return;
	}

	// Open in selected IDE
	try {
        await launchIDE(idePath, targetPath);
		const ideName = IDE_DEFINITIONS[selectedIDE].displayName;
		vscode.window.showInformationMessage(l10n('openedInIde', path.basename(targetPath), ideName));
	} catch (error) {
		const ideName = IDE_DEFINITIONS[selectedIDE].displayName;
		throw new Error(l10n('failedToLaunch', ideName, error instanceof Error ? error.message : String(error)));
	}
}

async function findTargetPath(filePath: string, ideKey: string): Promise<string | null> {
	// Validate input parameters
	if (!filePath || typeof filePath !== 'string') {
		console.error('Invalid file path provided');
		return null;
	}
	
	if (!ideKey || typeof ideKey !== 'string' || !IDE_DEFINITIONS[ideKey]) {
		console.error('Invalid IDE key provided');
		return null;
	}
	
	const ide = IDE_DEFINITIONS[ideKey];
	
	// Sanitize file path
	const sanitizedPath = sanitizePath(filePath);
	if (!sanitizedPath) {
		console.error('Invalid or dangerous file path detected');
		return null;
	}
	
	let stat;
	try {
		stat = fs.statSync(sanitizedPath);
	} catch (error) {
		console.error('Error accessing file:', error instanceof Error ? error.message : String(error));
		return null;
	}

	// If it's a file, check if it's a supported project file OR allow any file for universal support
	if (stat.isFile()) {
		const ext = path.extname(sanitizedPath);
		
		// Always allow opening any file - universal support for all languages
		if (ide.supportedExtensions.includes(ext)) {
			// It's a specifically supported project file
			return sanitizedPath;
		} else {
			// For universal support, allow opening ANY file in ANY IDE
			// The IDE will handle it appropriately (e.g., open containing folder if needed)
			console.log(`Opening file with extension ${ext} in ${ideKey} (universal mode)`);
			return sanitizedPath;
		}
	}

	// If it's a directory, look for project files
	if (stat.isDirectory()) {
		const projectFiles = findProjectFiles(sanitizedPath, ide);
		
		if (projectFiles.length === 0) {
			// No project files found, open the folder directly
			return sanitizedPath;
		} else if (projectFiles.length === 1) {
			// Single project file found, use it
			return projectFiles[0];
		} else {
			// Multiple project files found, let user choose
			const selectedProject = await vscode.window.showQuickPick(
				projectFiles.map(project => ({
					label: path.basename(project),
					description: path.dirname(project),
					detail: project
				})),
				{
					placeHolder: l10n('multipleProjectsFound')
				}
			);
			
			if (!selectedProject) {
				return null; // User cancelled
			}
			
			return selectedProject.detail;
		}
	}

	return sanitizedPath;
}

function findProjectFiles(directory: string, ide: IDEDefinition): string[] {
	const projectFiles: string[] = [];
	const extensions = ide.projectFileExtensions || ide.supportedExtensions;
	
	// Universal project file patterns for all languages and frameworks
	const universalProjectPatterns = [
		// .NET
		'.sln', '.csproj', '.vbproj', '.fsproj', '.vcxproj',
		// Java
		'pom.xml', 'build.gradle', 'build.gradle.kts',
		// Node.js/JavaScript
		'package.json', 'tsconfig.json', 'jsconfig.json',
		// Python
		'setup.py', 'pyproject.toml', 'requirements.txt', 'Pipfile',
		// Rust
		'Cargo.toml',
		// Go
		'go.mod',
		// PHP
		'composer.json',
		// Ruby
		'Gemfile',
		// C/C++
		'CMakeLists.txt', 'Makefile', '.pro',
		// Android
		'build.gradle', 'AndroidManifest.xml',
		// iOS/macOS
		'.xcodeproj', '.xcworkspace',
		// Unity
		'.unitypackage',
		// Unreal Engine
		'.uproject',
		// Generic
		'.project', '.classpath' // Eclipse
	];
	
	// Combine IDE-specific extensions with universal patterns
	const allPatterns = [...new Set([...extensions, ...universalProjectPatterns])];
	
	// Validate input
	if (!directory || !ide || !Array.isArray(extensions)) {
		console.error('Invalid parameters for findProjectFiles');
		return projectFiles;
	}
	
	// Sanitize directory path
	const sanitizedDirectory = sanitizePath(directory);
	if (!sanitizedDirectory) {
		console.error('Invalid directory path');
		return projectFiles;
	}
	
	try {
		const items = fs.readdirSync(sanitizedDirectory);
		
		for (const item of items) {
			// Skip hidden files and dangerous file names
			if (item.startsWith('.') && !item.match(/\.(project|classpath|gitignore)$/)) {
				continue;
			}
			if (item.includes('..')) {
				continue;
			}
			
			const itemPath = path.join(sanitizedDirectory, item);
			
			// Additional path validation
			const sanitizedItemPath = sanitizePath(itemPath);
			if (!sanitizedItemPath) {
				continue;
			}
			
			try {
				const stat = fs.statSync(sanitizedItemPath);
				
				if (stat.isFile()) {
					const ext = path.extname(item);
					const fileName = path.basename(item);
					
					// Check for exact filename matches (like package.json, pom.xml)
					if (allPatterns.some(pattern => 
						pattern.startsWith('.') ? ext === pattern : fileName === pattern
					)) {
						projectFiles.push(sanitizedItemPath);
					}
				} else if (stat.isDirectory()) {
					// Check for directory-based projects (like .xcodeproj, .xcworkspace)
					const dirName = path.basename(item);
					if (allPatterns.some(pattern => 
						pattern.includes('.') && dirName.endsWith(pattern)
					)) {
						projectFiles.push(sanitizedItemPath);
					}
				}
			} catch {
				// Ignore files that can't be accessed
				continue;
			}
		}
	} catch (error) {
		console.error('Error reading directory:', error instanceof Error ? error.message : String(error));
	}
	
	return projectFiles;
}

async function findIDEPath(ideKey: string, customPaths: { [key: string]: string }): Promise<string | null> {
	// Check cache first. If we have previously resolved this IDE's
	// executable and it still exists on disk, return it directly.
	if (idePathCache.hasOwnProperty(ideKey)) {
		const cached = idePathCache[ideKey];
		if (cached && fs.existsSync(cached)) {
			return cached;
		} else {
			// Remove invalid or stale cache entries
			delete idePathCache[ideKey];
		}
	}
	// Validate input parameters
	if (!ideKey || typeof ideKey !== 'string' || !IDE_DEFINITIONS[ideKey]) {
		console.error('Invalid IDE key provided');
		return null;
	}
	
	if (!customPaths || typeof customPaths !== 'object') {
		console.error('Invalid custom paths object');
		return null;
	}
	
	const ide = IDE_DEFINITIONS[ideKey];
	const currentPlatform = os.platform();

    // Check custom path first
    if (customPaths[ideKey]) {
        const sanitizedCustomPath = sanitizePath(customPaths[ideKey]);
        if (sanitizedCustomPath && fs.existsSync(sanitizedCustomPath)) {
            // Cache the valid custom path for future resolution
            idePathCache[ideKey] = sanitizedCustomPath;
            return sanitizedCustomPath;
        } else if (customPaths[ideKey]) {
            console.warn(`Custom path for ${ideKey} is invalid or doesn't exist: ${customPaths[ideKey]}`);
        }
    }

	// Check default paths for current platform
	const defaultPaths = ide.defaultPaths[currentPlatform] || [];
	
	for (const idePath of defaultPaths) {
		// Handle wildcards and environment variables
		let expandedPath = idePath;
		
		// Expand environment variables
		if (currentPlatform === 'win32') {
			expandedPath = expandedPath.replace(/%([^%]+)%/g, (match, envVar) => {
				const envValue = process.env[envVar];
				return envValue ? envValue : match;
			});
		} else {
			expandedPath = expandedPath.replace(/~/, os.homedir());
			expandedPath = expandedPath.replace(/\$([A-Z_][A-Z0-9_]*)/g, (match, envVar) => {
				const envValue = process.env[envVar];
				return envValue ? envValue : match;
			});
		}
		
        // Handle wildcards by finding matching paths
        if (expandedPath.includes('*')) {
            const matchingPaths = findWildcardPaths(expandedPath);
            for (const matchPath of matchingPaths) {
                const sanitizedMatchPath = sanitizePath(matchPath);
                if (sanitizedMatchPath && fs.existsSync(sanitizedMatchPath)) {
                    // Cache the first valid match and return
                    idePathCache[ideKey] = sanitizedMatchPath;
                    return sanitizedMatchPath;
                }
            }
        } else {
            const sanitizedExpandedPath = sanitizePath(expandedPath);
            if (sanitizedExpandedPath && fs.existsSync(sanitizedExpandedPath)) {
                // Cache the resolved path
                idePathCache[ideKey] = sanitizedExpandedPath;
                return sanitizedExpandedPath;
            }
        }
	}

	// Special handling for Visual Studio using vswhere
	if (ideKey === 'visualstudio' && currentPlatform === 'win32') {
		try {
			const vswherePath = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe';
			if (fs.existsSync(vswherePath)) {
				// Sanitize vswhere path
				const sanitizedVswherePath = sanitizePath(vswherePath);
				if (!sanitizedVswherePath) {
					console.error('Invalid vswhere path detected');
					return null;
				}
				
				const output = execSync(`"${sanitizedVswherePath}" -latest -products * -requires Microsoft.VisualStudio.Workload.ManagedDesktop -property installationPath`, { 
					encoding: 'utf8',
					timeout: 5000 // 5 second timeout
				});
				const installPath = output.trim();
				
				if (installPath) {
					const devenvPath = path.join(installPath, 'Common7', 'IDE', 'devenv.exe');
					const sanitizedDevenvPath = sanitizePath(devenvPath);
					if (sanitizedDevenvPath && fs.existsSync(sanitizedDevenvPath)) {
                        // Cache the resolved Visual Studio path and return
                        idePathCache[ideKey] = sanitizedDevenvPath;
                        return sanitizedDevenvPath;
					}
				}
			}
		} catch (error) {
			console.error('Error using vswhere:', error instanceof Error ? error.message : String(error));
			// Don't throw here, continue with fallback detection
		}
	}

	return null;
}

function findWildcardPaths(pattern: string): string[] {
	// Simple wildcard matching with security considerations
	const paths: string[] = [];
	
	// Validate input pattern
	if (!pattern || typeof pattern !== 'string') {
		console.error('Invalid wildcard pattern');
		return paths;
	}
	
	// Sanitize the pattern
	const sanitizedPattern = sanitizePath(pattern.replace(/\*/g, 'WILDCARD_PLACEHOLDER'));
	if (!sanitizedPattern) {
		console.error('Invalid or dangerous wildcard pattern');
		return paths;
	}
	
	const parts = pattern.split('*');
	
	if (parts.length === 2) {
		const [prefix, suffix] = parts;
		const dir = path.dirname(prefix);
		
		// Validate directory path
		const sanitizedDir = sanitizePath(dir);
		if (!sanitizedDir) {
			console.error('Invalid directory in wildcard pattern');
			return paths;
		}
		
		try {
			if (fs.existsSync(sanitizedDir)) {
				const items = fs.readdirSync(sanitizedDir);
				
				for (const item of items) {
					// Skip dangerous items
					if (item.startsWith('.') || item.includes('..') || item.includes('\0')) {
						continue;
					}
					
					const fullPath = path.join(sanitizedDir, item) + suffix;
					const sanitizedFullPath = sanitizePath(fullPath);
					
					if (sanitizedFullPath && fs.existsSync(sanitizedFullPath)) {
						paths.push(sanitizedFullPath);
					}
				}
			}
		} catch (error) {
			console.error('Error finding wildcard paths:', error instanceof Error ? error.message : String(error));
		}
	}
	
	return paths;
}

/**
 * Launch the selected IDE with a simple command, passing only the target path
 * (file or folder). This function bypasses advanced workspace isolation and
 * command‑line flags, relying on the operating system to start a new
 * instance. On macOS it uses `open -a` to launch the application, on
 * Windows it wraps the call with `start` to detach, and on Linux it
 * executes the IDE binary directly.
 */
async function launchIDE(idePath: string, targetPath: string): Promise<void> {
    const sanitizedIdePath = sanitizePath(idePath);
    const sanitizedTargetPath = sanitizePath(targetPath);
    if (!sanitizedIdePath || !sanitizedTargetPath) {
        throw new Error('Invalid or potentially dangerous path detected');
    }
    const platform = os.platform();
    if (platform === 'win32') {
        const args: string[] = ['/c', 'start', '', sanitizedIdePath, sanitizedTargetPath];
        spawn('cmd', args, {
            detached: true,
            stdio: 'ignore',
            windowsHide: true
        }).unref();
        return;
    }
    if (platform === 'darwin') {
        if (sanitizedIdePath.endsWith('.app') || sanitizedIdePath.includes('.app/')) {
            spawn('open', ['-a', sanitizedIdePath, '--args', sanitizedTargetPath], {
                detached: true,
                stdio: 'ignore'
            }).unref();
        } else {
            spawn(sanitizedIdePath, [sanitizedTargetPath], {
                detached: true,
                stdio: 'ignore'
            }).unref();
        }
        return;
    }
    spawn(sanitizedIdePath, [sanitizedTargetPath], {
        detached: true,
        stdio: 'ignore'
    }).unref();
}

// Universal IDE launcher with workspace isolation for all IDEs
async function launchIDESafely(idePath: string, targetPath: string, ideKey: string, platform: string): Promise<void> {
	try {
		// Check for workspace conflicts before launching any IDE
		const hasConflicts = await detectWorkspaceConflicts(targetPath);
		if (hasConflicts) {
			console.log(`Workspace conflicts detected for ${ideKey}, using enhanced isolation mode`);
		}
		
		// Get global workspace isolation configuration
		const config = vscode.workspace.getConfiguration('openInIDE');
		const globalOptions = config.get('workspaceIsolation', {
			enabled: true,
			useNewInstance: true,
			preventStartupConflicts: true,
			enhancedMode: true
		});
		
		// IDE-specific configurations
		const ideSpecificOptions = config.get(`${ideKey}Options`, {});
		const mergedOptions = { ...globalOptions, ...ideSpecificOptions };
		
		if (platform === 'win32') {
			await launchIDEWindows(idePath, targetPath, ideKey, mergedOptions, hasConflicts);
		} else if (platform === 'darwin') {
			await launchIDEMacOS(idePath, targetPath, ideKey, mergedOptions, hasConflicts);
		} else {
			await launchIDELinux(idePath, targetPath, ideKey, mergedOptions, hasConflicts);
		}
		
	} catch (error) {
		console.warn(`Enhanced ${ideKey} launch failed, trying fallback methods:`, error);
		await launchIDEFallback(idePath, targetPath, ideKey, platform);
	}
}

// Windows-specific IDE launching with isolation
async function launchIDEWindows(idePath: string, targetPath: string, ideKey: string, options: WorkspaceIsolationOptions, hasConflicts: boolean): Promise<void> {
	let commandArgs: string[] = [];
	
	// Build command arguments based on IDE type and options
	if (ideKey === 'visualstudio') {
		commandArgs = buildVisualStudioArgs(targetPath, options, hasConflicts);
	} else if (ideKey === 'rider') {
		commandArgs = buildJetBrainsArgs(targetPath, options, hasConflicts);
	} else if (['intellij', 'webstorm', 'pycharm', 'goland', 'rubymine', 'phpstorm', 'androidstudio', 'clion', 'rustrover'].includes(ideKey)) {
		commandArgs = buildJetBrainsArgs(targetPath, options, hasConflicts);
	} else if (ideKey === 'eclipse') {
		commandArgs = buildEclipseArgs(targetPath, options, hasConflicts);
	} else {
		commandArgs = buildGenericArgs(targetPath, options, hasConflicts);
	}
	
	// Note: targetPath is already included in the build functions above, no need to add it again
	
	// Construct and execute command
	const command = `"${idePath}" ${commandArgs.map(arg => `"${arg}"`).join(' ')}`;
	
	execSync(command, {
		windowsHide: true,
		timeout: options.enhancedMode ? 20000 : 15000,
		stdio: 'ignore'
	});
	
	// Brief wait for IDE initialization
	if (options.enhancedMode || hasConflicts) {
		await new Promise(resolve => setTimeout(resolve, 2000));
	}
}

// macOS-specific IDE launching
async function launchIDEMacOS(idePath: string, targetPath: string, ideKey: string, options: WorkspaceIsolationOptions, hasConflicts: boolean): Promise<void> {
	let command: string;
	
	if (ideKey === 'xcode') {
		command = `open -a "${idePath}" "${targetPath}"`;
	} else if (options.useNewInstance && hasConflicts) {
		// For macOS, use -n flag to open new instance when conflicts detected
		command = `open -n -a "${idePath}" "${targetPath}"`;
	} else {
		command = `"${idePath}" "${targetPath}"`;
	}
	
	execSync(command, {
		timeout: options.enhancedMode ? 20000 : 15000,
		stdio: 'ignore'
	});
}

// Linux-specific IDE launching
async function launchIDELinux(idePath: string, targetPath: string, ideKey: string, options: WorkspaceIsolationOptions, hasConflicts: boolean): Promise<void> {
	let command: string;
	
	// For JetBrains IDEs on Linux, add workspace isolation flags
	if (['intellij', 'webstorm', 'pycharm', 'goland', 'rubymine', 'phpstorm', 'androidstudio', 'clion', 'rustrover', 'rider'].includes(ideKey)) {
		const jetbrainsArgs = buildJetBrainsArgs(targetPath, options, hasConflicts);
		command = `"${idePath}" ${jetbrainsArgs.map((arg: string) => `"${arg}"`).join(' ')}`;
	} else {
		command = `"${idePath}" "${targetPath}"`;
	}
	
	// Add background execution for non-test environments
	if (process.env['NODE_ENV'] !== 'test' && process.env['VSCODE_TEST_ENV'] !== 'true') {
		command += ' &';
	}
	
	execSync(command, {
		stdio: 'ignore',
		timeout: options.enhancedMode ? 20000 : 15000
	});
}

// Build Visual Studio specific arguments
function buildVisualStudioArgs(targetPath: string, options: WorkspaceIsolationOptions, hasConflicts: boolean): string[] {
	const args: string[] = [];
	
	// Visual Studio switches must come BEFORE the project file
	if (options.preventStartupConflicts || hasConflicts) {
		args.push('/nosplash');
		args.push('/resetskippkgs');
	}
	
	if (options.useNewInstance || hasConflicts) {
		args.push('/newinstance');
		
		// Special Visual Studio handling for IntelliSense database conflicts
		// Create a unique temporary folder for this instance to avoid database conflicts
		const tempId = Date.now().toString();
		args.push('/TempPE', `%TEMP%\\VSTemp_${tempId}`);
	}
	
	if (options.enhancedMode && hasConflicts) {
		args.push('/safemode');
		// Additional isolation for C++ IntelliSense database
		args.push('/log');  // Enable logging to help with debugging
	}
	
	// Project file comes LAST for Visual Studio
	args.push(targetPath);
	
	return args;
}

// Build JetBrains IDEs specific arguments
function buildJetBrainsArgs(targetPath: string, options: WorkspaceIsolationOptions, hasConflicts: boolean): string[] {
	const args: string[] = [];
	
	// JetBrains IDE switches should come before the project file
	if (options.preventStartupConflicts || hasConflicts) {
		args.push('--nosplash');
	}
	
	if (options.useNewInstance || hasConflicts) {
		// JetBrains IDEs don't have direct new instance flag, but we can use different approach
		args.push('--line', '1'); // Open at line 1 to force focus
	}
	
	if (options.enhancedMode && hasConflicts) {
		args.push('--disable-plugins'); // Disable plugins to avoid conflicts
	}
	
	// Project file comes LAST for JetBrains IDEs
	args.push(targetPath);
	
	return args;
}

// Build Eclipse specific arguments
function buildEclipseArgs(targetPath: string, options: WorkspaceIsolationOptions, hasConflicts: boolean): string[] {
	const args: string[] = [];
	
	if (options.preventStartupConflicts || hasConflicts) {
		args.push('-nosplash');
	}
	
	if (options.useNewInstance || hasConflicts) {
		args.push('-data', `${targetPath}_workspace_${Date.now()}`); // Use unique workspace
	}
	
	args.push('-import', targetPath);
	
	return args;
}

// Build generic IDE arguments
function buildGenericArgs(targetPath: string, options: WorkspaceIsolationOptions, hasConflicts: boolean): string[] {
	const args: string[] = [];
	
	// Most IDEs expect switches before the project file
	if (options.preventStartupConflicts || hasConflicts) {
		// Add common no-splash variants (try the most common first)
		args.push('--no-splash');
	}
	
	// Project file comes LAST for generic IDEs (universal pattern)
	args.push(targetPath);
	
	return args;
}

// Fallback launcher for when enhanced mode fails
async function launchIDEFallback(idePath: string, targetPath: string, ideKey: string, platform: string): Promise<void> {
	const fallbackMethods = [
		// Method 1: Basic launch with minimal args
		() => execSync(`"${idePath}" "${targetPath}"`, { 
			windowsHide: platform === 'win32',
			timeout: 15000,
			stdio: 'ignore'
		}),
		// Method 2: Just the executable without arguments (for problematic paths)
		() => execSync(`"${idePath}"`, { 
			windowsHide: platform === 'win32',
			timeout: 10000,
			stdio: 'ignore'
		})
	];
	
	let lastError: Error | null = null;
	
	for (const [index, method] of fallbackMethods.entries()) {
		try {
			await method();
			console.log(`${ideKey} launched successfully using fallback method ${index + 1}`);
			return;
		} catch (fallbackError) {
			console.warn(`Fallback method ${index + 1} failed:`, fallbackError);
			lastError = fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError));
		}
	}
	
	throw new Error(`Failed to launch ${ideKey} after all attempts: ${lastError?.message || 'Unknown error'}`);
}

// Detect potential workspace conflicts for ANY project type or language
async function detectWorkspaceConflicts(projectPath: string): Promise<boolean> {
	try {
		// Get the project directory (handle both files and directories)
		let projectDir: string;
		const stat = fs.statSync(projectPath);
		if (stat.isDirectory()) {
			projectDir = projectPath;
		} else {
			projectDir = path.dirname(projectPath);
		}
		
		// Universal workspace conflict indicators for ALL project types and languages
		const conflictIndicators = [
			// IDE-specific folders
			'.vs',           // Visual Studio
			'.vscode',       // VS Code workspace
			'.idea',         // JetBrains IDEs (IntelliJ, WebStorm, PyCharm, etc.)
			'.eclipse',      // Eclipse workspace
			'.metadata',     // Eclipse metadata
			'.settings',     // Eclipse settings
			
			// Build/compilation artifacts (universal across languages)
			'bin',           // Binary outputs (.NET, Java, C++, etc.)
			'obj',           // Object files (.NET, C++, etc.)
			'build',         // Build directories (many languages)
			'target',        // Maven/Gradle target (Java)
			'dist',          // Distribution builds (Node.js, Python, etc.)
			'out',           // Output directories (TypeScript, etc.)
			'__pycache__',   // Python cache
			'node_modules',  // Node.js dependencies
			
			// Language-specific locks and temp files
			'*.tmp',         // Temporary files
			'*.lock',        // Lock files (package-lock.json, yarn.lock, etc.)
			'.tox',          // Python tox
			'.pytest_cache', // Python pytest
			'.coverage',     // Coverage files
			'coverage',      // Coverage directories
			
			// Version control temp files
			'.git/index.lock', // Git lock
			'.svn/lock',       // SVN lock
		];
		
		// Check each indicator
		for (const indicator of conflictIndicators) {
			let indicatorPath: string;
			
			// Handle wildcard patterns
			if (indicator.includes('*')) {
				try {
					const pattern = indicator.replace('*', '');
					const files = fs.readdirSync(projectDir);
					const matchingFiles = files.filter(file => file.includes(pattern));
					
					if (matchingFiles.length > 0) {
						// Check if any matching file was modified recently
						for (const file of matchingFiles) {
							const filePath = path.join(projectDir, file);
							if (fs.existsSync(filePath)) {
								const stats = fs.statSync(filePath);
								const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
								if (stats.mtime.getTime() > fiveMinutesAgo) {
									console.log(`Workspace conflict detected: Recent activity in ${file}`);
									return true;
								}
							}
						}
					}
				} catch {
					// Continue checking other indicators
					continue;
				}
			} else {
				// Handle specific paths
				if (indicator.includes('/')) {
					indicatorPath = path.join(projectDir, indicator);
				} else {
					indicatorPath = path.join(projectDir, indicator);
				}
				
				if (fs.existsSync(indicatorPath)) {
					try {
						const stats = fs.statSync(indicatorPath);
						// If file/folder was modified recently (within last 5 minutes), likely in use
						const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
						if (stats.mtime.getTime() > fiveMinutesAgo) {
							console.log(`Workspace conflict detected: Recent activity in ${indicator}`);
							return true;
						}
					} catch {
						// File exists but can't stat, might be locked - assume conflict
						console.log(`Workspace conflict detected: Cannot access ${indicator} (possibly locked)`);
						return true;
					}
				}
			}
		}
		
		// Additional check: Look for any active IDE processes that might be using this workspace
		try {
			// This is a heuristic - if VS Code has the workspace open and other IDEs are detected
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (workspaceFolders) {
				for (const folder of workspaceFolders) {
					if (projectDir.startsWith(folder.uri.fsPath) || folder.uri.fsPath.startsWith(projectDir)) {
						console.log('Workspace conflict detected: VS Code has this workspace open');
						return true; // VS Code has this workspace open
					}
				}
			}
		} catch {
			// Ignore workspace check errors
		}
		
		console.log('No workspace conflicts detected - safe to launch with standard parameters');
		return false;
	} catch (error) {
		console.warn('Error detecting workspace conflicts:', error);
		console.log('Assuming conflicts exist for safety - will use enhanced isolation');
		return true; // Err on the side of caution - use isolation if uncertain
	}
}

// Security function to sanitize file paths
function sanitizePath(inputPath: string): string | null {
	if (!inputPath || typeof inputPath !== 'string') {
		return null;
	}
	
	// Remove any null bytes
	if (inputPath.includes('\0')) {
		return null;
	}
	
	// Check for common command injection patterns
	const dangerousPatterns = [
		/[;&|`$(){}[\]]/,  // Command separators and substitution
		/\.\./,            // Directory traversal
		/^\s*-/,           // Command flags
		/\r|\n/            // Line breaks
	];
	
	for (const pattern of dangerousPatterns) {
		if (pattern.test(inputPath)) {
			console.warn(`Potentially dangerous path detected: ${inputPath}`);
			return null;
		}
	}
	
	// Normalize the path and ensure it's absolute
	try {
		const normalizedPath = path.normalize(inputPath);
		if (!path.isAbsolute(normalizedPath)) {
			return null;
		}
		return normalizedPath;
	} catch (error) {
		console.error('Path normalization failed:', error);
		return null;
	}
}

/**
 * Suggest IDEs based on the contents of the given project path.
 * This function inspects the directory (or the parent directory of a file)
 * for common project files (package.json, pyproject.toml, go.mod, etc.) and
 * returns a list of IDE keys that are well suited for those technologies.
 * The suggestions are heuristic and non‑exhaustive; they simply reorder
 * available IDEs when presenting the Quick Pick to the user. Duplicate
 * suggestions are removed, and only IDEs that exist in the current
 * configuration will be considered when sorting.
 *
 * @param filePath Path to a file or directory selected by the user
 * @returns An array of IDE keys recommended for the project
 */
function suggestIDEsForProject(filePath: string): string[] {
	try {
		// Determine the directory to inspect. If filePath is a file
		// examine its parent folder; otherwise inspect the folder itself.
		const stat = fs.statSync(filePath);
		const dir = stat.isDirectory() ? filePath : path.dirname(filePath);
		const files = fs.readdirSync(dir).map(f => f.toLowerCase());
		const suggestions: string[] = [];

		// Node/JavaScript/TypeScript projects
		if (files.includes('package.json')) {
			suggestions.push('webstorm', 'intellij');
		}

		// Python projects (PyCharm, Spyder, Wing Pro)
		if (files.includes('pyproject.toml') || files.includes('requirements.txt') || files.some(f => f.endsWith('.py'))) {
			suggestions.push('pycharm', 'spyder', 'wingpro');
		}

		// Rust projects (RustRover, CLion)
		if (files.includes('cargo.toml')) {
			suggestions.push('rustrover', 'clion');
		}

		// Go projects (GoLand)
		if (files.includes('go.mod')) {
			suggestions.push('goland');
		}

		// Java/Kotlin/Gradle/Maven projects (IntelliJ IDEA, Android Studio)
		if (files.includes('pom.xml') || files.includes('build.gradle') || files.includes('build.gradle.kts')) {
			suggestions.push('intellij', 'androidstudio');
		}

		// CMake projects (CLion)
		if (files.includes('cmakelists.txt')) {
			suggestions.push('clion');
		}

		// C/C++ projects with Makefile – general suggestion for CLion
		if (files.includes('makefile')) {
			suggestions.push('clion');
		}

		// MATLAB/Octave (MATLAB or Octave)
		if (files.some(f => f.endsWith('.m'))) {
			suggestions.push('matlab', 'octave');
		}

		// Pascal/Delphi (RAD Studio, Lazarus)
		if (files.some(f => f.endsWith('.pas'))) {
			suggestions.push('radstudio', 'lazarus');
		}

		// Embedded/Arduino – look for .ino or .pde files
		if (files.some(f => f.endsWith('.ino') || f.endsWith('.pde'))) {
			suggestions.push('arduino', 'processing');
		}

		// Suggest Visual Studio / Rider when the selected file itself is a .sln or related project file
		if (!stat.isDirectory()) {
			const ext = path.extname(filePath).toLowerCase();
			if (['.sln', '.csproj', '.vbproj', '.fsproj', '.vcxproj'].includes(ext)) {
				suggestions.push('visualstudio', 'rider');
			}
		}

		// Return unique suggestions preserving insertion order
		const seen: Record<string, boolean> = {};
		return suggestions.filter(key => {
			if (seen[key]) { return false; }
			seen[key] = true;
			return true;
		});
	} catch {
		// If anything goes wrong (e.g. unreadable directory), return empty suggestions
		return [];
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}

// Export IDE definitions for testing
export { IDE_DEFINITIONS };
/**
 * The functions below (launchIDESafely, launchIDEWindows, launchIDEMacOS, launchIDELinux,
 * launchIDEFallback, detectWorkspaceConflicts, buildVisualStudioArgs, buildJetBrainsArgs,
 * buildEclipseArgs and buildGenericArgs) remain in the source for backward compatibility
 * and potential future use. To avoid TypeScript's noUnusedLocals/noUnusedParameters
 * errors, we reference them here via a void expression. This ensures they are marked
 * as used without affecting runtime behavior.
 */
void [
    launchIDESafely,
    launchIDEWindows,
    launchIDEMacOS,
    launchIDELinux,
    launchIDEFallback,
    detectWorkspaceConflicts,
    buildVisualStudioArgs,
    buildJetBrainsArgs,
    buildEclipseArgs,
    buildGenericArgs
];
