# GitHub Copilot Instructions for Sentinel Local

## Project Overview

Sentinel Local is an AI marketing operator for local businesses that creates, maintains, and continuously optimizes Google Business Profiles and Google Ads campaigns. This is NOT just analytics software - it's an active AI agent that makes optimization decisions and logs every action.

### Core Purpose
- **Reputation Module**: Google reviews ingestion with AI-powered reply drafting
- **Ads Module**: Google Ads campaign creation, management, and optimization
- **Owner Chat Module**: Natural language Q&A with AI assistance
- **Campaign Management**: Automated creation and maintenance of campaigns
- **Optimization Tracking**: Complete audit log of all AI-driven marketing actions

## Tech Stack

### Frontend
- **React 18** with TypeScript for UI
- **Vite** for fast development and bundling
- **Tailwind CSS** for styling
- **Wouter** for routing (not React Router)
- **TanStack Query** for server state management
- **Shadcn UI** for component primitives

### Backend
- **Node.js** with Express
- **TypeScript** throughout (ESM modules)
- **Prisma ORM** for PostgreSQL database
- **JWT** for authentication (not sessions)
- **bcryptjs** for password hashing

### Database
- **PostgreSQL** with Prisma schema
- Models: User, Review, AdSummary, ChatMessage, BusinessProfileSetup, AdsCampaignPlan, OptimizationAction
- Always run `npx prisma generate` after schema changes

## Development Setup

### Prerequisites
- Node.js v20 or later
- PostgreSQL database (local or remote)

### Getting Started
```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Seed demo data (optional)
node scripts/seed.js

# Run in development mode
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server (both frontend and backend on port 5000)
- `npm run build` - Build for production (Vite + esbuild)
- `npm start` - Run production build
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push Prisma schema to database

## Code Organization

### Directory Structure
```
/client               # Frontend React application
  /src
    /components       # UI components
      /ui            # Shadcn base components
    /pages           # Route pages (Login, Dashboard, Reviews, Chat)
    /lib             # Utilities and helpers
    /hooks           # Custom React hooks
/server              # Backend Express application
  index.ts           # Server entry point
  routes.ts          # API route definitions
  db.ts              # Database connection
  vite.ts            # Vite middleware for dev
/prisma              # Database schema and migrations
  schema.prisma      # Prisma schema
/scripts             # Utility scripts (seed.js)
/shared              # Shared types and utilities
```

### Import Paths
- Use `@/*` for client imports (e.g., `import { Button } from '@/components/ui/button'`)
- Use `@shared/*` for shared utilities
- Server imports are relative

## Architecture Patterns

### Frontend Patterns
- **Components**: Functional components with TypeScript
- **State Management**: TanStack Query for server state, useState for local state
- **Routing**: Wouter (use `<Link>` and `useLocation()`)
- **Forms**: React Hook Form with Zod validation (when applicable)
- **Styling**: Tailwind utility classes, avoid custom CSS

### Backend Patterns
- **API Routes**: RESTful endpoints in `server/routes.ts`
- **Authentication**: JWT tokens validated via middleware
- **Database**: Prisma Client for all database operations
- **Error Handling**: Try-catch blocks with appropriate HTTP status codes
- **AI Integration**: OpenRouter API with fallback logic for reliability

### Database Patterns
- **Prisma Schema**: Single source of truth for data models
- **Migrations**: Use `npx prisma db push` for development
- **Relationships**: Defined in Prisma schema with foreign keys
- **IDs**: Use `@default(cuid())` for all ID fields

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login and receive JWT

### Reviews
- `GET /api/reviews` - List reviews with AI-suggested replies
- `POST /api/reviews/:id/approve-reply` - Approve AI reply
- `POST /api/reviews/:id/escalate` - Escalate for manual review

### Ads
- `GET /api/ads/summary` - Get campaign performance metrics

### Chat
- `GET /api/chat/history` - Get conversation history
- `POST /api/chat/send` - Send message and receive AI response

### Marketing
- `GET /api/marketing/overview` - Get active campaign status
- `POST /api/marketing/optimize` - Trigger AI optimization (body: `{ "area": "GBP" | "ADS" }`)

**All non-auth endpoints require JWT authorization header**: `Authorization: Bearer <token>`

## Coding Standards

### TypeScript
- **Strict mode enabled** - No `any` types without good reason
- **Explicit return types** for functions
- **Interface over type** for object shapes (when applicable)
- **Proper null checks** - Use optional chaining and nullish coalescing

### React
- **Functional components only** - No class components
- **Hooks best practices** - Follow rules of hooks
- **Prop types** - Use TypeScript interfaces for props
- **Key props** - Always provide unique keys for lists

### Database
- **Prisma schema** - Always update schema.prisma first, then generate
- **Migrations** - Use `db push` for dev, proper migrations for production
- **Transactions** - Use Prisma transactions for multi-step operations
- **Error handling** - Handle unique constraint violations and not found errors

### Security
- **Never commit secrets** - Use environment variables (`.env` file)
- **Validate inputs** - Use Zod schemas for request validation
- **Sanitize outputs** - Prevent XSS and injection attacks
- **Bcrypt passwords** - Use bcryptjs with proper salt rounds
- **JWT tokens** - Short expiration, secure signing

## AI Integration Strategy

The application uses a **dual-tier AI approach**:

1. **Low-Cost Generation** - For routine tasks (review replies, performance summaries)
   - Primary and backup model retry pattern
   - Graceful fallback to safe placeholder text

2. **Critical Generation** - For business decisions (ROI analysis, ad spend recommendations)
   - Direct fallback to deterministic metrics-based responses
   - Never fail silently

## Testing Guidelines

- **No existing test infrastructure** - Tests are not currently required
- When adding tests in the future:
  - Use Vitest or Jest for unit tests
  - Test utilities in `/lib` and `/hooks`
  - Test API endpoints with supertest
  - Mock Prisma client for database tests

## Common Tasks

### Adding a New API Endpoint
1. Define route handler in `server/routes.ts`
2. Add JWT middleware if authentication required
3. Use Prisma for database operations
4. Return appropriate HTTP status codes
5. Update this documentation if it's a major feature

### Adding a New Database Model
1. Update `prisma/schema.prisma`
2. Run `npx prisma generate`
3. Run `npx prisma db push`
4. Add relationships to existing models if needed
5. Update TypeScript types in shared folder if needed

### Adding a New UI Component
1. Create component in `/client/src/components`
2. Use Shadcn UI primitives from `/components/ui`
3. Follow existing component patterns
4. Use Tailwind for styling
5. Export component for use in pages

### Modifying Authentication
1. Auth logic is in `server/routes.ts` under `/api/auth/*`
2. JWT secret is in `.env` file
3. Token validation middleware checks all protected routes
4. User passwords are bcrypt hashed

## Important Notes

### Environment Variables
Required variables in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT signing
- `OPENROUTER_API_KEY` - OpenRouter API key (optional, has fallbacks)

### Development Server
- Runs on port 5000 by default
- Frontend and backend served from same Express server
- Vite handles HMR for frontend
- tsx restarts backend on changes

### Database
- PostgreSQL required (no SQLite support)
- Schema is in `prisma/schema.prisma`
- Demo data in `scripts/seed.js`
- Demo credentials: `demo@hvac.com` / `demo123`

### AI Models
- Uses OpenRouter API for flexible model access
- Configured in environment variables
- Has intelligent fallback logic
- Never exposes raw errors to users

## Debugging Tips

- **Database issues**: Check `DATABASE_URL`, run `npx prisma generate`, verify PostgreSQL is running
- **Build errors**: Clear `node_modules` and reinstall, regenerate Prisma client
- **Port conflicts**: Change port in `server/index.ts`
- **Auth issues**: Verify JWT_SECRET is set, check token expiration

## Additional Resources

- Main README: `/README.md`
- Security policy: `/SECURITY.md`
- Design guidelines: `/design_guidelines.md`
- Prisma schema: `/prisma/schema.prisma`
