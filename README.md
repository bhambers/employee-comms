# Comms Platform

## Project Overview

The Comms Platform is a modern communications application designed to facilitate efficient and timely notifications and information sharing within an organization. It provides a dashboard for users to view recent activity, manage notification preferences, and access quick links to important resources. The platform leverages push notifications for urgent alerts and offers customizable email notification options.

## Technology Stack

*   **Frontend:** Next.js (React), TypeScript
*   **Styling:** Tailwind CSS
*   **Push Notifications:** Firebase Cloud Messaging (FCM)
*   **Package Manager:** pnpm

## Setup Environment Variables

To run this application locally or deploy it, you need to configure Firebase environment variables. Create a `.env.local` file in the root directory of the project and add the following:

```
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"
GOOGLE_APPLICATION_CREDENTIALS='{"type": "service_account", ...}' # JSON string of your Firebase Admin SDK service account key
```

**Note:** The `GOOGLE_APPLICATION_CREDENTIALS` should be the content of your Firebase Admin SDK service account JSON file, escaped as a single-line string. For production, it's recommended to store this securely (e.g., in a secret manager) and provide it to the environment.

## Installation

To install the project dependencies, use `pnpm`:

```bash
pnpm install
```

## Local Setup

To run the application in development mode:

```bash
pnpm dev
```

The application will be accessible at `http://localhost:3000` (or another port if 3000 is in use).

## Deployment for Production

To build the application for production:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

For actual production deployment, you would typically deploy the built Next.js application to a hosting provider like Vercel, Netlify, or a custom server. Ensure your environment variables are correctly configured in your deployment environment.
