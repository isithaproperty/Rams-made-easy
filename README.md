# RAMS Made Easy

Neutral, white-label UK construction RAMS portal. The workflow is deliberately controlled: guided draft → AI gap check → competent-person review → approval/rejection → controlled PDF issue → worker briefing and acknowledgement → audit history.

## Local setup

1. Copy `env.example` to `.env.local` and supply a Supabase URL and publishable key.
2. Install pinned dependencies with `npm ci`.
3. Run `npm run dev`.

The current UI is a functional product prototype. The schema in `supabase/migrations` is the secure multi-tenant foundation; it must be reviewed and applied to a dedicated Supabase project before live data is enabled.
