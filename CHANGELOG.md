# Changelog

All notable changes to the "OYI - Open in your IDE" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-27

### Initial Release

#### Core Features

- **Universal IDE Integration**: Added support for 25+ IDEs with intelligent context menu options
- **Smart Project Detection**: Automatically detects appropriate IDEs based on file extensions and project types
- **Cross-Platform Support**: Full compatibility with Windows, macOS, and Linux
- **Zero Configuration Setup**: Works out of the box with automatic IDE detection

#### Supported IDEs

##### Enterprise & Professional IDEs

- **Visual Studio** (2017, 2019, 2022) - Support for `.sln`, `.csproj`, `.vbproj`, `.fsproj`, `.vcxproj`
- **JetBrains Suite**:
  - IntelliJ IDEA - Java, Kotlin projects
  - WebStorm - JavaScript, TypeScript, HTML, CSS
  - PyCharm - Python development
  - Rider - .NET development
  - CLion - C/C++ development
  - GoLand - Go development
  - RubyMine - Ruby development
  - PhpStorm - PHP development
  - RustRover - Rust development
- **Eclipse** - Java projects and general development
- **NetBeans** - Java, PHP, HTML5 projects

##### macOS Exclusive

- **Xcode** - iOS, macOS, Swift projects (`.xcodeproj`, `.xcworkspace`)

##### Specialized Development Environments

- **Android Studio** - Android development
- **Qt Creator** - Qt/C++ projects (`.pro` files)
- **Code::Blocks** - C/C++ projects (`.cbp` files)

##### Embedded and Microcontroller Development

- **STM32CubeIDE** - STM32 embedded development (`.project`, `.cproject`, `.ioc`)
- **MPLAB X** - Microchip PIC development
- **Keil µVision** - ARM Cortex development
- **IAR Embedded Workbench** - Professional embedded development
- **Code Composer Studio** - Texas Instruments development
- **Arduino IDE** - Arduino sketches (`.ino`, `.pde` files)
- **Processing** - Creative coding environment

##### Data Science and Research

- **RStudio** - R statistical computing (`.R` files)
- **MATLAB** - Mathematical computing (`.m` files)
- **Octave** - MATLAB alternative
- **Spyder** - Scientific Python development
- **Wing Pro** - Professional Python IDE

##### Text Editors and Lightweight IDEs

- **Sublime Text** - Lightweight coding
- **Atom** - Hackable text editor
- **Brackets** - Web development focused
- **Vim** - Modal text editing
- **Emacs** - Extensible text editor

##### Legacy and Specialized Languages

- **Delphi/RAD Studio** - Pascal development (`.pas`, `.dpr`, `.dpk` files)
- **Lazarus** - Free Pascal IDE (`.pas`, `.pp`, `.lpr`, `.lfm` files)

#### Advanced Features

##### Workspace Isolation System

- **Universal Workspace Isolation**: All IDEs can coexist with VS Code without conflicts
- **Smart Conflict Detection**: Automatically prevents workspace conflicts between IDEs
- **Enhanced Multi-IDE Workflows**: Seamless switching between development environments
- **Configurable Isolation Options**:
  - `enabled`: Enable/disable workspace isolation globally
  - `useNewInstance`: Launch IDEs in new instances
  - `preventStartupConflicts`: Use startup parameters to minimize conflicts
  - `enhancedMode`: Extended timeouts and advanced conflict detection

##### Visual Studio Specific Options

- **Advanced Visual Studio Integration**: Specialized options for Visual Studio launching
- **Instance Management**: Launch Visual Studio in new instances to avoid conflicts
- **Startup Conflict Prevention**: Minimize conflicts with other development tools
- **Workspace Isolation**: Prevent project system conflicts

#### Configuration System

##### IDE Selection

- **Enabled IDEs Configuration**: Choose which IDEs appear in context menus
- **Default IDE Setting**: Set primary IDE for quick access
- **Custom IDE Paths**: Override automatic detection with custom installation paths
- **Platform-Aware Filtering**: Only show IDEs compatible with current platform

##### Intelligent Context Menu

- **File Extension Awareness**: Context menu appears for relevant file types:
  - `.sln`, `.csproj`, `.vbproj`, `.fsproj`, `.vcxproj` (Visual Studio projects)
  - `.xcodeproj`, `.xcworkspace` (Xcode projects)
  - `.java`, `.kt` (Java/Kotlin files)
  - `.py` (Python files)
  - `.go` (Go files)
  - `.rb` (Ruby files)
  - `.php` (PHP files)
  - `.js`, `.ts` (JavaScript/TypeScript files)
  - `.html`, `.css` (Web files)
  - `.pro` (Qt projects)
  - `.cbp` (Code::Blocks projects)
  - `.r`, `.R` (R files)
  - `.m` (MATLAB files)
  - `.pas` (Pascal files)
  - `.rs` (Rust files)
  - `.c`, `.cpp`, `.h` (C/C++ files)
  - `.ino`, `.pde` (Arduino/Processing files)
- **Folder Support**: Context menu for folders to open entire projects
- **Smart IDE Suggestions**: Suggests most appropriate IDE based on project type

#### Internationalization

- **Multi-Language Support**: Native support for 28 languages and regional variants:
  - English variants: en-US, en-GB, en-CA, en-AU, en-IN
  - Spanish variants: es-ES, es-MX, es-AR, es-CO, es-PE
  - Portuguese variants: pt-BR, pt-PT
  - French: fr-FR
  - German: de-DE
  - Italian: it-IT
  - Japanese: ja-JP
  - Korean: ko-KR
  - Chinese: zh-CN
  - Russian: ru-RU
  - Arabic variants: ar-EG, ar-SA
  - And more: da-DK, nl-NL, pl-PL, th-TH, ur-PK, fil-PH, id-ID

#### IDE Detection System

- **Automatic IDE Detection**: Scans system for installed IDEs
- **Multi-Platform Detection**:
  - **Windows**: Registry keys, Program Files, AppData locations
  - **macOS**: Applications folder, user-specific installations
  - **Linux**: Standard installation paths, user directories
- **JetBrains Toolbox Support**: Detects IDEs installed via JetBrains Toolbox
- **Version-Aware Detection**: Supports multiple versions of the same IDE
- **Fallback Detection**: Multiple detection methods for reliability

#### Performance and Reliability

- **Efficient IDE Launching**: Optimized startup procedures for each IDE
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Timeout Management**: Configurable timeouts for IDE launching
- **Fallback Mechanisms**: Alternative launching methods when primary fails
- **Cross-Platform Compatibility**: Platform-specific optimizations

#### Development and Build System

- **TypeScript Architecture**: Full TypeScript implementation with type safety
- **esbuild Integration**: Fast bundling and watch mode for development
- **ESLint Configuration**: Code quality and consistency enforcement
- **Test Suite**: Comprehensive testing with Mocha and VS Code Test Runner
- **Automated Builds**: CI/CD pipeline for automated testing and releases
- **Release Automation**: Automated release description generation

#### Project Structure

- **Single-File Extension**: Efficient architecture in `src/extension.ts`
- **Localization Files**: Organized l10n structure for all supported languages
- **Configuration Management**: Comprehensive settings system
- **Documentation**: Extensive README, CHANGELOG, and contribution guidelines
- **Asset Management**: Icons and demo materials

### Supported File Types

- Solution Files: `.sln`
- .NET Projects: `.csproj`, `.vbproj`, `.fsproj`
- C++ Projects: `.vcxproj`
- Xcode Projects: `.xcodeproj`, `.xcworkspace`
- Source Code Files: `.java`, `.kt`, `.py`, `.go`, `.rb`, `.php`, `.js`, `.ts`, `.html`, `.css`, `.c`, `.cpp`, `.h`, `.rs`, `.pas`
- Project Files: `.pro`, `.cbp`, `.ino`, `.pde`
- Data Science: `.r`, `.R`, `.m`
- Embedded: `.project`, `.cproject`, `.ioc`

### Future Roadmap

- Additional IDE support based on community feedback
- Enhanced project detection algorithms
- Advanced workspace management features
- Plugin system for custom IDE integrations
- Performance optimizations and caching
- Extended configuration options

---

*Developed by **Orvexa by KAGEYOSHI***
