# OYI Extension Localization

## How to Use

### Generate files manually

```bash
npm run generate:package-nls
```

### Add new translation

1. Add the file `l10n/bundle.l10n.{locale}.json`
2. Run `npm run generate:package-nls`
3. The file `package.nls.{locale}.json` will be created automatically

### Supported strings in package.json

- `extension.displayName` - Extension name
- `extension.description` - Extension description  
- `command.openInIDE.title` - Command title
- `configuration.title` - Configuration titled

The extension was showing `%extension.displayName%` and `%extension.description%` on the VS Code extensions page instead of the translated texts.

## Solution Implemented

### 1. `package.nls.*` Files

VS Code requires `package.nls.json` files in the project root to resolve localization strings in the manifest (`package.json`). We created:

- `package.nls.json` - Default language (English)
- `package.nls.pt-BR.json` - Brazilian Portuguese  
- `package.nls.es-ES.json` - Spanish
- `package.nls.fr-FR.json` - French
- And 25 other languages...

### 2. Automated Script

We created the script `scripts/create-package-nls.js` that:

- Reads files from the `l10n/` folder
- Extracts only the necessary keys for `package.json`
- Automatically generates all `package.nls.*` files

### 3. Build Integration

- Added command `npm run generate:package-nls`
- Integrated into the release process (`scripts/release.js`)
- Files are generated automatically before build

## How to Use

### Generate files manually:
```bash
npm run generate:package-nls
```

### Add new translation:
1. Add the file `l10n/bundle.l10n.{locale}.json`
2. Run `npm run generate:package-nls`
3. The file `package.nls.{locale}.json` will be created automatically

### Supported strings in package.json:

- `extension.displayName` - Extension name
- `extension.description` - Extension description  
- `command.openInIDE.title` - Command title
- `configuration.title` - Configuration title
- `configuration.enabledIDEs.description` - Enabled IDEs list description
- `configuration.customIDEPaths.description` - Custom paths description
- `configuration.defaultIDE.description` - Default IDE description

## File Structure

```text
├── package.json                    # Manifest with %localized% strings
├── package.nls.json               # English strings (default) - Auto-generated
├── package.nls.pt-BR.json         # Portuguese strings - Auto-generated
├── package.nls.es-ES.json         # Spanish strings - Auto-generated
├── nls/                           # Organized package.nls files folder
│   ├── package.nls.json           # Organized version - English
│   ├── package.nls.pt-BR.json     # Organized version - Portuguese
│   └── ...                        # Other organized languages
├── l10n/                          # Complete localization folder
│   ├── bundle.l10n.json           # All strings in English
│   ├── bundle.l10n.pt-BR.json     # All strings in Portuguese
│   └── ...
└── scripts/
    └── create-package-nls.js      # Automatic generation script
```

### File Organization

**Root Files (Auto-generated)**:

- `package.nls*.json` - Required for VS Code Marketplace to show translations
- Generated automatically and ignored by Git
- **DO NOT edit manually** - always use the generation script

**Files in `nls/` Folder**:

- Organized versions of the same files
- Committed to Git for versioning
- Facilitate development and maintenance

## Result

✅ The extension now correctly shows:

- **Name**: "OYI - Abrir no seu IDE" (pt-BR)
- **Description**: "Integração universal de IDEs..." (pt-BR)
- **Name**: "OYI - Open in your IDE" (en)
- **Description**: "Universal IDE integration..." (en)

VS Code automatically detects the user's language and shows the appropriate translation.

## Localization Support

This extension supports internationalization (i18n) for multiple languages and regions.

## Supported Languages

### 🇺🇸 English (US) - en-US
- **Display Name**: OYI - Open in your IDE
- **Default language**

### 🇮🇳 English (India) - en-IN
- **Display Name**: OYI - Open in your IDE

### 🇬🇧 English (UK) - en-GB
- **Display Name**: OYI - Open in your IDE

### 🇨🇦 English (Canada) - en-CA
- **Display Name**: OYI - Open in your IDE

### 🇦🇺 English (Australia) - en-AU
- **Display Name**: OYI - Open in your IDE

### 🇧🇷 Português (Brasil) - pt-BR
- **Display Name**: OYI - Abrir no seu IDE

### 🇵🇹 Português (Portugal) - pt-PT
- **Display Name**: OYI - Abrir no seu IDE

### 🇪🇸 Español (España) - es-ES
- **Display Name**: OYI - Abrir en tu IDE

### 🇲🇽 Español (México) - es-MX
- **Display Name**: OYI - Abrir en tu IDE

### 🇨🇴 Español (Colombia) - es-CO
- **Display Name**: OYI - Abrir en tu IDE

### 🇦🇷 Español (Argentina) - es-AR
- **Display Name**: OYI - Abrir en tu IDE

### 🇵🇪 Español (Perú) - es-PE
- **Display Name**: OYI - Abrir en tu IDE

### 🇫🇷 Français (France) - fr-FR
- **Display Name**: OYI - Ouvrir dans votre IDE

### 🇩🇪 Deutsch (Deutschland) - de-DE
- **Display Name**: OYI - In Ihrer IDE öffnen

### 🇮🇹 Italiano (Italia) - it-IT
- **Display Name**: OYI - Apri nel tuo IDE

### 🇨🇳 中文 (中国) - zh-CN
- **Display Name**: OYI - 在您的IDE中打开

### 🇯🇵 日本語 (日本) - ja-JP
- **Display Name**: OYI - IDEで開く

### 🇰🇷 한국어 (대한민국) - ko-KR
- **Display Name**: OYI - IDE에서 열기

### 🇷🇺 Русский (Россия) - ru-RU
- **Display Name**: OYI - Открыть в вашей IDE

### 🇳🇱 Nederlands (Nederland) - nl-NL
- **Display Name**: OYI - Openen in uw IDE

### 🇮🇩 Bahasa Indonesia - id-ID
- **Display Name**: OYI - Buka di IDE Anda

### 🇵🇭 Filipino (Pilipinas) - fil-PH
- **Display Name**: OYI - Buksan sa inyong IDE

### 🇵🇰 اردو (پاکستان) - ur-PK
- **Display Name**: OYI - اپنے IDE میں کھولیں

### 🇵🇱 Polski (Polska) - pl-PL
- **Display Name**: OYI - Otwórz w swoim IDE

### 🇩🇰 Dansk (Danmark) - da-DK
- **Display Name**: OYI - Åbn i dit IDE

### 🇸🇦 العربية (السعودية) - ar-SA
- **Display Name**: OYI - افتح في بيئة التطوير الخاصة بك

### 🇪🇬 العربية (مصر) - ar-EG
- **Display Name**: OYI - افتح في بيئة التطوير بتاعتك

### 🇹🇭 ไทย (ประเทศไทย) - th-TH
- **Display Name**: OYI - เปิดใน IDE ของคุณ

## How it Works

VS Code automatically detects the user's configured language and loads the corresponding localization file. If the specific language is not available, VS Code will use the default language (English - US).

## File Structure

```text
l10n/
├── bundle.l10n.json          # Default (English US)
├── bundle.l10n.pt-BR.json    # Portuguese Brazil
├── bundle.l10n.pt-PT.json    # Portuguese Portugal
├── bundle.l10n.es-ES.json    # Spanish Spain
├── bundle.l10n.es-MX.json    # Spanish Mexico
├── bundle.l10n.es-CO.json    # Spanish Colombia
├── bundle.l10n.es-AR.json    # Spanish Argentina
├── bundle.l10n.es-PE.json    # Spanish Peru
├── bundle.l10n.fr-FR.json    # French France
├── bundle.l10n.de-DE.json    # German Germany
├── bundle.l10n.it-IT.json    # Italian Italy
├── bundle.l10n.zh-CN.json    # Chinese China
├── bundle.l10n.ja-JP.json    # Japanese Japan
├── bundle.l10n.ko-KR.json    # Korean South Korea
├── bundle.l10n.ru-RU.json    # Russian Russia
├── bundle.l10n.nl-NL.json    # Dutch Netherlands
├── bundle.l10n.id-ID.json    # Indonesian Indonesia
├── bundle.l10n.fil-PH.json   # Filipino Philippines
├── bundle.l10n.ur-PK.json    # Urdu Pakistan
├── bundle.l10n.pl-PL.json    # Polish Poland
├── bundle.l10n.da-DK.json    # Danish Denmark
├── bundle.l10n.ar-SA.json    # Arabic Saudi Arabia
├── bundle.l10n.ar-EG.json    # Arabic Egypt
├── bundle.l10n.th-TH.json    # Thai Thailand
├── bundle.l10n.en-IN.json    # English India
├── bundle.l10n.en-GB.json    # English UK
├── bundle.l10n.en-CA.json    # English Canada
└── bundle.l10n.en-AU.json    # English Australia
```

## Localized Strings

All user-visible strings are localized, including:

- **Extension Display Name**: Extension name in the marketplace
- **Extension Description**: Extension description
- **Command Titles**: Command titles
- **Configuration Properties**: Configuration descriptions
- **Error Messages**: Error messages
- **Success Messages**: Success messages
- **UI Elements**: User interface elements
