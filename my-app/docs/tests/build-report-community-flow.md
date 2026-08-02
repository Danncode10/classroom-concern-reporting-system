# Build Report and Community Flow

## Why This Task Mattered
This task makes the MVP usable for students and professors because reports are no longer just stored privately. Users can create reports, see visible concerns in the Home feed, and help important concerns stand out through voting.

## What Was Verified
- `npm run lint -- src/services/concerns.ts src/components/dashboard/tabs/bookings-tab.tsx src/components/dashboard-shell.tsx src/components/dashboard/tabs/overview-tab.tsx src/lib/concerns.ts src/lib/dashboard-features.ts`: pass, the changed report/feed files satisfy lint rules.
- `npm run build`: pass, the app compiled successfully with only the existing Next.js middleware deprecation warning.
- Human app check: pass, the user confirmed the UI looks good after Home became the feed and the duplicate Community tab was removed.

## Human Evidence
The user tested the dashboard in the browser, confirmed the report/community UI looked good, and asked to close the task.

## Result
Pass. The report feed is ready to close because users can use Home as the social-style concerns feed, votes show separate up/down counts, and the duplicate Community tab is gone.
