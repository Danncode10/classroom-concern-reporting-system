# MVP Capabilities

## Purpose

NVSU Concerns gives students and professors one shared place to raise classroom issues instead of relying only on verbal reports to professors. The feed makes repeated or important concerns easier for school personnel to notice and act on.

## User Experience

### Sign in

Users sign in with their school ID, such as `123-4567`, and their password. The app converts that ID to the internal Supabase Auth email `123-4567@nvsu.local`; users never need to type or remember that email.

There is no public sign-up screen. School personnel create accounts manually in Supabase before a user can sign in.

### Home feed

Home is the community feed. It shows visible reports with the newest reports first, their current status, category, location, optional image, and separate upvote and downvote totals.

- Users can filter the feed by report status.
- Users can upvote or downvote a report, or tap their existing vote again to remove it.
- Vote feedback is shown immediately while the background update completes.
- The feed receives real-time report and vote updates and loads additional reports as the user scrolls.
- Removed reports are not shown in the Home feed.

### Create Report

Users can submit a classroom concern with:

- A title, 5 to 100 characters
- A category
- A location, up to 80 characters
- A description, 10 to 500 characters
- An optional JPEG, PNG, or WebP image

On supported mobile devices, the photo control can open the camera. Before submitting, the user can remove or retake the selected image.

### Track Report

Users can view only their own submitted reports and filter them by status. Each report shows its details, image when present, location, category, date, status, and net vote score.

## Admin Experience

Only a profile whose `role` is `admin` can see these screens.

### Review Reports

Admins can see all reports, filter by status, and manage the moderation queue.

- Reports are ordered by most supported first.
- In the All filter, resolved reports are placed at the bottom.
- Admins can change a report status to Submitted, In Review, In Progress, Resolved, or Rejected.
- Admins can remove inappropriate or duplicate reports and restore a removed report when needed.
- Status changes and moderation actions are recorded in the database.

### Manage Users

Admins can search the user list by display name, school ID, or internal account email. They can block or unblock normal users and record a reason. An admin cannot block their own account.

## Report Statuses

| Status | Meaning |
| --- | --- |
| Submitted | The concern was received and is waiting for review. |
| In Review | School personnel are checking the concern. |
| In Progress | The concern is being handled. |
| Resolved | The concern has been addressed. |
| Rejected | The report cannot be acted on, such as a duplicate or invalid report. |

## Account Setup in Supabase

1. In **Authentication > Users**, add a user with an internal email such as `123-4567@nvsu.local` and a password. Enable **Auto confirm user**.
2. In the `profiles` table, set the user’s `school_id` to `123-4567` and `full_name` to their display name.
3. Leave `role` as `user` for students and professors. Change it to `admin` only for authorized school personnel.
4. Keep `is_blocked` as `false` unless the account needs to be restricted.

## MVP Boundaries

The MVP intentionally does not include public account registration, comments, anonymous reports, duplicate-report merging, user notifications, or admin remarks visible to users. These can be added after the core reporting and moderation workflow is validated with NVSU users.
