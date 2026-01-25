# OSSBeat - Open Source Repository Discovery Platform

OSSBeat is an open-source repository discovery platform that helps developers find suitable GitHub repositories based on their skills and interests. The platform integrates with GitHub to provide seamless repository discovery and user authentication.

## ✨ Features

### 🚀 Current Features

- 🔍 **Repository Discovery**: Search and discover GitHub repositories with advanced filtering by language, stars, topics, and more
- 👥 **GitHub Integration**: Seamless OAuth authentication with GitHub
- 🌙 **Dark Mode**: Modern UI with theme switching capabilities
- 📱 **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

### 🎯 Upcoming Features

- 📊 **Contribution Tracking**: Monitor your open-source contributions and statistics
- 🎯 **Personalized Recommendations**: AI-powered repository suggestions based on your profile
- 📈 **Progress Analytics**: Visualize your open-source journey and growth
- 🏆 **GSoC Preparation**: Get expert mentorship and guidance for Google Summer of Code
- 🎃 **Hacktoberfest Support**: Dedicated tools and tracking for Hacktoberfest participation
- 🐛 **Issues Management**: Track and manage GitHub issues across repositories

## 🏗️ Architecture

OSSBeat follows a modern monorepo architecture using Turborepo:

```
ossbeat/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── backend/      # Express.js API server
├── packages/
│   ├── database/     # Prisma database client & migrations
│   ├── ui/           # Shared React components
│   ├── eslint-config/# ESLint configurations
│   └── typescript-config/ # TypeScript configurations
└── turbo.json        # Turborepo configuration
```

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js Web   │    │  Express API    │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│                 │    │                 │    │                 │
│ - React 19      │    │ - TypeScript    │    │ - Prisma ORM    │
│ - Tailwind CSS  │    │ - JWT Auth      │    │ - User data     │
│ - Theme support │    │ - GitHub OAuth  │    │ - Repositories  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   GitHub API    │
                    │                 │
                    │ - OAuth         │
                    │ - Repository data│
                    │ - User profiles │
                    └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **pnpm** package manager ([Install here](https://pnpm.io/installation))
- **PostgreSQL** database ([Download here](https://www.postgresql.org/download/))
- **GitHub OAuth App** ([Create here](https://github.com/settings/applications/new))

### Environment Variables

Create the following environment files:

#### Root `.env`

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ossbeat"
```

#### Backend `.env` (apps/backend/.env)

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ossbeat"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GITHUB_REDIRECT_URI="http://localhost:4000/auth/github/callback"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

#### Frontend `.env.local` (apps/web/.env.local)

```bash
# API URL
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Shailesh2302/OSSBeat.git
   cd OSSBeat
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up the database**

   ```bash
   # Generate Prisma client
   pnpm db:generate

   # Run migrations
   pnpm db:migrate
   ```

4. **Start development servers**

   ```bash
   # Start all services
   pnpm dev

   # Or start individually:
   pnpm --filter web dev      # Frontend on http://localhost:3000
   pnpm --filter backend dev  # Backend on http://localhost:4000
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 📁 Project Structure

```
ossbeat/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── config/        # Environment configuration
│   │   │   ├── middleware/    # Express middleware
│   │   │   ├── modules/       # Feature modules
│   │   │   │   ├── auth/      # Authentication logic
│   │   │   │   ├── repo/      # Repository management
│   │   │   │   ├── user/      # User management
│   │   │   │   └── hook/      # GitHub webhooks
│   │   │   ├── types/         # TypeScript type definitions
│   │   │   ├── utils/         # Utility functions
│   │   │   └── index.ts       # Server entry point
│   │   └── package.json
│   └── web/
│       ├── app/               # Next.js app router
│       │   ├── (home)/        # Home page group
│       │   ├── dashboard/     # Dashboard pages
│       │   │   ├── home/      # Home dashboard
│       │   │   │   ├── gsoc/  # GSoC preparation page
│       │   │   │   ├── hacktomberfest/  # Hacktoberfest page
│       │   │   │   └── issues/ # Issues management page
│       │   │   └── auth/      # Authentication pages
│       │   ├── globals.css    # Global styles
│       │   ├── layout.tsx     # Root layout
│       │   └── page.tsx       # Home page
│       ├── components/        # React components
│       ├── lib/               # Utility libraries
│       ├── types/             # TypeScript types
│       └── utils/             # Helper functions
├── packages/
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Database schema
│   │   │   └── migrations/    # Database migrations
│   │   └── src/
│   │       ├── client.ts      # Prisma client
│   │       └── index.ts
│   ├── ui/                    # Shared UI components
│   ├── eslint-config/         # ESLint configurations
│   └── typescript-config/     # TypeScript configurations
├── package.json
├── turbo.json                 # Turborepo configuration
└── README.md
```

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User profiles and authentication data
- **Provider**: OAuth provider information (GitHub)
- **Repository**: GitHub repository data
- **Contribution**: User contributions to repositories
- **UserRepoStat**: User statistics per repository
- **RecommendedRepo**: AI-powered repository recommendations
- **RefreshToken**: JWT refresh token storage

## 🔐 Authentication Flow

1. User clicks "Login with GitHub"
2. Redirected to GitHub OAuth authorization
3. GitHub redirects back with authorization code
4. Backend exchanges code for access token
5. User profile data fetched from GitHub API
6. JWT tokens generated and stored
7. User redirected to dashboard

## 📡 API Documentation

### Authentication Endpoints

- `POST /auth/github` - Initiate GitHub OAuth login
- `POST /auth/github/callback` - Handle OAuth callback
- `POST /auth/refresh` - Refresh JWT tokens
- `POST /auth/logout` - Logout user

### Repository Endpoints

- `GET /repo/discover` - Discover repositories with pagination and filtering
- `GET /repo/:id` - Get repository details

### User Endpoints

- `GET /user/getUser` - Get user profile

### Webhook Endpoints

- `POST /github/webhook` - Process GitHub webhook events

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start all development servers
pnpm build                  # Build all packages and apps
pnpm lint                   # Run ESLint
pnpm check-types           # Run TypeScript type checking

# Database
pnpm db:generate           # Generate Prisma client
pnpm db:migrate            # Run database migrations
pnpm db:deploy             # Deploy migrations to production
pnpm db:studio             # Open Prisma Studio

# Individual services
pnpm --filter web dev      # Start web app only
pnpm --filter backend dev  # Start backend only
```

### Code Quality

- **ESLint**: Configured with Next.js and React rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking enabled

## 🚢 Deployment

### Backend Deployment

```bash
# Build the backend
pnpm --filter backend build

# The built files will be in apps/backend/dist/
```

### Frontend Deployment

```bash
# Build the web app
pnpm --filter web build

# The built files will be in apps/web/.next/
```

### Environment Setup for Production

Ensure all production environment variables are set:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# GitHub OAuth (Production App)
GITHUB_CLIENT_ID="prod_client_id"
GITHUB_CLIENT_SECRET="prod_client_secret"
GITHUB_REDIRECT_URI="https://yourdomain.com/auth/github/callback"

# Frontend
FRONTEND_URL="https://yourdomain.com"

# Environment
NODE_ENV="production"
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Commit Convention

We follow [Conventional Commits](https://conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Development Guidelines

- Write clear, concise commit messages
- Test your changes before submitting
- Update documentation for API changes
- Follow the existing code style
- Use TypeScript for type safety

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Turborepo](https://turborepo.com/) for the monorepo tooling
- [Next.js](https://nextjs.org/) for the React framework
- [Prisma](https://prisma.io/) for the database ORM
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [GitHub](https://github.com/) for the OAuth and API services

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Shailesh2302/OSSBeat/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Shailesh2302/OSSBeat/discussions)

---

Built with ❤️ for the open-source community
