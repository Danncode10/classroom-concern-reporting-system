# Connect Supabase schema and env

## Why This Task Mattered

The dashboard was logging in successfully, but the Supabase tables were still blank and profiles had no display-name place for the app to read from. This task connects the MVP to real database tables while keeping the existing Dannflow app structure available.

## What Was Verified

- Supabase MCP schema apply: pass, the live project now has profiles, concern reports, votes, status history, moderation actions, and the existing starter tables.
- Supabase profile backfill: pass, the existing `231-1236@nvsu.local` Auth user now has a `profiles` row with `school_id = 231-1236`.
- `npm run update-types`: pass, generated types now match the live Supabase project.
- `npm run build`: pass, the app compiles successfully. The only warning is the existing Next.js middleware-to-proxy deprecation.
- `npm run lint -- db/schema src/components/dashboard-shell.tsx src/services/dashboard.ts src/services/users.ts`: pass with existing unused `err` warnings in `src/services/dashboard.ts`.
- Supabase security advisor: pass for schema/RLS issues. Remaining warning is project-level leaked password protection being disabled in Supabase Auth settings.

## Notes

- Supabase Auth still requires users to be created as internal emails like `123-4567@nvsu.local`.
- Display names should be entered in `profiles.full_name`.
- `DATABASE_URL` still needs the real database password for CLI migrations; Supabase MCP was used because the current URL could not authenticate.

## Result

Pass. The database is ready for the next MVP task: renaming the dashboard tabs and wiring the concern workflow screens.
