# Nexum Frontend

This is the **frontend application** for **Nexum**, a web application that helps users track and manage job applications in one organized place.  
It provides an intuitive and modern user interface for creating, viewing, updating, and analyzing job applications with interactive charts and comprehensive tracking features.

Built with **Next.js**, **React**, **TypeScript**, and **Radix UI**, the frontend features real-time data visualization, responsive design, and seamless API integration.

> **Live Demo:** [https://nexumtracker.com](https://nexumtracker.com)

---

## 🚀 Features

### Core Functionality

- 🧾 **Job Application Management** - Create, view, edit, and delete job applications with detailed tracking
- 🏢 **Company Dashboard** - Organize and manage companies with associated applications
- 📅 **Interview Scheduling** - Track interview dates, times, and outcomes with status indicators
- 📝 **Activity History** - View detailed logs of application status changes and notes
- 🔔 **Smart Reminders** - Set and manage custom reminders with automatic notifications

### User Experience

- 🎨 **Modern UI/UX** - Clean, intuitive interface built with Radix UI components
- 📱 **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- 🔍 **Advanced Search & Filters** - Filter applications by status, priority, favorites, and custom search
- 📄 **Pagination** - Efficient navigation through large datasets
- ⚡ **Real-time Updates** - Instant UI updates with React Query and optimistic updates
- 🎯 **Quick Actions** - Priority flagging, favorites, and bulk operations

### Analytics & Insights

- 📊 **Interactive Data Visualization** - Three chart types with D3.js:
  - 🥧 **Pie Charts** - Application status distribution
  - 📊 **Bar Charts** - Time-based application trends
  - 🔀 **Sankey Diagrams** - Application flow visualization
- 📈 **Custom Filters** - Time-based filtering (week, month, 3 months, year, all-time)
- 🎯 **Dashboard Overview** - Quick stats and upcoming interviews at a glance

### Authentication & Security

- 🔐 **JWT-based Authentication** - Secure login with access and refresh tokens
- 👤 **User Registration** - Sign up with access code protection
- 🔒 **Protected Routes** - Automatic redirect for unauthenticated users
- 🛡️ **Client-side Validation** - Form validation with React Hook Form

### Technical Features

- ⚡ **Server-Side Rendering** - Next.js App Router with SSR support
- 🔄 **Data Caching** - React Query for efficient data fetching and caching
- 🎭 **Form Management** - React Hook Form for optimized form handling
- 🎨 **Sass/SCSS Styling** - Modular styling with mixins and variables
- 📐 **TypeScript** - Full type safety across the application
- 🧩 **Component Library** - Reusable components with Radix UI primitives

---

## 🛠️ Tech Stack

### Frontend Framework & Language

- **[Next.js](https://nextjs.org/)** (v15.5) - React framework with App Router, SSR, and API routes
- **[React](https://react.dev/)** (v19.1) - UI library for building interactive interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript with modern features

### UI & Styling

- **[Radix UI](https://www.radix-ui.com/)** - Accessible, unstyled UI primitives
- **[Sass/SCSS](https://sass-lang.com/)** - Advanced CSS with variables and mixins
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library for smooth transitions

### Data Visualization

- **[D3.js](https://d3js.org/)** - Powerful data visualization library
- **[d3-sankey](https://github.com/d3/d3-sankey)** - Sankey diagram plugin for flow visualization

### State Management & Data Fetching

- **[TanStack React Query](https://tanstack.com/query)** - Powerful async state management
- **[React Hook Form](https://react-hook-form.com/)** - Performant form validation and management

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting and quality checks
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks for pre-commit checks
- **[Commitlint](https://commitlint.js.org/)** - Enforce conventional commit messages
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

---

## ⚙️ Prerequisites

Before starting, make sure you have installed:

- **Node.js** (v20 or later)
- **pnpm** (v9 or later)
- **Nexum Backend** running (see [nexum-backend](https://github.com/zh-deng/nexum-backend))

---

## 🧠 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/zh-deng/nexum-frontend.git
cd nexum-frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

> **Note:** The backend must be running on port 5000. See [nexum-backend](https://github.com/zh-deng/nexum-backend) for setup instructions.

### 4. Start the Backend

Make sure the Nexum backend is running before starting the frontend:

```bash
# In the nexum-backend directory
pnpm run start:dev
```

The backend should be running at **http://localhost:5000**

### 5. Start the Development Server

```bash
pnpm run dev
```

The frontend will be running at:

- 🌐 Application: **http://localhost:3000**

### 6. Build for Production

```bash
pnpm run build
pnpm run start
```

---

## 🎯 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production-ready application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint and auto-fix issues
- `pnpm format` - Format code with Prettier

---

## 🏗️ Key Architecture Highlights

- **Next.js App Router** - Modern routing with layouts and server components
- **React Query Integration** - Efficient data fetching with caching and optimistic updates
- **Custom Hooks** - Reusable hooks for API calls, breakpoints, and debouncing
- **Component-based Architecture** - Modular, reusable components with proper separation
- **Type-safe API Client** - Axios-based client with TypeScript types
- **Responsive Design** - Mobile-first approach with breakpoint utilities
- **Authentication Context** - Global auth state management
- **Form Validation** - React Hook Form with custom validation rules
- **Modular Styling** - SCSS modules with shared variables and mixins

---

## 🔗 Related Projects

- **Backend:** [nexum-backend](https://github.com/zh-deng/nexum-backend) - NestJS + PostgreSQL API
- **Live Application:** [https://nexumtracker.com](https://nexumtracker.com)

---

## 📝 License

This project is licensed under the UNLICENSED license - it is private and not for redistribution.

---

## 👨‍💻 Author

**zh-deng**

- GitHub: [@zh-deng](https://github.com/zh-deng)
