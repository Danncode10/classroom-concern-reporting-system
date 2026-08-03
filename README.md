# Classroom Concern Reporting System

A user-centered web application for reporting, tracking, and managing classroom concerns at Nueva Vizcaya State University.

The system gives students and professors a simple place to post classroom issues, view concerns reported by others, and upvote concerns that need attention. Admins and school personnel can review reports, update their status, moderate invalid posts, and keep a clearer record of recurring classroom problems.

## Features

- School-ID and password login for manually created accounts
- Home concern feed, newest first, with status filters and infinite scrolling
- Separate upvote and downvote totals with immediate feedback
- Optional photo evidence, including mobile camera capture and retake
- Character limits that keep reports readable in the feed
- Personal report tracking by status
- Real-time feed refresh when reports or votes change
- Admin-only report review, status updates, removal, and restoration
- Admin-only user search, blocking, and unblocking
- Analytics overview, Supabase database, storage, and row-level security

## Main User Roles

| Role | Description |
| --- | --- |
| User | Students and professors who can post, view, and vote on concerns. |
| Admin | School personnel who can manage reports, update statuses, remove invalid posts, and moderate users. |

See [my-app/docs/mvp-capabilities.md](my-app/docs/mvp-capabilities.md) for the complete current MVP functionality and account-setup instructions.

## Tech Stack

- Next.js
- React
- TypeScript
- Supabase
- Drizzle ORM
- Tailwind CSS
- TanStack Query
- Lucide React

## Project Structure

```text
.
├── PLAN.md                         Project plan and user-centered design notes
├── Answers.md                      Activity answers and written outputs
├── Laboratory_Activity_User_Centered_Design.md
└── my-app/                         Main Next.js application
    ├── src/app/                    App routes and pages
    ├── src/components/             UI and dashboard components
    ├── src/services/               Server actions and data services
    ├── src/lib/                    Shared config, helpers, and domain logic
    ├── src/utils/supabase/         Supabase clients
    ├── db/schema/                  Drizzle database schema
    ├── db/migrations/              Generated SQL migrations
    └── supabase/migrations/        Supabase migration files
```

## Getting Started

Go to the application folder:

```bash
cd my-app
```

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase project values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_ID=
NEXT_PUBLIC_SITE_NAME=NVSU Concerns
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Database Setup

The app uses Supabase for authentication, Postgres, storage, and row-level security. Database schema is authored with Drizzle in:

```text
my-app/db/schema/
```

Generated migrations are stored in:

```text
my-app/db/migrations/
```

Common database commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:types
```

For remote Supabase type generation:

```bash
npm run db:types:remote
```

## Core Concern Statuses

- Submitted
- In review
- In progress
- Resolved
- Rejected

## Core Concern Categories

- Equipment
- Electrical
- Cleanliness
- Facility
- Safety
- Other

## Development Notes

This project is being built using a User Centered Design approach. The first version focuses on a clear student/professor reporting flow and a practical admin workflow for managing classroom concerns.

See `PLAN.md` for the full product plan, screen requirements, user flows, and build phases.
