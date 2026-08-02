# Change login to ID number

## Why This Task Mattered

Students and professors should not need email accounts to enter the MVP. This task makes login match the school workflow: admins create accounts, and users sign in with their school ID and password.

## What Was Verified

- `npm run lint -- src/app/login/page.tsx`: pass, the touched login page has no lint errors.
- `npm run build`: pass, the app compiles successfully. The only warning is the existing Next.js middleware-to-proxy deprecation.
- Human app check: pass, the user confirmed the login now works after creating a Supabase Auth user with `231-1236@nvsu.local`.

## Human Evidence

Screenshots showed a successful dashboard login as `231-1236` and the matching Supabase Auth user record with email `231-1236@nvsu.local`. A follow-up screenshot also showed the display name is still empty, which belongs to the upcoming Supabase profiles task.

## Result

Pass. It is safe to close because the school-ID login flow works, the native format popup was fixed, and the remaining display-name issue is a separate schema/profile task.
