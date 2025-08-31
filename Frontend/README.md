# Personal Finance Tracker

A React 19 + TypeScript application built with Create React App and Tailwind CSS.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

## Installation

1. Clone the repository
2. Navigate to the project directory:

   ```bash
   cd Frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create environment configuration:

   Create a `.env` file in the Frontend directory with the following content:

   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

   **Important:** Make sure your backend server is running on port 5000 before starting the frontend.

5. Start the development server:

   ```bash
   npm start
   ```

## Backend Integration

This frontend is designed to work with a Node.js + Express + PostgreSQL backend. The following API endpoints are expected:

### Authentication (Public Routes)

- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### User Management (Protected Routes)

- `GET /users/profile/me` - Get current user profile
- `PUT /users/profile/me` - Update current user profile

### Required Backend Features

- JWT token-based authentication
- Role-based access control (admin, user, read-only)
- PostgreSQL database with user management tables

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App
- `npm run lint` - Runs ESLint on the source code

## Development

To start the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

**Note:** Make sure your backend server is running on `http://localhost:5000` before testing authentication features.

## Build

To create a production build:

```bash
npm run build
```

The build files will be created in the `build` folder.

## Technologies Used

- React 19
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios (with interceptors for auth)
- React Query (TanStack Query)
- React Hook Form
- Yup validation
- Chart.js
- React Window
- Classnames

## Features

- 🔐 User authentication (login/register)
- 👤 User profile management
- 📊 Financial dashboard with charts
- 💰 Transaction management
- 🏷️ Category management
- 👥 User management (admin only)
- 🌙 Dark/Light theme support
- 📱 Responsive design
- 🔔 Toast notifications
- 🛡️ Role-based access control
