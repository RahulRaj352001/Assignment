# Personal Finance Tracker

A modern, full-featured personal finance management application built with React 19, TypeScript, and Tailwind CSS. This application helps users track their income, expenses, manage categories, and gain insights through comprehensive analytics and charts.

## 🚀 Features

- **🔐 Authentication & Authorization**

  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin, User, Read-only)
  - Protected routes and guards

- **💰 Financial Management**

  - Transaction tracking (income/expense)
  - Category management
  - Budget planning and monitoring
  - Financial goal setting

- **📊 Analytics & Insights**

  - Interactive charts and graphs
  - Monthly spending analysis
  - Category-wise breakdown
  - Income vs. expense trends
  - Financial health indicators

- **👥 User Management**

  - User profile management
  - Admin user management panel
  - Role-based permissions

- **🎨 User Experience**
  - Dark/Light theme support
  - Responsive design for all devices
  - Toast notifications
  - Modern, intuitive interface
  - Optimized performance with React Window

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form management with validation
- **Yup/Zod** - Schema validation
- **Chart.js + React-Chartjs-2** - Data visualization
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client with interceptors
- **React Window** - Virtualized lists for performance

### Development Tools

- **Create React App** - Build toolchain
- **PostCSS** - CSS processing
- **ESLint** - Code linting
- **Jest + Testing Library** - Testing framework

## 📋 Prerequisites

- **Node.js** - Version 18 or higher (LTS recommended)
- **npm** or **yarn** package manager
- **Backend server** running on `http://localhost:5000`
- **Modern browser** with ES6+ support

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Assignment/Frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the Frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

**⚠️ Important:** Ensure your backend server is running on port 5000 before starting the frontend.

### 4. Start Development Server

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── categories/   # Category management
│   │   ├── charts/       # Chart components
│   │   ├── layout/       # Layout components
│   │   ├── transactions/ # Transaction management
│   │   ├── users/        # User management
│   │   └── ui/           # Common UI elements
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── routes/           # Routing configuration
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── validation/       # Validation schemas
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Available Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm start`     | Runs the app in development mode |
| `npm run build` | Builds the app for production    |
| `npm test`      | Launches the test runner         |
| `npm run lint`  | Runs ESLint for code quality     |
| `npm run eject` | Ejects from Create React App     |

## 🌐 Backend Integration

This frontend is designed to work with a Node.js + Express + PostgreSQL backend. The application expects the following API structure:

### Authentication Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Core API Endpoints

- **Users**: `/users/*` - User management and profiles
- **Transactions**: `/transactions/*` - Financial transaction CRUD
- **Categories**: `/categories/*` - Category management
- **Analytics**: `/analytics/*` - Financial insights and reports

### Required Backend Features

- JWT token-based authentication
- Role-based access control (RBAC)
- PostgreSQL database with proper schemas
- Rate limiting and security middleware
- Input validation and sanitization

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## 📦 Building for Production

Create an optimized production build:

```bash
npm run build
```

The build files will be created in the `build/` folder, ready for deployment.

## 🚀 Deployment

### Build the Application

```bash
npm run build
```

### Deploy Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Cloud Storage**: AWS S3, Google Cloud Storage
- **CDN**: Cloudflare, AWS CloudFront

### Environment Variables for Production

```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages
- Add tests for new features
- Follow the existing code style

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security Features

- JWT token authentication
- Role-based access control
- Protected API endpoints
- Input validation and sanitization
- Secure HTTP headers
- CORS configuration

## 📊 Performance Features

- React 19 concurrent features
- Virtualized lists with React Window
- Optimized bundle splitting
- Lazy loading of components
- Efficient state management
- Optimized re-renders

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use:**

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm start
```

**Backend connection issues:**

- Verify backend server is running on port 5000
- Check `.env` file configuration
- Ensure CORS is properly configured on backend

**Build errors:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Chart.js for data visualization capabilities
- All contributors and maintainers

---

**Happy coding! 🎉**

For support or questions, please open an issue in the repository.
