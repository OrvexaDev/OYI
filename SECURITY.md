# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | ✅ Yes             |
| 1.x.x   | ❌ No              |

## Security Features

### Built-in Security Measures

**OYI - Open in your IDE** extension includes several security measures to protect users:

1. **Path Sanitization**: All file paths and IDE paths are sanitized to prevent command injection attacks
2. **Input Validation**: Strict validation of all user inputs and configuration parameters  
3. **Command Execution Safety**: Safe command execution with timeouts and proper error handling
4. **Directory Traversal Protection**: Prevention of "../" directory traversal attacks
5. **Command Injection Prevention**: Sanitization of dangerous characters and patterns
6. **Environment Variable Validation**: Safe handling of environment variable expansion

### Security Validations

- **File Path Validation**: Checks for null bytes, dangerous patterns, and malicious content
- **IDE Path Verification**: Validates IDE executable paths before execution
- **Command Parameter Escaping**: Proper escaping of command line parameters
- **Timeout Protection**: All command executions have reasonable timeouts
- **Error Boundary Handling**: Graceful handling of security-related errors

## Reporting a Vulnerability

**Orvexa by KAGEYOSHI** takes security seriously. If you discover a security vulnerability in the OYI - Open in your IDE extension, please help us resolve it responsibly.

### 🚨 Immediate Action Required

If you find a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. **DO NOT** discuss the vulnerability publicly
3. **DO** report it privately using one of the methods below

### 📧 How to Report

**Primary Contact:**
- Email: orvexa.support@kageyoshi.com
- Subject: "Security Vulnerability - OYI Extension"

**Alternative Contact:**
- Create a private security advisory on GitHub
- Use GitHub's private vulnerability reporting feature

### 📝 What to Include

Please provide the following information:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** and severity assessment
4. **Affected versions**
5. **Your contact information** for follow-up
6. **Any proof-of-concept** code (if applicable)

### 🔄 Response Process

1. **Acknowledgment**: We will acknowledge receipt within 24 hours
2. **Initial Assessment**: We will provide an initial assessment within 48 hours
3. **Investigation**: We will investigate and work on a fix
4. **Resolution**: We will develop and test a security patch
5. **Disclosure**: We will coordinate public disclosure with you

### ⏱️ Response Timeline

- **24 hours**: Acknowledgment of the report
- **48 hours**: Initial assessment and severity classification
- **7 days**: Regular updates on investigation progress
- **30 days**: Target for patch release (may vary based on complexity)

### 🏆 Recognition

We believe in recognizing security researchers who help us improve our software:

- **Hall of Fame**: Security researchers will be acknowledged (with permission)
- **Credit**: You will be credited in release notes and security advisories
- **Coordination**: We will coordinate with you on public disclosure timing

### 🛡️ Security Measures

Our security practices include:

- **Regular Security Reviews**: Code reviews with security focus
- **Dependency Scanning**: Regular updates and vulnerability scanning
- **Secure Development**: Following secure coding practices
- **Access Control**: Strict access controls for sensitive operations

### 🚫 Out of Scope

The following are generally considered out of scope:

- **Social engineering** attacks
- **Physical access** to user machines
- **Denial of service** attacks on third-party services
- **Issues** requiring unusual user configurations
- **Vulnerabilities** in third-party IDEs or software

### 📋 Severity Guidelines

We use the following severity classification:

#### 🔴 Critical
- Remote code execution
- Privilege escalation
- Data exfiltration

#### 🟠 High
- Local file access outside project scope
- Sensitive information disclosure
- Authentication bypass

#### 🟡 Medium
- Cross-site scripting (if applicable)
- Information disclosure
- Denial of service

#### 🟢 Low
- Minor information leaks
- Configuration issues
- Non-security bugs

### 🤝 Responsible Disclosure

We follow responsible disclosure practices:

1. **Private Reporting**: Initial report remains private
2. **Coordinated Fix**: We work together on timeline
3. **Public Disclosure**: After fix is released and users have time to update
4. **Credit Given**: Security researcher receives appropriate credit

### 📞 Emergency Contact

For urgent security matters requiring immediate attention:

- **Primary**: orvexa.support@kageyoshi.com
- **Backup**: Use GitHub's security advisory feature
- **Phone**: Available upon request for critical issues

### 🔐 PGP Key

For encrypted communications, our PGP key is available upon request.

### 📚 Additional Resources

- [OWASP Security Guidelines](https://owasp.org/)
- [Microsoft Security Development Lifecycle](https://www.microsoft.com/en-us/securityengineering/sdl/)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)

---

**Thank you for helping keep OYI - Open in your IDE and our users safe!**

*This security policy is maintained by **Orvexa by KAGEYOSHI** and may be updated periodically.*
