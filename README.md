# DoughArt — Frontend (Public shop)

Public marketing site and eCommerce shop for **DoughArt**.

**Default port:** `3000`

## Prerequisites

- Node.js 20+
- Backend API on port **5000**

## Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Backend URL, no trailing slash (e.g. `http://localhost:5000`) |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL for SEO (default: `https://www.doughart.com`) |
| `NEXT_PUBLIC_WHATSAPP` | No | Legacy optional value. Public WhatsApp uses `src/lib/contact.ts` (`923277707333`) and is not overridden by ENV or Admin settings. |

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Ensure backend `CORS_ORIGIN` includes `http://localhost:3000`.

## Customer eCommerce flow

| Step | Route | Description |
| --- | --- | --- |
| 1 | `/` | Home — hero, categories, gallery |
| 2 | `/cakes/{categorySlug}` | Category grid (e.g. `/cakes/birthday`, `/cakes/all`) |
| 3 | `/cakes/{categorySlug}/{cakeSlug}` | Cake detail — price, Order Now, WhatsApp |
| 4 | `/checkout?cake={cakeSlug}` | Checkout — customer, delivery, Cash on Delivery only |
| 5 | `/order-success/{orderNumber}` | Confirmation — order summary + WhatsApp |

**Custom cakes:** `/custom-cake` — full bespoke order form (not tied to catalog SKU).

**404 pages:** Dedicated not-found UI for invalid category, cake, or order number.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server on port **3000** |
| `npm run build` | Production build |
| `npm run start` | Production server on port **3000** |
| `npm run lint` | ESLint |

## Public API usage

| Endpoint | Used by |
| --- | --- |
| `GET /api/categories/public` | Category nav & pages |
| `GET /api/cakes/public` | Category grids |
| `GET /api/cakes/public/:slug` | Cake detail & checkout prefill |
| `POST /api/orders` | Checkout & custom-cake forms |
| `GET /api/orders/public/:orderNumber` | Order success page |

## Project structure

```text
src/
  app/
    cakes/[slug]/              Category shop
    cakes/[slug]/[cakeSlug]/   Cake detail
    checkout/                  Checkout
    order-success/[orderNumber]/
    custom-cake/               Bespoke orders
  components/
    catalog/                   CakeCard, CategoryNav, ShopEmptyState, ShopNotFound
    layout/                    TopBar, Header, Footer
    sections/                  CheckoutForm, Hero, …
  lib/                         api, catalog, seo, payment, whatsapp
public/images/                 Static assets
```

## SEO

- `lib/seo.ts` — `buildPageMetadata()` for canonical URLs, Open Graph, Twitter cards
- Shop pages indexed; checkout and order success use `noIndex`

## Production

```bash
npm run build
npm run start
```

### Production env

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
NEXT_PUBLIC_WHATSAPP=923277707333
```

Public phone and WhatsApp on the shop come from `src/lib/contact.ts` (`0327 7707333` / `923277707333`). `NEXT_PUBLIC_WHATSAPP` does not override those public links.

Deploy to Vercel, Netlify, or any Node host. Set env vars in the hosting dashboard.

If cake/category images are served from the API (`/uploads/images/...`), configure Next.js `images.remotePatterns` in `next.config.ts` for your API hostname.
