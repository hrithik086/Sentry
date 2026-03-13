# Sentry - Frontend Application

This directory contains the Angular-based frontend for **Sentry**, a local-first, zero-knowledge credential manager.

## Quick Start
1. Ensure you have latest [Node.js](https://nodejs.org/) 24 installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Access the app at `http://localhost:4200`.

## Key Commands
- `npm run build`: Build the project for production.

---

## Build and run docker images
1. Open terminal in the Sentry path(exactly this path where we have this file).
2. docker build -t sentry:v1
3. docker run -p 8080:80 sentry:v1

## Run image directly by fetching from docker hub
1. Pull The image - docker pull hrithik086/sentry:v1
2. Start container - docker run -p 8080:80 hrithik086/sentry:v1

For detailed information about the project's architecture, security features, and problem statement, please refer to the [main README](../Readme.md) in the project root.
