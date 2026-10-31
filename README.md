# built2host

> Flagship studio website and portfolio for **built2host** (`built2host.in`) — a boutique freelance studio building fast, secure, search-ready websites and real-estate automation.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling:** Tailwind CSS v4, `@tailwindcss/postcss`
- **Typography:** Transcity OTF (`next/font/local`), Instrument Serif, Inter Tight, Geist Mono (`next/font/google`)
- **Animation & Interactions:** `framer-motion` (`motion/react`), Lenis smooth scrolling, Aceternity / Radix UI patterns
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production & verify compilation
npm run build

# 4. Start production server
npm run start
```

---

## Environment Variables

Copy `.env.example` to `.env.local` to configure environment variables:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `RESEND_API_KEY` | Resend API key for emailing enquiry submissions. If omitted, submissions log to console and succeed cleanly. | Optional |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain for metadata and sitemap generation. | `https://built2host.in` |

---

## Where to Edit Content & Data

All brand constants, pricing, and project portfolios are stored in single source-of-truth files:

- **Contacts & Brand Info:** [`lib/site.ts`](lib/site.ts)
  - Common email (`build2host@gmail.com`), Websites phone/WhatsApp/email, Automation phone/WhatsApp/email.
- **Projects Portfolio:** [`data/projects.ts`](data/projects.ts)
  - Showcase project cards, client summaries, tags, and live URLs.
- **Websites Packages:** [`data/websites.ts`](data/websites.ts)
  - Starter, Business, and Premium packages, pricing, deliverables, add-ons, and maintenance tiers.
- **Automation Packages:** [`data/automation.ts`](data/automation.ts)
  - Automation services, workflow steps, and deliverables.

---

## Typography & Licensing

- **Transcity OTF** (`public/fonts/Transcity.otf`) provides custom lettering for uppercase display headings (`Websites`, `Automation`, `Selected Work`).
- Numbers, currency symbols (₹), and punctuation automatically cascade to **Instrument Serif**.
