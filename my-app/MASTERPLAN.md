# MASTERPLAN — NVSU Classroom Concern Reporting System MVP

> **Status:** MVP planning  
> **Source plan:** `../PLAN.md`  
> **App folder:** `my-app`

## MVP Goal

Build a simple campus concern feed where students and professors can post classroom concerns, upvote concerns for visibility, and admins can manage posts, users, and concern status.

## Phase 0: Setup and Cleanup

- [ ] [P0.1] Confirm app name, colors, and simple navigation.
- [ ] [P0.2] Replace Dannflow placeholder copy with classroom concern system copy.
- [ ] [P0.3] Remove or hide non-MVP template sections like pricing, blog, bookings, and leads.

## Phase 1: User Concern Feed

- [ ] [P1.1] Build the main concern feed as the first useful screen.
- [ ] [P1.2] Create concern cards with title, location, type, status, photo, date, and upvote count.
- [ ] [P1.3] Add search and filters for status, concern type, and location.
- [ ] [P1.4] Add a simple upvote interaction for normal users.

## Phase 2: Post Concern Flow

- [ ] [P2.1] Build the post concern form.
- [ ] [P2.2] Include fields for title, location, concern type, description, course/section, and photo.
- [ ] [P2.3] Add clear validation and friendly error messages.
- [ ] [P2.4] Show a confirmation screen after posting.

## Phase 3: User Dashboard

- [ ] [P3.1] Show concerns posted by the current user.
- [ ] [P3.2] Show concerns upvoted by the current user.
- [ ] [P3.3] Show recently updated and most upvoted concerns.

## Phase 4: Admin Dashboard

- [ ] [P4.1] Build an admin concern management table.
- [ ] [P4.2] Allow admins to change concern status.
- [ ] [P4.3] Allow admins to remove invalid or inappropriate posts.
- [ ] [P4.4] Allow admins to block users who misuse the system.
- [ ] [P4.5] Add admin remarks or action-taken notes.

## Phase 5: Database and Auth

- [ ] [P5.1] Create database tables for concerns, upvotes, profiles, status history, and moderation logs.
- [ ] [P5.2] Add Supabase policies for normal users and admins.
- [ ] [P5.3] Connect concern posting, feed loading, upvotes, and admin actions to Supabase.

## Phase 6: MVP Testing

- [ ] [P6.1] Test the student/professor flow on mobile.
- [ ] [P6.2] Test the admin flow on desktop.
- [ ] [P6.3] Check readability, spacing, empty states, and form errors.
- [ ] [P6.4] Fix the highest-impact usability issues.

## MVP Acceptance Criteria

- [ ] Users can post a classroom concern.
- [ ] Users can view a feed of concerns.
- [ ] Users can upvote concerns.
- [ ] Users can view their own posts and upvoted concerns.
- [ ] Admins can update concern status.
- [ ] Admins can remove posts.
- [ ] Admins can block users.
- [ ] The interface is simple, readable, and usable on mobile.
