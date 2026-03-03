# Sentry 🛡️

**Sentry** is a local-first, zero-knowledge credential manager designed for users who prioritize privacy and security above all else. Unlike traditional password managers that store your sensitive data in the cloud, Sentry ensures your information never leaves your system.

---

## 🛑 The Problem
Most modern password managers rely on centralized cloud storage. This approach introduces several critical vulnerabilities:
1. **Centralized Breaches:** A single hack on a provider's server can expose millions of users' encrypted vaults.
2. **Privacy Risks:** Users are forced to trust that service providers cannot access their data or track their usage patterns.
3. **Internet Dependency:** Accessing or syncing your credentials often requires an active internet connection.
4. **Subscription Models:** Privacy is frequently locked behind monthly fees.

## ✅ The Sentry Solution
Sentry shifts the power back to the user. It is a completely offline, browser-based utility that acts as a secure interface for your locally stored credentials.

### Key Benefits:
- **Zero Network Footprint:** Sentry makes **no network calls**. Your data stays within your system's boundary at all times.
- **Complete Privacy:** Since there is no database or cloud backend, no third party (including the developers) can ever see your passwords.
- **Military-Grade Encryption:** Credentials are encrypted using **AES-256** (via CryptoJS) and master passwords are protected with **BCrypt** hashing.
- **User-Owned Data:** Your "vault" is a simple JSON file. You have total control over where it is stored, how it is backed up, and how it is moved.
- **Bulk Import:** Transitioning is easy—import your existing credentials directly from Excel (`.xlsx`) files.

---

## ⚙️ How It Works

Sentry follows a **Zero-Knowledge Architecture**:

1. **Registration:** When you first set up Sentry, you provide a username and a strong master password. 
2. **Key Derivation:** Sentry generates a unique symmetric encryption key derived from your master credentials. This key is never stored; it is re-calculated in memory every time you log in.
3. **Encryption:** Every credential you add is encrypted with this symmetric key before being written to your local JSON vault.
4. **Source of Truth:** Your local JSON file is the only place your data exists. To access it, you simply upload the file to the Sentry interface and provide your master password.
5. **Session Security:** All decryptions happen locally in your browser's memory and are cleared when you close the application.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/hrithik086/Sentry.git
   cd sentry/Sentry
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:4200`.

---

## 🛠️ Tech Stack
- **Framework:** [Angular](https://angular.io/) 21
- **Encryption:** [CryptoJS](https://cryptojs.gitbook.io/docs/) (AES-256)
- **Hashing:** [BCryptJS](https://github.com/dcodeIO/bcrypt.js)
- **UI Components:** [Angular Material](https://material.angular.io/)
- **Excel Processing:** [XLSX](https://github.com/SheetJS/sheetjs)

---

## ⚠️ Important Note
**Sentry is built on the principle of absolute user responsibility.** Since your data is not stored in any cloud, there is **no "Forgot Password" feature**. If you lose your master password or delete your JSON vault file without a backup, your credentials will be permanently irrecoverable. 

**Always keep a secure backup of your vault file!**

## [Github pages Link](https://hrithik086.github.io/Pages_Sentry/#/Login)
https://hrithik086.github.io/Pages_Sentry/#/Login
