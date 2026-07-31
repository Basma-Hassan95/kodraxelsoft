# API Reference — Kodraxelsoft CMS

Base URL: `http://localhost:5000/api`

All successful responses:

```json
{ "success": true, "message": "...", "data": {}, "meta": {} }
```

All errors:

```json
{ "success": false, "message": "...", "errors": [{ "field": "...", "message": "..." }] }
```

## Auth

### Login
`POST /auth/login`

```json
{ "email": "admin@kodraxelsoft.com", "password": "..." }
```

### Bootstrap (once)
`POST /auth/bootstrap`

```json
{ "name": "Admin", "email": "admin@kodraxelsoft.com", "password": "min8chars" }
```

## Hero

**Public:** `GET /public/hero`  
**Admin:**  
- `GET /admin/hero`
- `PUT /admin/hero/active` — create/update active hero
- `POST /admin/hero`
- `PUT /admin/hero/:id`
- `DELETE /admin/hero/:id`

Body:

```json
{
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "badge_text": "string",
  "highlight_text": "string",
  "cta_buttons": [{ "label": "Start", "href": "/contact", "variant": "primary" }],
  "background_image": "https://...",
  "hero_image": "https://...",
  "is_active": true
}
```

## Services

**Public:** `GET /public/services`  
**Admin CRUD:** `/admin/services`  
**Reorder:** `PATCH /admin/services/reorder` `{ "items": [{ "id": "uuid", "display_order": 0 }] }`

## Projects

**Public:** `GET /public/projects?is_featured=true`  
**Admin CRUD:** `/admin/projects`  
Statuses: `draft` | `published` | `archived`

## Meta Ads

**Public:** `GET /public/meta-ads`  
**Admin CRUD:** `/admin/meta-ads`  
Statuses: `active` | `inactive` | `draft`

## Testimonials

**Public:** `GET /public/testimonials`  
**Admin CRUD:** `/admin/testimonials`

## Orders

**Public create:** `POST /public/orders`  
**Admin:**  
- `GET /admin/orders?search=&status=pending&page=1`
- `PATCH /admin/orders/:id/status` `{ "status": "in_progress" }`
- `PUT /admin/orders/:id`
- `DELETE /admin/orders/:id`

Statuses: `pending` | `in_progress` | `completed` | `delivered` | `cancelled`

## Contact Messages

**Public:** `POST /public/contact`  
**Admin:**  
- `GET /admin/messages?search=&is_read=false`
- `PATCH /admin/messages/:id/read`
- `PATCH /admin/messages/mark-all-read`
- `DELETE /admin/messages/:id`

## Settings / SEO / Media / Dashboard

- `GET|PUT /admin/settings`
- `GET /public/settings`
- `GET|POST /admin/seo` · `GET /public/seo/:pageKey`
- `POST /admin/media/upload` multipart `file` + optional `folder`
- `GET /admin/dashboard`

## Audience / Visitors

Public track (frontend should call on every page visit):

`POST /public/analytics/visit`

```json
{
  "session_id": "optional-browser-session-id",
  "page_path": "/",
  "page_title": "Home",
  "referrer": "https://google.com"
}
```

Admin:

- `GET /admin/analytics` — summary + daily chart + top pages + recent visits
- `GET /admin/analytics/summary`
- `GET /admin/analytics/visits?page=1&search=`
- `GET /admin/analytics/top-pages`
- `GET /admin/analytics/daily?days=30`
- `GET /admin/dashboard/inbox` — unread messages + pending reviews + today audience

## Public Reviews

`POST /public/reviews` — visitor submits review (pending until admin approves)

`PATCH /admin/testimonials/:id/moderate` `{ "approve": true }`
