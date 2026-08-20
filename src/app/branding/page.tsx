import type { Metadata } from "next";
import BrandingClient from "./BrandingClient";

const SITE_URL = "https://eraengines.com";
const PAGE_URL = `${SITE_URL}/branding`;

export const metadata: Metadata = {
  title: "Branding Center | Era Engines",
  description:
    "Download high-quality company logos for marketing, presentations, and more. Browse our official branding assets.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Branding Center | Era Engines",
    description:
      "Download high-quality company logos for marketing, presentations, and more.",
  },
};

export default function BrandingPage() {
  return <BrandingClient />;
}
