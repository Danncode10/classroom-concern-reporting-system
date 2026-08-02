# PLAN.md

# Classroom Concern Reporting System

> **Project:** NVSU Classroom Concern Reporting System  
> **App folder:** `my-app`  
> **Design approach:** User Centered Design  
> **Last updated:** August 2, 2026  
> **Status:** Planning

## 1. Product Goal

Create a simple, campus-friendly system where NVSU students and professors can post classroom concerns without needing to figure out who to approach manually. The system should help users submit concerns quickly, upvote important concerns for visibility, and help admins track, moderate, manage, and act on reports.

The design should feel clear, calm, and practical. Users should understand what to do within a few seconds.

## 2. Main Users

### Student / Professor

Students and professors will use the system in almost the same way. They are the main campus users who can post classroom concerns, view concerns posted by others, and upvote concerns that need more attention.

Student and professor needs:

- Submit a concern quickly.
- Use the system on a mobile phone.
- Choose the concern type without typing too much.
- Add classroom location clearly.
- Upload a photo as proof.
- See a dashboard or feed of posted concerns.
- Upvote concerns so important or repeated problems become more visible.
- Check if a concern is pending, in progress, or resolved.
- Avoid repeated verbal reports by having one shared place for concerns.

### Admin / School Personnel

Admins and school personnel are responsible for managing, improving, and maintaining school facilities. They should have accounts where they can check submitted concerns, moderate posts, manage users, and update report status.

Admin and school personnel needs:

- See all submitted concerns.
- Filter by classroom, concern type, upvotes, urgency, and status.
- Update status as reports are handled.
- Add remarks or action taken.
- Mark reports as resolved.
- Keep a record of recurring classroom issues.
- Remove inappropriate or duplicate posts.
- Block users who misuse the system.
- Keep the concern feed organized and trustworthy.

## 3. User Centered Design Principles

The system should follow these rules:

- Use simple words that students understand.
- Keep forms short and focused.
- Make the main action easy to find.
- Use familiar icons beside important buttons.
- Make the app mobile-friendly first.
- Show confirmation after every important action.
- Avoid confusing dashboard terms for students.
- Show report progress clearly.
- Protect student privacy.
- Make responsible personnel accountable by giving them clear report management tools.
- Let users support existing concerns with upvotes instead of posting the same issue many times.
- Include moderation tools so the system stays respectful and useful.

## 4. Core User Flow

1. Student or professor opens the system.
2. User views the concern feed or dashboard.
   1. User can upvote an existing concern if the same issue already exists.
3. User chooses **Post Concern** if the concern has not been posted yet.
4. User fills out a short form.
5. User optionally uploads a photo.
6. System posts the concern and shows confirmation.
7. Other users can view and upvote the concern.
8. Admin sees the concern in the admin dashboard.
9.  Admin updates the concern status, removes invalid posts, or blocks abusive users if needed.
10. Users can check the latest status from the concern feed or their dashboard.

## 5. Main Screens

### User Home / Concern Feed

Purpose: Give students and professors a direct way to see, support, and post classroom concerns.

Should include:

- System name.
- Short instruction.
- **Post Concern** button.
- Search or filter option.
- List of posted concerns.
- Upvote button on each concern.
- Status badge on each concern.
- Simple list of concern examples.

Preferred feel:

- Clean and friendly.
- No marketing-style landing page.
- The first screen should already show useful concerns, not only a welcome message.

### Post Concern Form

Purpose: Let students or professors submit a concern with minimal effort.

Fields:

- Student name or student number.
- Course and section.
- Classroom or location.
- Type of concern.
- Short description.
- Photo upload.

Concern type options:

- Broken chair or table.
- Damaged electric fan.
- Missing classroom equipment.
- Electrical problem.
- Cleanliness issue.
- Leaking roof or water issue.
- Other.

Form behavior:

- Use dropdowns where possible.
- Required fields should be clear.
- Show helpful error messages.
- Keep the submit button visible and easy to find.
- Suggest checking similar concerns first to avoid duplicate posts.

### Concern Card

Purpose: Let users quickly understand and support a concern.

Should include:

- Concern title or short description.
- Classroom or location.
- Concern type.
- Photo preview if available.
- Current status.
- Number of upvotes.
- Upvote button.
- Date posted.

Example actions:

- Upvote
- View Details
- Report Duplicate or Inappropriate Post

### Confirmation Page

Purpose: Reassure the user that the concern was posted.

Should include:

- Success message.
- Posted concern summary.
- Button to view the concern.
- Button to post another concern.

### User Dashboard

Purpose: Let students and professors track their own posts and see important concerns.

Should include:

- My posted concerns.
- Concerns I upvoted.
- Most upvoted concerns.
- Recently updated concerns.
- Status badges.

Possible statuses:

- Pending
- Received
- In Progress
- Resolved
- Removed
- Needs More Information

### Admin Dashboard

Purpose: Help admins and school personnel manage concerns, moderate posts, and take action.

Should include:

- Summary counts.
- Recent reports.
- Filters by status, concern type, location, and upvote count.
- Report detail view.
- Status update controls.
- Remarks or action taken field.
- Remove post action.
- Block user action.
- View user history.

Dashboard should be dense enough for work, but not visually overwhelming.

## 6. Visual Direction

The current Dannflow template uses a dark SaaS visual style. For this school system, the design should become more practical and campus-friendly.

Preferred style:

- Light or balanced interface, not too dark.
- Clean white or soft gray page backgrounds.
- NVSU-inspired accents if available.
- Clear contrast for readability.
- Simple cards only for repeated reports or dashboard items.
- Large enough text for mobile use.
- Buttons with familiar icons from `lucide-react`.

Avoid:

- Overly decorative landing page.
- Huge hero sections.
- Complicated animations.
- Too many colors.
- Confusing SaaS labels like pricing, leads, bookings, or blog for this system.

## 7. Suggested Navigation

### Student / Professor Navigation

- Home
- Concern Feed
- Post Concern
- My Dashboard

### Admin Navigation

- Dashboard
- Concerns
- Status Updates
- Users / Accounts
- Moderation
- Settings

## 8. Roles and Permissions

Possible roles:

- `user`
- `admin`

Permissions:

| Role | Can Post Concern | Can View Feed | Can Upvote | Can Update Status | Can Remove Posts | Can Block Users |
| --- | --- | --- | --- | --- | --- | --- |
| User | Yes | Yes | Yes | No | No | No |
| Admin | Yes | Yes | Yes | Yes | Yes | Yes |

## 9. Data Model Draft

### Reports

Possible fields:

- `id`
- `user_id`
- `title`
- `course_section`
- `location`
- `concern_type`
- `description`
- `photo_url`
- `status`
- `upvote_count`
- `remarks`
- `submitted_at`
- `updated_at`
- `assigned_to`
- `removed_at`
- `removed_reason`

### Users / Profiles

Possible fields:

- `id`
- `full_name`
- `email`
- `role`
- `course_section`
- `is_blocked`
- `created_at`

### Upvotes

Possible fields:

- `id`
- `report_id`
- `user_id`
- `created_at`

### Status History

Possible fields:

- `id`
- `report_id`
- `status`
- `remarks`
- `updated_by`
- `created_at`

### Moderation Logs

Possible fields:

- `id`
- `admin_id`
- `target_user_id`
- `report_id`
- `action`
- `reason`
- `created_at`

## 10. Version 1 Scope

Build first:

- User home / concern feed.
- Post concern form.
- Confirmation page.
- User dashboard with posted and upvoted concerns.
- Admin dashboard with concern list.
- Report detail view.
- Upvote feature.
- Status update feature.
- Remove post feature.
- Block user feature.

Save for later:

- Notifications through email or SMS.
- Analytics for recurring classroom issues.
- File export.
- Anonymous reporting.
- QR code per classroom.

## 11. Implementation Direction for `my-app`

Likely edits later:

- Replace the current landing page with a usable student home screen.
- Remove or repurpose template sections like pricing, blog preview, generic features, services, leads, and bookings.
- Rename dashboard tabs to match the classroom concern system.
- Create report form components.
- Create concern feed and concern card components.
- Create upvote components.
- Add Supabase tables and policies for reports and status history.
- Add role-based dashboard behavior for normal users and admins.
- Add moderation tools for admins.
- Update visual theme in `src/app/globals.css`.
- Update app copy and config in `src/lib/config.ts`.

## 12. Open Decisions

Questions to decide as we continue:

1. Should students need an account to submit concerns, or can they report without logging in?
2. Should professors use the same `user` role as students? Current decision: yes.
3. Should the system use student number as required information?
4. Should reports be anonymous or always linked to user identity?
5. What NVSU colors, logo, or naming should we use?
6. Who exactly are the admins: maintenance, department office, school admin, or all of them?
7. Should users be able to comment on concerns, or only upvote them?
8. Should admins be able to merge duplicate concerns?

## 13. Build Phases

### Phase 0: Planning and Content

- [x] Read activity information.
- [x] Create `Laboratory_Activity_User_Centered_Design.md`.
- [x] Create `Answers.md`.
- [x] Draft this `PLAN.md`.
- [ ] Decide final user roles.
- [ ] Decide whether students must log in.
- [ ] Decide the final name of the system.
- [ ] Decide if concern comments are included in version 1.

### Phase 1: Interface Redesign

- [ ] Replace generic SaaS landing page with user-first concern feed.
- [ ] Create post concern form UI.
- [ ] Create confirmation UI.
- [ ] Create concern card UI with upvote button.
- [ ] Create user dashboard UI.
- [ ] Update colors, labels, and navigation.

### Phase 2: Dashboard Redesign

- [ ] Replace generic dashboard tabs with report management tabs.
- [ ] Create admin concern list.
- [ ] Create report detail view.
- [ ] Add status update controls.
- [ ] Add remove post controls.
- [ ] Add block user controls.
- [ ] Add simple dashboard statistics.

### Phase 3: Database and Auth

- [ ] Design report database tables.
- [ ] Add migrations.
- [ ] Add Supabase policies.
- [ ] Connect concern posting to database.
- [ ] Connect feed and dashboard to real reports.
- [ ] Connect upvotes to database.
- [ ] Connect moderation actions to database.

### Phase 4: Testing and Improvement

- [ ] Test student flow on mobile.
- [ ] Test personnel dashboard on desktop.
- [ ] Check accessibility and readability.
- [ ] Gather feedback.
- [ ] Improve based on feedback.

## 14. Success Criteria

The system is successful if:

- A student can submit a classroom concern in less than one minute.
- A user can see concerns posted by others.
- A user can upvote a concern that needs more visibility.
- A user can check the report status easily.
- Admins can see reports and update their status.
- Admins can remove inappropriate posts.
- Admins can block users who misuse the system.
- The interface is understandable without extra instructions.
- The system reflects user needs from the survey.
