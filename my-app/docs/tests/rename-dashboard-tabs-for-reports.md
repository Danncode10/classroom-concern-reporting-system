# Rename dashboard tabs for reports

## Why This Task Mattered

The dashboard still looked like the original Dannflow starter, which made the MVP confusing after login. Renaming the tabs makes the app feel like a classroom concern reporting system while keeping the existing dashboard structure intact.

## What Was Verified

- `npm run lint -- src/lib/dashboard-features.ts src/components/dashboard-shell.tsx src/components/dashboard/tabs/overview-tab.tsx src/components/dashboard/tabs/services-tab.tsx src/components/dashboard/tabs/leads-tab.tsx src/components/dashboard/tabs/bookings-tab.tsx src/components/dashboard/tabs/blog-tab.tsx`: pass.
- `npm run build`: pass. The only warning is the existing Next.js middleware-to-proxy deprecation.
- Human app check: pass. The user confirmed normal users do not see Admin, the sidebar labels are correct, and renamed tabs open without crashing.

## Human Evidence

The user ran the `/verify-task` checklist and confirmed that the dashboard shows Home, Create Report, Track Report, and Community for normal users, with Admin hidden unless the user is an admin.

## Result

Pass. It is safe to close because the dashboard navigation now matches the classroom concern workflow and the existing shell still builds successfully.
