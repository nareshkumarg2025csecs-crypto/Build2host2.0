import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Instrument_Serif, Inter_Tight, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { Providers } from "@/components/layout/Providers";

const transcity = localFont({
  src: "../public/fonts/Transcity.otf",
  variable: "--font-transcity",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const interTight = Inter_Tight({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const geistMono = Geist_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "built2host — Websites and Real Estate Automation",
    template: "%s | built2host",
  },
  description:
    "built2host is a freelance studio that builds fast, secure, search-ready websites and real estate automations. Fixed prices. Honest scope.",
  keywords: [
    "website design",
    "web development",
    "real estate automation",
    "WhatsApp automation",
    "lead capture",
    "built2host",
  ],
  authors: [{ name: "built2host", url: SITE.url }],
  creator: "built2host",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: "built2host — Websites and Real Estate Automation",
    description:
      "Fast, secure, search-ready websites and real estate automations at honest, fixed prices.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "built2host",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "built2host — Websites and Real Estate Automation",
    description:
      "Fast, secure, search-ready websites and real estate automations at honest, fixed prices.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E60000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo-lockup.png`,
    email: SITE.commonEmail,
    tagline: "You imagine it. We build it.",
    description:
      "A boutique freelance studio specializing in fast, secure, search-ready websites and real estate automations.",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+${SITE.websiteDivision.whatsapp}`,
        contactType: "Website Division Sales & Support",
        email: SITE.websiteDivision.email,
        availableLanguage: ["English", "Tamil"],
      },
      {
        "@type": "ContactPoint",
        telephone: `+${SITE.automationDivision.whatsapp}`,
        contactType: "Real Estate Automation Sales & Support",
        email: SITE.automationDivision.email,
        availableLanguage: ["English", "Tamil"],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${transcity.variable} ${instrumentSerif.variable} ${interTight.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
