import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://eraengines.vercel.app";
const SITE_NAME = "Era Engines";
const DEFAULT_DESCRIPTION =
  "Era Engines is a full-service software company specializing in custom software development, web & mobile applications, SaaS platforms, enterprise systems, AI integration, and cloud solutions for startups, SMEs, and large enterprises across the Middle East and Africa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Era Engines | Custom Software Development Company",
    template: "%s | Era Engines",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "custom software development",
    "web application development",
    "mobile app development",
    "SaaS product development",
    "enterprise software",
    "AI integration",
    "cloud solutions",
    "UI/UX design",
    "business management systems",
    "ERP development",
    "CRM development",
    "Middle East software company",
    "Africa software company",
    "API development",
    "technical consulting",
  ],
  authors: [{ name: "Era Engines" }],
  creator: "Era Engines",
  publisher: "Era Engines",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Era Engines | Custom Software Development Company",
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 800,
        alt: "Era Engines - Custom Software Development Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Era Engines | Custom Software Development Company",
    description: DEFAULT_DESCRIPTION,
    images: ["/favicon.ico"],
    creator: "@eraengines",
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
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Era Engines",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description: DEFAULT_DESCRIPTION,
    foundingDate: "2024",
    sameAs: [
      "https://facebook.com/eraengines",
      "https://instagram.com/eraengines",
      "https://linkedin.com/company/eraengines",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: ["English", "Arabic"],
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Middle East",
      },
      {
        "@type": "Country",
        name: "Africa",
      },
    ],
    knowsAbout: [
      "Custom Software Development",
      "Web Application Development",
      "Mobile Application Development",
      "SaaS Product Development",
      "Enterprise Software",
      "AI Integration",
      "Cloud Solutions",
      "UI/UX Design",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Era Engines",
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: "Era Engines",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Era Engines",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description: DEFAULT_DESCRIPTION,
    serviceType: [
      "Custom Software Development",
      "Web Application Development",
      "Mobile Application Development",
      "SaaS Product Development",
      "Enterprise Software",
      "AI Integration",
      "Cloud Solutions",
      "UI/UX Design",
    ],
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 30.0444,
        longitude: 31.2357,
      },
      geoRadius: "5000km",
    },
  };

  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0b0b0d] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
