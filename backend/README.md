# Kodraxelsoft CMS API

Production-ready REST API for the Kodraxelsoft software house website.

**Stack:** Node.js · Express.js · Supabase (PostgreSQL + Storage) · JWT (single Admin)

Frontend was left untouched. Wire the Next.js app to these endpoints when ready.

---

## Quick start

1. Create a Supabase project.
2. In the SQL Editor, run in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage.sql`
   - `supabase/seed.sql`
3. Copy env file and fill keys:

```bash
cd backend
cp .env.example .env
npm install
npm run seed:admin
npm run dev
```

API base: `http://localhost:5000/api`  
Health: `http://localhost:5000/health`

---

## Architecture

```
backend/src
├── app.js / server.js
├── config/          # env + Supabase client
├── middleware/      # auth, validate, upload, errors
├── controllers/     # HTTP layer
├── services/        # business logic + DB
├── validators/      # Joi schemas
├── routes/          # REST routes
└── utils/           # ApiError, ApiResponse, logger, pagination
```

---

## Auth (single Admin only)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/bootstrap` | No | Create the only admin (fails if one exists) |
| POST | `/api/auth/login` | No | Login → JWT |
| GET | `/api/auth/me` | Yes | Current admin |
| POST | `/api/auth/change-password` | Yes | Change password |

Send: `Authorization: Bearer <token>`

---

## Public endpoints (website)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/public/hero` | Active hero banner |
| GET | `/api/public/services` | Enabled services |
| GET | `/api/public/projects` | Published projects |
| GET | `/api/public/meta-ads` | Active meta ads |
| GET | `/api/public/testimonials` | Enabled reviews |
| GET | `/api/public/settings` | Site settings |
| GET | `/api/public/seo` / `/api/public/seo/:pageKey` | SEO |
| GET | `/api/public/blog` / `/api/public/blog/slug/:slug` | Blog |
| GET | `/api/public/careers` | Open roles |
| POST | `/api/public/contact` | Contact form submit |
| POST | `/api/public/orders` | Order / lead submit |

Query params on list routes: `page`, `limit`, `search`, `sortBy`, `sortOrder`, plus filters (`status`, `category`, `is_featured`, etc.).

---

## Admin endpoints (JWT required)

### Dashboard
- `GET /api/admin/dashboard` — stats + recent activity + latest orders/messages
- `GET /api/admin/dashboard/stats`

### Modules (full CRUD)
- Hero: `/api/admin/hero` (+ `PUT /api/admin/hero/active`)
- Services: `/api/admin/services` (+ `PATCH .../reorder`)
- Projects: `/api/admin/projects` (+ `PATCH .../reorder`)
- Meta Ads: `/api/admin/meta-ads`
- Testimonials: `/api/admin/testimonials`
- Orders: `/api/admin/orders` (+ `PATCH .../:id/status`)
- Messages: `/api/admin/messages` (+ mark read / mark-all-read)
- Settings: `GET|PUT /api/admin/settings`
- SEO: `/api/admin/seo`
- Blog: `/api/admin/blog`
- Careers: `/api/admin/careers`
- Media: `/api/admin/media` + `POST /api/admin/media/upload` (`multipart/form-data`, field `file`, optional `folder`)

### Order statuses
`pending` · `in_progress` · `completed` · `delivered` · `cancelled`

---

## Response shape

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Storage folders (bucket: `media`)

`heroes/` · `services/` · `projects/` · `testimonials/` · `meta-ads/` · `seo/` · `logos/` · `uploads/`

---

## Example: login + create service

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kodraxelsoft.com","password":"ChangeMeStrongPassword123!"}'

curl -X POST http://localhost:5000/api/admin/services \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Next.js Apps","description":"...","features":["SSR"],"is_enabled":true}'
```

---

## Security notes

- Service role key stays **server-side only**
- RLS allows public read of published content; writes go through this API
- Single-admin DB trigger blocks a second admin row
- Rate limits on `/api` and stricter limit on `/api/auth/login`
