# MASTERPLAN

# NVSU Classroom Concern Reporting System MVP

> **Status:** MVP delivered
> **App folder:** `my-app`  
> **Approach:** Tweak the existing Dannflow app instead of rebuilding the UI structure.

## MVP Goal

Turn the existing Dannflow app into a classroom concern reporting system with the smallest practical set of changes.

The app already has authentication, landing pages, dashboard layout, sidebar navigation, and Supabase support. The MVP should reuse those parts and only change what is needed for the classroom concern workflow.

## Phase 1: MVP Tweaks

### Landing Page

- [x] Replace the generic Dannflow landing page copy with NVSU classroom concern reporting content.
- [x] Keep the existing layout structure where possible.
- [x] Make the first screen clearly explain that users can post, track, and support classroom concerns.
- [x] Remove or hide non-MVP sections such as pricing, marketing blog previews, leads, bookings, and generic SaaS content.

### Login Page

- [x] Change login from email-based login to ID-number based login.
- [x] Use ID number format like `XXX-XXXX`.
- [x] Keep password login.
- [x] Remove email verification and sign-up flow for normal users.
- [x] Users will be manually created in Supabase by an admin.

Note: Supabase Auth still requires an email or phone internally. For the MVP, create users in Supabase using the format `123-4567@nvsu.local`, but users will only type `123-4567` in the app. The login page converts the ID number into the internal Supabase email automatically.

### Dashboard Sidebar

- [x] Reuse the existing dashboard shell and sidebar.
- [x] Rename the tabs for the classroom concern system.
- [x] Tabs: Home, Create Report, Track Report, Analytics, and Settings.
- [x] Show Review Reports and Manage Users only for admin users.

Note: The separate Community tab was removed because Home now acts as the social-style concern feed.

### User Features

- [x] Users can create a classroom concern report.
- [x] Users can track their own reports.
- [x] Users can view visible concern reports in the Home feed.
- [x] Users can upvote or downvote concern reports so visible concerns are easier to notice.
- [x] Students and professors use the same normal user role.

### Admin Features

- [x] Admins can view all reports in Review Reports.
- [x] Admins can change report status.
- [x] Admins can remove or restore inappropriate or duplicate posts.
- [x] Admins can search, block, and unblock users in Manage Users.
- [x] Admin controls reuse the existing dashboard structure.

### Supabase

- [x] Use the existing Supabase project for the app.
- [x] Configure the MVP with the Supabase URL, publishable key, service-role key, and project ID.
- [x] Add the schema needed for the MVP while keeping Dannflow's existing starter tables available.
- [x] Create tables for profiles, reports, votes, status history, and moderation actions.
- [x] Use role-based access so normal users and admins have different permissions.

Note: Supabase Auth users should still be created as `123-4567@nvsu.local`. The app stores the real school ID in `profiles.school_id`. Add the student's or professor's real display name in `profiles.full_name`; the dashboard will use that name when it exists.

Note: `DATABASE_URL` needs the real Supabase database password, which Supabase does not reveal through MCP. The live schema was applied through Supabase MCP for now, and the repo has the migration recorded for later CLI use once the database password is added.

### MVP Acceptance Criteria

- The landing page no longer looks like a generic SaaS template.
- Users can log in using an ID number and password.
- The dashboard sidebar matches the classroom concern workflow.
- Users can create and track reports.
- Users can vote on community reports.
- Admins can manage report status, remove posts, and block users.
- Reports can include optional mobile-camera or uploaded image evidence.
- The Home feed supports separate upvotes and downvotes, infinite scrolling, optimistic vote feedback, and real-time updates.
- The existing Dannflow layout is reused as much as possible.
- The MVP is simple, clear, and usable for students and professors.

## Later Improvements

- Comments on community reports.
- Merge duplicate reports.
- Notifications.
- QR code per classroom.
- Analytics for repeated classroom issues.
- Anonymous reports.
