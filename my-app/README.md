# NVSU Classroom Concern Reporting System

The application for the NVSU Classroom Concern Reporting System MVP. It reuses the Dannflow dashboard foundation and focuses it on a simple workflow for reporting and managing classroom concerns.

## What the MVP Does

- Lets students and professors sign in using a school ID in the `XXX-XXXX` format and a password.
- Shows a Home feed of visible classroom concerns, newest first.
- Lets users create reports with a category, location, title, description, and optional image evidence.
- Supports taking a photo directly from a mobile device, replacing it before submission, or submitting without one.
- Keeps titles, locations, and descriptions within sensible character limits so report cards remain readable.
- Lets users view their own reports and filter them by status.
- Lets users upvote or downvote a concern. Each count is shown separately.
- Updates votes and feed changes immediately, with real-time refresh for reports and votes from other users.
- Loads more Home-feed reports as the user scrolls.
- Gives admins a Review Reports screen to change status and remove or restore reports.
- Gives admins a Manage Users screen to search by name or school ID and block or unblock accounts.
- Provides an Analytics screen with report totals and recent activity.

Read [the full MVP capabilities document](docs/mvp-capabilities.md) for roles, statuses, account setup, and MVP boundaries.

## Roles

| Role | Access |
| --- | --- |
| User | Home feed, Create Report, Track Report, Analytics, and Settings. Students and professors use this same role. |
| Admin | All user access plus Review Reports and Manage Users. |

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set these values in `.env.local` using the values from your Supabase project:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_ID=
NEXT_PUBLIC_SITE_NAME=NVSU Concerns
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

This MVP does not require Upstash Redis. `DATABASE_URL` is only needed when using database CLI workflows that connect directly to Supabase.

## School-ID Accounts

Supabase Auth uses an internal email address, but the app only asks users for their school ID. Create each user in Supabase Auth with the email format:

```text
123-4567@nvsu.local
```

Then set the matching `profiles.school_id` to `123-4567`, add `profiles.full_name`, and set `profiles.role` to `admin` only for authorized school personnel. See the capabilities document for the full steps.

## Useful Commands

```bash
npm run dev
npm run lint
npm run build
npm run db:types:remote
```
