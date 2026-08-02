# MASTERPLAN

# NVSU Classroom Concern Reporting System MVP

> **Status:** MVP planning  
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

- Change login from email-based login to ID-number based login.
- Use ID number format like `XXX-XXXX`.
- Keep password login.
- Remove email verification and sign-up flow for normal users.
- Users will be manually created in Supabase by an admin.

### Dashboard Sidebar

- Reuse the existing dashboard shell and sidebar.
- Rename the tabs for the classroom concern system.
- Suggested tabs: Home, Create Report, Track Report, Community, Admin.
- Show the Admin tab only for admin users.

### User Features

- Users can create a classroom concern report.
- Users can track their own reports.
- Users can view community reports.
- Users can upvote or downvote community reports so visible concerns are easier to notice.
- Students and professors use the same normal user role.

### Admin Features

- Admins can view all reports.
- Admins can change report status.
- Admins can remove inappropriate or duplicate posts.
- Admins can block users.
- Admins can manage concerns without changing the existing dashboard structure too much.

### Supabase

- Use the existing Supabase project for the app.
- Update `.env.local` with the correct Supabase project ID and database connection host.
- Add only the schema needed for the MVP.
- Create tables for profiles, reports, votes, status history, and moderation actions.
- Use role-based access so normal users and admins have different permissions.

### MVP Acceptance Criteria

- The landing page no longer looks like a generic SaaS template.
- Users can log in using an ID number and password.
- The dashboard sidebar matches the classroom concern workflow.
- Users can create and track reports.
- Users can vote on community reports.
- Admins can manage report status, remove posts, and block users.
- The existing Dannflow layout is reused as much as possible.
- The MVP is simple, clear, and usable for students and professors.

## Later Improvements

- Comments on community reports.
- Merge duplicate reports.
- Notifications.
- QR code per classroom.
- Analytics for repeated classroom issues.
- Anonymous reports.
