import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContentSection from "./components/ContentSection";
import Features from "./components/Features";
import Product from "./components/Product";
import Process from "./components/Process";
import Stats from "./components/Stats";
import FAQ from "./components/FAQ";
import Pricing from "./components/Pricing";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of businesses does Era Engines work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We work with startups, small and medium businesses, large enterprises, healthcare organizations, educational institutions, government bodies, and entrepreneurs with software ideas. If you need software built, we can help.",
      },
    },
    {
      "@type": "Question",
      name: "What technologies does Era Engines use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We work across modern technology stacks — React, Next.js, Node.js, Python, Flutter, React Native, and more. We choose the right tools for your specific project, not the ones we happen to know best.",
      },
    },
    {
      "@type": "Question",
      name: "How does pricing work for custom projects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because every project is unique, we scope and quote based on your specific goals after an initial discovery conversation. No one-size-fits-all pricing — you pay for what your project actually needs.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer support after launch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every project includes a post-launch support window, and most clients move into an ongoing maintenance, support, or consulting arrangement. We stay involved as your long-term technical partner.",
      },
    },
    {
      "@type": "Question",
      name: "Can you integrate AI into our existing systems?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. AI integration and business automation is one of our core services. We can add intelligent features to your existing products or build new AI-powered solutions from scratch.",
      },
    },
    {
      "@type": "Question",
      name: "Do you work with clients outside the Middle East and Africa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "While our vision is to become a leading software company in the MEA region, we work with clients globally. Great software has no borders.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main>
        <Hero />

        <ContentSection variant="about" imageSide="right" />

        <Features />

        <Product />

        <Process />

        <ContentSection variant="values" imageSide="left" />

        <Stats />

        <FAQ />

        <Pricing />

        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
