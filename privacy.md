# Privacy Policy

**Lightpaint Live Mercury**
*Last Updated: February 26, 2026*

---

## 1. Introduction

This Privacy Policy describes how Lightpaint Live Mercury ("the App", "Mercury", "we", "our") handles information when you use our desktop application. Lightpaint Live Mercury is an open-source, realtime light painting application for Mac and Windows, developed by Posit Labs.

We are committed to transparency about data practices. This policy explains what data the App accesses, how it is used, and what is stored on your device.

## 2. Summary of Data Practices

Lightpaint Live Mercury is a local desktop application. **We do not collect, transmit, or store any personal data on remote servers.** All data processing occurs locally on your device. The App does not include analytics, tracking, advertising SDKs, or telemetry of any kind.

## 3. Device Permissions and Hardware Access

### 3.1 Camera Access

The App requests access to your device's camera (webcam) to provide its core light painting functionality. Camera access is required to capture the live video feed that the App processes in real time to create light painting effects.

- On macOS, the App uses the system permission dialog (NSCameraUsageDescription) to request camera access.
- Video from your camera is processed entirely in local memory using WebGL shaders. No camera data is transmitted over the network or stored remotely.
- You may deny camera access, though the App's core functionality requires it. You can also use a local video file as an alternative input source.

### 3.2 File System Access

The App reads and writes files to your local file system in the following scenarios:

- Saving snapshots (PNG images) to your chosen save directory or your system's default Downloads folder.
- Saving recorded video (WebM format) to your chosen save directory or your system's default Downloads folder.
- Loading local video files that you select as an alternative camera input source.

The App does not access files beyond what is necessary for these features, and no file data is transmitted externally.

## 4. Local Data Storage

The App uses your browser's localStorage (within the Electron runtime) to persist your preferences between sessions. The following settings are stored locally on your device:

- Save directory path
- Selected camera
- Resolution, opacity, decay, ghost, and mirror settings
- Video recording and auto-snapshot preferences
- Video file path, loop setting, and trigger control preferences

This data never leaves your device and can be cleared by resetting the application or clearing the App's local storage data.

## 5. Network Communications

The App makes limited network connections as described below. No personal data or usage analytics are transmitted.

### 5.1 Update Checks

On launch, the App contacts the GitHub API (api.github.com) to check whether a newer version of the App is available. This request includes:

- A User-Agent header identifying the App ("lightpaintlive").
- No personal information, device identifiers, or usage data is included in this request.

If an update is available and you choose to download it, the App downloads the installer file from GitHub Releases to your Downloads folder.

### 5.2 Local Network Remote Controls (Optional)

The App includes an optional feature to control the application from another device (such as a phone) on the same local network. When activated, this feature:

- Starts a local HTTP/WebSocket server on port 3333 using your device's local IP address.
- Serves a remote controls web page accessible only on your local network.
- Transmits only application control settings (such as opacity, decay, and trigger actions) over this local connection.
- Does not expose any personal data, camera feed, or saved files over this connection.

This feature is not active by default and requires user initiation. The server is only accessible from devices on your local network.

### 5.3 External Links

The App contains links to external websites (lightpaintlive.com, GitHub, PayPal for donations, and GitHub Sponsors). Clicking these links opens them in your system's default web browser. These external sites have their own privacy policies, and we encourage you to review them.

## 6. What We Do NOT Collect

For clarity, the App does not collect or process any of the following:

- Personal information (name, email, address, phone number)
- Device identifiers or fingerprints
- Usage analytics or telemetry
- Crash reports
- Location data
- Cookies (the App is a desktop application and does not use web cookies)
- Camera footage or recordings (all processing is local and user-initiated saves go only to your local file system)
- Any data for advertising purposes

## 7. Third-Party Services

The App interacts with the following third-party services in limited capacity:

**GitHub API:** Used solely to check for application updates. Subject to [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

No other third-party services, SDKs, or analytics platforms are integrated into the App.

## 8. Open Source Transparency

Lightpaint Live Mercury is open-source software. The complete source code is publicly available at [https://github.com/positlabs/lightpaintlive](https://github.com/positlabs/lightpaintlive), allowing anyone to verify the data practices described in this policy.

## 9. Children's Privacy

The App does not knowingly collect any personal information from anyone, including children under the age of 13 (or the applicable age of consent in your jurisdiction). Since the App does not collect personal data, no special provisions for children's data are necessary.

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. Any changes will be reflected in the "Last Updated" date at the top of this document. As the App is open source, changes to data practices will also be visible in the source code repository.

## 11. Contact

If you have questions or concerns about this Privacy Policy or the App's data practices, you can:

- Open an issue on the GitHub repository: [https://github.com/positlabs/lightpaintlive/issues](https://github.com/positlabs/lightpaintlive/issues)
- Visit the project website: [https://lightpaintlive.com](https://lightpaintlive.com)

---

*© Posit Labs. This document was last updated on February 26, 2026.*
