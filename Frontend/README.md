# Personal Finance Tracker

A React 19 + TypeScript application built with Create React App and Tailwind CSS.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

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

4. Copy the environment variables:

   ```bash
   cp env.example .env
   ```

5. Update the `.env` file with your configuration:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_ENV=development
   ```

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
- Axios
- React Query
- React Hook Form
- Zod
- Chart.js
- React Window
- Classnames
