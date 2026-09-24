# VOLT Store — Demo consumer for the e-commerce API

A Next.js storefront that works as a **demo consumer** for the [E-commerce API](https://github.com/matiasglez/ecommerce-backend): register, login with JWT, browse the sports catalog, filter by category, manage the cart, checkout and pay (demo mode or Mercado Pago).

> **Role in the portfolio:** this is a secondary, demo-only interface. The main project is the **backend API** (Django REST Framework) — its tests, security and architecture are what matters. This storefront exists so anyone can try the API flows visually without touching Swagger.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui components
- SWR (data fetching) with silent JWT refresh

## Setup

1. Clone both repos and start the backend ([see instructions](https://github.com/matiasglez/ecommerce-backend)) with the seed:

   ```bash
   docker compose up
   docker compose run --rm web python manage.py seed_demo
   ```

2. Install and run this app:

   ```bash
   pnpm install
   cp .env.example .env
   pnpm dev
   ```

   Open http://localhost:3000.

## What you can try

1. **Register / Login** — JWT access + refresh (auto-refresh on 401).
2. **Products** — paginated list, filter by category and subcategories.
3. **Cart** — add/remove items with stock validation.
4. **Checkout** — creates the order, shows the reservation countdown, and lets you pay:
   - **Demo mode** (MOCK): instant approval, order becomes `PAID`. Works offline.
   - **Mercado Pago**: opens the MP checkout (needs a valid access token + public webhook URL configured in the backend).
5. **Orders** — history with status badges; expired orders are cancelled and stock is restored.

## Notes

- The UI was initially generated with AI (v0) and then **connected, supervised and adjusted** against the real backend. API client: `lib/api.ts`.
- Interactive API docs (OpenAPI/Swagger) live in the backend: `/api/schema/swagger-ui/`.