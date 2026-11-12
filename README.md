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

## Enquiry system setup

Follow these steps to configure Firebase Firestore, Authentication, and Gmail SMTP for the enquiry workflow:

### 1. Create Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project named `build2host` (or your chosen project ID).
2. Register a Web App in Project Settings and copy the configuration keys (`apiKey`, `authDomain`, `projectId`, `appId`).

### 2. Enable Firestore & Authentication
1. **Cloud Firestore:** In the left sidebar, navigate to Firestore Database and click **Create Database**.
   - Select database location: **`asia-south1` (Mumbai)**.
   - Start in **Production mode** (all client reads/writes are denied via `firestore.rules`).
2. **Firebase Authentication:** Navigate to Build > Authentication > **Get Started**.
   - Enable the **Email/Password** sign-in method.
   - Under the **Users** tab, click **Add User** and create accounts for your team members (e.g., `owner@built2host.in`, `websites@built2host.in`).

### 3. Generate Service Account Key (Admin SDK)
1. In Firebase Console, go to **Project settings > Service accounts**.
2. Click **Generate new private key** and download the JSON file.
3. Extract three fields:
   - `project_id` &rarr; `FIREBASE_PROJECT_ID`
   - `client_email` &rarr; `FIREBASE_CLIENT_EMAIL`
   - `private_key` &rarr; `FIREBASE_PRIVATE_KEY`
   > **Important:** Never commit the service account JSON key. Store it securely or paste into your environment variables.

### 4. Create Gmail App Password
1. Sign in to your Google Account (the sending Gmail address).
2. Go to **Google Account Settings > Security**.
3. Ensure **2-Step Verification** is enabled.
4. Search for or navigate to **App passwords**.
5. Create a new app password for "built2host mailer".
6. Copy the 16-character password &rarr; `SMTP_APP_PASSWORD`.
7. Your Gmail address &rarr; `SMTP_USER`.

### 5. Configure Environment Variables
Add the variables to `.env.local` for local development, and into **Vercel Project Settings > Environment Variables**:

```bash
NEXT_PUBLIC_SITE_URL=https://built2host.in

# Firebase Client SDK (used only on /admin/login)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=build2host-8af9b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=build2host-8af9b
NEXT_PUBLIC_FIREBASE_APP_ID=1:937902219310:web:...

# Firebase Admin SDK (server-side only)
FIREBASE_PROJECT_ID=build2host-8af9b
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@build2host-8af9b.iam.gserviceaccount.com
# Note: Escape newlines as \n in Vercel or single-line env vars
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgI...\n-----END PRIVATE KEY-----\n"

# Admin Panel Authorization
ADMIN_EMAILS=naresh.kumar.g.2112@gmail.com,ajaysuryawork@gmail.com,build2host@gmail.com
# Role mappings (owner sees all; websites sees only website enquiries; automation sees only automation)
ADMIN_ROLES=naresh.kumar.g.2112@gmail.com:websites,ajaysuryawork@gmail.com:automation,build2host@gmail.com:owner

# Gmail SMTP
SMTP_USER=build2host@gmail.com
SMTP_APP_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_FROM=built2host <build2host@gmail.com>

# IP Rate-Limiting Salt
IP_HASH_SALT=your_random_secret_salt_phrase
```

### 6. Deploy Firestore Security Rules & Indexes
Install Firebase CLI if needed:
```bash
npm install -g firebase-tools
firebase login
firebase use build2host-8af9b
firebase deploy --only firestore:rules,firestore:indexes
```

### 7. How to Test
1. **Test Email Templates & SMTP:**
   ```bash
   npx tsx scripts/send-test-email.ts
   ```
   Or visit `http://localhost:3000/api/dev/test-email` in development.
2. **Submit Live Enquiry:**
   - Go to `/websites/enquiry` or `/automation/enquiry`.
   - Fill in details, submit, and confirm:
     - Reference ID (e.g. `B2H-W-...`) is generated.
     - Document is saved in Firestore `enquiries` collection.
     - Confirmation email arrives to visitor.
     - Team notification arrives to division mailbox.
3. **Admin Dashboard:**
   - Go to `/admin/login`.
   - Sign in with allowlisted email & password.
   - Confirm stats strip, filter by division/status, open detail drawer, change status, save notes, and export CSV.

---

## Typography & Licensing

- **Transcity OTF** (`public/fonts/Transcity.otf`) provides custom lettering for uppercase display headings (`Websites`, `Automation`, `Selected Work`).
- Numbers, currency symbols (₹), and punctuation automatically cascade to **Instrument Serif**.
