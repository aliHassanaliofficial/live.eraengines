import type { Metadata } from "next";

const EVENT_URL = "https://eraengines.com/events/rotaractsunrise-hiddenpoisons";
const EVENT_SITE_URL = "https://eraengines-hiddenpoisons.vercel.app";

export const metadata: Metadata = {
  title: "The Hidden Poisons - Awareness Seminar",
  description:
    "Join Rotaract Sunrise for The Hidden Poisons, an awareness seminar on the hidden dangers of addiction and substance abuse, featuring Major General Walid ElSisi. Saturday, August 22, 2026, 6:00 PM at Grand Plaza, Alexandria. Reserve your seat.",
  alternates: {
    canonical: EVENT_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: EVENT_URL,
    siteName: "Rotaract Sunrise Club",
    title: "The Hidden Poisons - Awareness Seminar",
    description:
      "An awareness seminar on the hidden dangers of addiction and substance abuse, featuring Major General Walid ElSisi. Saturday, August 22, 2026, 6:00 PM, Grand Plaza, Alexandria.",
    images: [
      {
        url: `${EVENT_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "The Hidden Poisons - Awareness Seminar | Rotaract Sunrise Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Hidden Poisons - Awareness Seminar",
    description:
      "An awareness seminar on the hidden dangers of addiction and substance abuse, featuring Major General Walid ElSisi. August 22, 2026, 6:00 PM, Grand Plaza, Alexandria.",
    images: [`${EVENT_URL}/opengraph-image`],
  },
};

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "The Hidden Poisons - Awareness Seminar",
  description:
    "The Hidden Poisons is an awareness seminar that sheds light on the hidden dangers of addiction and substance abuse, featuring Major General Walid ElSisi. Real stories, practical insights, and powerful discussions to raise awareness and inspire positive change.",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  startDate: "2026-08-22T18:00:00+02:00",
  endDate: "2026-08-22T21:00:00+02:00",
  image: `${EVENT_URL}/opengraph-image`,
  location: {
    "@type": "Place",
    name: "Grand Plaza",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Alexandria",
      addressCountry: "EG",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Rotaract Sunrise Club",
    url: EVENT_SITE_URL,
  },
  performer: {
    "@type": "Person",
    name: "Major General Walid ElSisi",
  },
};

export default function HiddenPoisonsPage() {
  return (
    <div className="fixed inset-0 z-50 h-full w-full overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema).replace(/</g, "\\u003c"),
        }}
      />
      <iframe
        src={EVENT_SITE_URL}
        title="The Hidden Poisons - Awareness Seminar by Rotaract Sunrise Club"
        className="h-full w-full border-0"
        allowFullScreen
        referrerPolicy="no-referrer"
        style={{ overflow: "hidden", display: "block" }}
      />
    </div>
  );
}
