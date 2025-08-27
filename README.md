# OYI - Open in your IDE

[![Version](https://img.shields.io/visual-studio-marketplace/v/OrvexaByKageyoshi.oyi-open-in-your-ide?style=flat-square&color=blue)](https://marketplace.visualstudio.com/items?itemName=OrvexaByKageyoshi.oyi-open-in-your-ide)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/OrvexaByKageyoshi.oyi-open-in-your-ide?style=flat-square&color=green)](https://marketplace.visualstudio.com/items?itemName=OrvexaByKageyoshi.oyi-open-in-your-ide)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/OrvexaByKageyoshi.oyi-open-in-your-ide?style=flat-square&color=yellow)](https://marketplace.visualstudio.com/items?itemName=OrvexaByKageyoshi.oyi-open-in-your-ide)
[![License](https://img.shields.io/github/license/OrvexaDev/OYI?style=flat-square)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-MIT-green?style=flat-square)](LICENSE)

## Streamline your development workflow with seamless IDE integration

[🚀 Get Started](#-quick-start) • [⚙️ Configuration](#️-configuration) • [🔧 Supported IDEs](#-supported-ides) • [🤝 Contributing](#-contributing) • [📝 Changelog](CHANGELOG.md)

---

## 🎯 **What is OYI - Open in your IDE?**

**OYI (Open in your IDE)** is a powerful, **open-source** VS Code extension developed by **Orvexa by KAGEYOSHI** that adds intelligent context menu options to open your projects in the most appropriate IDE. With support for **35+ IDEs** across multiple platforms, it eliminates the friction of switching between development environments.

### ✨ **Key Features**

- 🎯 **Universal IDE Support** - 35+ IDEs including Visual Studio, JetBrains suite, Xcode, and more
- 🔍 **Smart Detection** - Automatically detects installed IDEs on your system
- 📁 **Project-Aware** - Intelligently suggests the best IDE based on project type
- 🌍 **Cross-Platform** - Windows, macOS, and Linux support
- ⚡ **Zero Configuration** - Works out of the box with automatic IDE detection
- 🛡️ **Universal Workspace Isolation** - All IDEs can coexist with VS Code without conflicts
- 🔧 **Smart Conflict Detection** - Prevents workspace conflicts automatically
- 🚀 **Enhanced Multi-IDE Workflows** - Switch seamlessly between development environments
- 🎨 **Customizable** - Configure which IDEs to show and set custom paths
- 🌐 **Internationalized** - Native support for 28 languages and regional variants

![Usage Demo](https://raw.githubusercontent.com/OrvexaDev/OYI/refs/heads/main/assets/ExemploUse.gif?token=GHSAT0AAAAAADJ3F6WPWFEWT3E6XWIA5RE62FMZPJQ)

---

## 🚀 **Quick Start**

### Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "OYI" or "Open in your IDE"
4. Click **Install**

### Basic Usage

1. **Right-click** on any file or folder in the Explorer
2. Select **"Open in IDE"** from the context menu
3. Choose your preferred IDE from the list
4. Your project opens instantly in the selected IDE!

---

## 🔧 **Supported IDEs**

### 🏢 **Enterprise & Professional**

- **Visual Studio** (2017, 2019, 2022) - `.sln`, `.csproj`, `.vbproj`, `.fsproj`, `.vcxproj`
- **JetBrains Suite** - IntelliJ IDEA, WebStorm, PyCharm, Rider, CLion, GoLand, RubyMine, PhpStorm, RustRover
- **Eclipse** - Java projects and general development
- **NetBeans** - Java, PHP, HTML5 projects

### 🍎 **macOS Exclusive**

- **Xcode** - iOS, macOS, Swift projects (`.xcodeproj`, `.xcworkspace`)

### 🎯 **Specialized IDEs**

- **Android Studio** - Android development
- **Qt Creator** - Qt/C++ projects (`.pro` files)
- **Arduino IDE** - Arduino sketches (`.ino` files)
- **Processing** - Creative coding (`.pde` files)
- **Code::Blocks** - C/C++ projects (`.cbp` files)

### 🔬 **Embedded & Microcontroller Development**

- **STM32CubeIDE** - STM32 embedded development (`.project`, `.cproject`, `.ioc`)
- **MPLAB X** - Microchip PIC development
- **Keil µVision** - ARM Cortex development
- **IAR Embedded Workbench** - Professional embedded development
- **Code Composer Studio** - Texas Instruments development

### 📊 **Data Science & Research**

- **RStudio** - R statistical computing (`.R` files)
- **MATLAB** - Mathematical computing (`.m` files)
- **Spyder** - Scientific Python development
- **Wing Pro** - Professional Python IDE

### 📝 **Text Editors & Lightweight IDEs**

- **Sublime Text** - Lightweight coding
- **Atom** - Hackable text editor (deprecated but supported)
- **Brackets** - Web development focused
- **Nova** - Modern macOS text editor

### 🖥️ **Classic Editors**

- **Vim** - Modal text editing
- **Emacs** - Extensible text editor

### 🔧 **Legacy & Specialized**

- **Delphi/RAD Studio** - Pascal development (`.pas`, `.dpr`, `.dpk` files)
- **Lazarus** - Free Pascal IDE (`.pas`, `.pp`, `.lpr`, `.lfm` files)
- **Octave** - MATLAB alternative
- **RustRover** - JetBrains Rust IDE

---

## ⚙️ **Configuration**

### Settings Overview

Access settings via `File → Preferences → Settings` and search for "OYI" or "Open in your IDE":

#### 🎯 **Enabled IDEs**

```json
"openInIDE.enabledIDEs": [
    "visualstudio",
    "rider", 
    "clion",
    "xcode"
]
```

**Controls which IDEs appear in the context menu.**

#### 🎯 **Default IDE**

```json
"openInIDE.defaultIDE": "visualstudio"
```

**Sets the primary IDE for quick access.**

#### 📁 **Custom IDE Paths**

```json
"openInIDE.customIDEPaths": {
    "visualstudio": "C:\\Custom\\Path\\devenv.exe",
    "rider": "/Applications/JetBrains Toolbox/apps/Rider/ch-0/223.8617.56/Rider.app"
}
```

**Override default detection with custom installation paths.**

#### 🛡️ **Workspace Isolation Settings**

```json
"openInIDE.workspaceIsolation": {
    "enabled": true,
    "useNewInstance": true,
    "preventStartupConflicts": true,
    "enhancedMode": true
}
```

**Advanced workspace isolation to prevent conflicts between VS Code and other IDEs.**

#### 🎯 **Visual Studio Specific Options**

```json
"openInIDE.visualStudioOptions": {
    "useNewInstance": true,
    "preventStartupConflicts": true,
    "isolateWorkspace": true
}
```

**Specialized options for Visual Studio to ensure optimal integration.**

### 🔧 **Advanced Configuration Examples**

#### **Minimal Setup** (Only Visual Studio & Rider)

```json
{
    "openInIDE.enabledIDEs": ["visualstudio", "rider"],
    "openInIDE.defaultIDE": "visualstudio"
}
```

#### **Full Development Setup** (All Major IDEs)

```json
{
    "openInIDE.enabledIDEs": [
        "visualstudio", "rider", "clion", "xcode",
        "intellij", "webstorm", "pycharm", "androidstudio",
        "eclipse", "netbeans", "qtcreator", "arduino"
    ],
    "openInIDE.defaultIDE": "rider"
}
```

#### **Specialized Embedded Development**

```json
{
    "openInIDE.enabledIDEs": [
        "stm32cubeide", "mplabx", "keil", "iar", 
        "arduino", "ccs", "qtcreator"
    ],
    "openInIDE.defaultIDE": "stm32cubeide",
    "openInIDE.customIDEPaths": {
        "stm32cubeide": "C:\\ST\\STM32CubeIDE_1.14.0\\STM32CubeIDE\\stm32cubeide.exe",
        "keil": "C:\\Keil_v5\\UV4\\UV4.exe"
    }
}
```

---

## 🔍 **Intelligent IDE Detection**

### **Automatic Detection Capabilities**

The extension employs sophisticated detection algorithms:

- **Registry Scanning** (Windows): Reads Windows Registry for installed IDEs
- **File System Scanning**: Checks standard installation directories across platforms
- **JetBrains Toolbox Support**: Automatically detects IDEs installed via JetBrains Toolbox
- **Version-Aware Detection**: Supports multiple versions of the same IDE simultaneously
- **Fallback Mechanisms**: Multiple detection strategies ensure maximum compatibility

### **Platform-Specific Detection**

| Platform | Detection Methods | Typical Paths |
|----------|-------------------|---------------|
| **Windows** | Registry, Program Files, AppData | `C:\Program Files\`, `%LOCALAPPDATA%\` |
| **macOS** | Applications folder, user directories | `/Applications/`, `~/Library/Application Support/` |
| **Linux** | Standard paths, user installations | `/opt/`, `/usr/bin/`, `~/` |

### **Supported Installation Methods**

- ✅ **Standard Installers**: Official installers from IDE vendors
- ✅ **Package Managers**: Chocolatey, Homebrew, APT, YUM, etc.
- ✅ **Portable Installations**: Custom and portable IDE installations
- ✅ **Toolbox Managers**: JetBrains Toolbox, Microsoft installers
- ✅ **Development Builds**: Preview and beta versions

---

## 🛡️ **Workspace Isolation Technology**

### **Advanced Conflict Prevention**

OYI implements sophisticated workspace isolation to ensure seamless coexistence:

#### **Universal Isolation Features**

- **Process Isolation**: Each IDE runs in its own isolated process space
- **Workspace Separation**: Prevents file locking conflicts between VS Code and other IDEs
- **Smart Conflict Detection**: Automatically detects and resolves potential conflicts
- **Enhanced Multi-IDE Workflows**: Switch between IDEs without closing projects

#### **Technical Implementation**

- **Startup Parameter Optimization**: Uses IDE-specific startup flags for optimal isolation
- **Timeout Management**: Configurable timeouts prevent hanging operations
- **Fallback Mechanisms**: Alternative launching methods when primary approaches fail
- **Cross-Platform Compatibility**: Platform-specific optimizations for Windows, macOS, and Linux

#### **Configuration Options**

```json
{
    "openInIDE.workspaceIsolation": {
        "enabled": true,              // Enable global workspace isolation
        "useNewInstance": true,       // Launch IDEs in new instances
        "preventStartupConflicts": true, // Use startup conflict prevention
        "enhancedMode": true          // Enable advanced isolation features
    }
}
```

---

## 🎯 **File Type Intelligence**

The extension automatically suggests the most appropriate IDE based on file type:

| File Extension | Suggested IDEs | Use Case |
|---|---|---|
| `.sln`, `.csproj` | Visual Studio, Rider | .NET Development |
| `.java`, `.kt` | IntelliJ IDEA, Android Studio, Eclipse | Java/Kotlin Development |
| `.py` | PyCharm, Spyder, Wing Pro | Python Development |
| `.js`, `.ts`, `.html` | WebStorm, Brackets, Sublime Text | Web Development |
| `.xcodeproj`, `.xcworkspace` | Xcode | iOS/macOS Development |
| `.pro` | Qt Creator | Qt/C++ Development |
| `.ino`, `.pde` | Arduino IDE, Processing | Hardware/Creative Coding |
| `.R` | RStudio | Data Science |
| `.m` | MATLAB, Octave | Mathematical Computing |
| `.pas` | Delphi, Lazarus | Pascal Development |
| `.rs` | Rider (with Rust plugin), CLion | Rust Development |

---

## 🌍 **Multi-Language Support**

The extension supports internationalization with built-in translations for multiple languages and regional variants:

- 🇺🇸 **English** (Default)
- 🇧🇷 **Portuguese (Brazil)**
- 🇪🇸 **Spanish**
- 🇫🇷 **French**
- 🇩🇪 **German**
- 🇮🇹 **Italian**
- 🇨🇳 **Chinese (Simplified)**
- 🇯🇵 **Japanese**
- 🇰🇷 **Korean**
- 🇷🇺 **Russian**
- 🇳🇱 **Dutch**
- And many more regional variants

*Continue contributing translations on [GitHub](https://github.com/OrvexaDev/OYI) to expand language support!*

---

## 🛠️ **Troubleshooting**

### Common Issues

#### **IDE Not Detected**

1. Ensure the IDE is properly installed
2. Check if it's in the default installation directory
3. Use custom path configuration if installed in non-standard location

#### **Context Menu Not Appearing**

1. Verify the file extension is supported
2. Check that the IDE is enabled in settings
3. Restart VS Code after configuration changes

#### **IDE Opens but Wrong Project**

1. Right-click on the specific solution/project file
2. For folders, ensure it contains recognizable project files
3. Configure default IDE in settings

### Getting Help

- 📋 [Report Issues](https://github.com/OrvexaDev/OYI/issues)

---

## 🤝 **Contributing**

We welcome contributions from the community! **OYI - Open in your IDE** is open-source and maintained by **Orvexa by KAGEYOSHI**.

### 🚀 **Quick Start for Contributors**

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/OYI.git`
3. **Install** dependencies: `npm install`
4. **Start** development: `npm run watch`
5. **Make** your changes
6. **Test** thoroughly
7. **Submit** a pull request

### 📋 **How to Contribute**

- 🐛 **Report Bugs**: Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml)
- ✨ **Request Features**: Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml)
- 🔧 **Submit Code**: Follow our [contributing guidelines](CONTRIBUTING.md)
- � **Add Translations**: Help with [localization](LOCALIZATION.md)
- � **Improve Docs**: Documentation improvements are always welcome

### 🛡️ **Important Guidelines**

- **Code of Conduct**: Please read our [Code of Conduct](CODE_OF_CONDUCT.md)
- **Trademark Policy**: Respect our [trademark guidelines](TRADEMARK.md)
- **Security**: Report vulnerabilities via our [security policy](SECURITY.md)

### 🏆 **Recognition**

Contributors are recognized in our project documentation. Significant contributors may be featured in the README.

---

## 🧪 **Development & Testing**

### **Cross-Platform Compatibility**

This extension is thoroughly tested across multiple platforms and CI environments:

- ✅ **Windows** (Windows Server 2019, 2022)
- ✅ **macOS** (macOS 11, 12, 13, 14)
- ✅ **Linux** (Ubuntu 20.04, 22.04, 24.04)

### **CI/CD Pipeline**

Our comprehensive CI/CD pipeline ensures quality:

- 🔍 **Code Quality**: ESLint, TypeScript type checking
- 🧪 **Testing**: Automated tests across Node.js 18, 20, 22
- 🛡️ **Security**: npm audit, CodeQL analysis
- 📦 **Building**: Automated packaging and validation
- 🌍 **Cross-Platform**: Testing on Windows, macOS, and Linux

### **Testing in Development**

For development and testing:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run with Linux environment simulation
chmod +x test-linux.sh
./test-linux.sh

# Lint code
npm run lint

# Build extension
npm run package
```

---

## 📜 **License**

This project is licensed under the **MIT License with Trademark Protection** - see the [LICENSE](LICENSE) file for details.

**Important**: While the code is open-source, the names "Orvexa", "KAGEYOSHI", and "Orvexa by KAGEYOSHI" are protected trademarks.

---

## 🙏 **Acknowledgments**

### 🏆 **Special Thanks**

- **Microsoft**: For the amazing VS Code platform
- **JetBrains**: For their excellent IDE ecosystem
- **Community**: For feedback and contributions
- **Open Source Contributors**: For making this project better

### 🤝 **Community**

- **GitHub**: [https://github.com/OrvexaDev/OYI](https://github.com/OrvexaDev/OYI)
- **Issues**: [Report bugs and request features](https://github.com/OrvexaDev/OYI/issues)

---

**⭐ If this extension helps your workflow, please star it on [GitHub](https://github.com/OrvexaDev/OYI)!**

**Made with ❤️ by [Orvexa by KAGEYOSHI](https://github.com/OrvexaDev)**

[🏠 Homepage](https://github.com/OrvexaDev/OYI) • [🐛 Issues](https://github.com/OrvexaDev/OYI/issues)
