# Employee Communications Platform

The Employee Communications Platform is a modern, real-time application designed to streamline critical information sharing within an organization. It provides a centralized dashboard for employees to receive and manage notifications, ensuring timely awareness of urgent alerts, operational changes, and important announcements.

## Key Features

- **Real-Time Notifications:** Leverages Firebase Cloud Messaging (FCM) to deliver instant push notifications directly to the user's dashboard.
- **Interactive Notification Modal:** New notifications appear in a modal, ensuring immediate user attention.
- **Dynamic "Recent Activity" Feed:** A redesigned, visually appealing feed that displays a history of all notifications.
- **Rich Notification Types:** Supports various notification levels, including:
  - **Critical Alerts:** For urgent actions like product recalls, with detailed information and interactive checklists.
  - **High-Importance Alerts:** For critical FYI messages like travel disruptions, highlighted with icons and distinct styling.
  - **Escalation Status:** Displays when an un-actioned notification has been escalated, including the manager's name and a live 24-hour countdown timer.
- **Customizable Preferences:** Users can manage their notification settings for different channels.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Push Notifications:** [Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging)
- **Package Manager:** [pnpm](https://pnpm.io/)

## Environment Setup

To run this application, you need to configure your Firebase environment variables. Create a `.env.local` file in the project root and add your Firebase project credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="YOUR_FIREBASE_VAPID_KEY"

# For server-side operations (e.g., sending notifications via API)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email@your-project.iam.gserviceaccount.com"
```

**Note:** For production environments, it is strongly recommended to use a secret management service (like Vercel Environment Variables, AWS Secrets Manager, or Google Secret Manager) instead of a `.env.local` file.

## Getting Started

### 1. Install Dependencies

Use `pnpm` to install the project dependencies:

```bash
pnpm install
```

### 2. Run the Development Server

Start the development server to run the application locally:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production-ready build of the application, run:

```bash
pnpm build
```

To start the production server, use:

```bash
pnpm start
```