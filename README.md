# Nexum Frontend

Nexum is a web application for tracking and managing job applications — a modern, organized alternative to keeping everything in a spreadsheet. It helps users log applications, sort and search them easily, and (soon) visualize progress with charts and reminders for interviews.

This repository contains the **frontend** for Nexum, built with **Next.js**, **TypeScript**, and **Radix UI**.

## 🚀 Features

- 📋 Track and manage job applications efficiently
- 🔍 Search and sort applications by various criteria
- 📊 (Upcoming) Charts and analytics for:
  - Applications sent
  - Rejections
  - Scheduled interviews
- 🔔 (Upcoming) Notification and reminder system for interviews
- 🧩 Modern, responsive UI built with Radix UI and TypeScript

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [Radix UI](https://www.radix-ui.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)

## ⚙️ Prerequisites

Before you begin, make sure you have installed:

- **Node.js** (v18 or later)
- **pnpm** (v8 or later)

You’ll also need the **Nexum backend** running locally to provide API data.

## 🧠 Running Nexum Locally (Frontend + Backend)

Follow these steps to run the full application locally:

### 1. Clone Both Repositories

```bash
# Backend
git clone https://github.com/yourusername/nexum-backend.git

# Frontend
git clone https://github.com/yourusername/nexum-frontend.git
```

### 2. Start the Backend

In one terminal:

```bash
cd nexum-backend
pnpm install
pnpm run dev
```

The backend will start on http://localhost:5000

### 3. Start the Frontend

In another terminal:

```bash
cd nexum-frontend
pnpm install
pnpm run dev
```

The frontend will start on http://localhost:3000

### 4. Open the App

Visit 👉 http://localhost:3000
The frontend automatically connects to the backend running on port 5000.
