import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContentSection from "./components/ContentSection";
import Features from "./components/Features";
import Product from "./components/Product";
import Testimonials from "./components/Testimonials";
import Stats from "./components/Stats";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <ContentSection
          imageSide="right"
          badge="WHO WE ARE"
          title="More than a vendor. A technology partner."
          description="Era Engines designs and builds custom software for businesses that need more than a vendor. We work alongside your team from the first idea to long after launch — as your hands-on technical partner, delivering world-class software at startup speed."
          image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop&auto=format"
        />

        <Features />

        <Product />

        <Testimonials />

        <ContentSection
          imageSide="left"
          badge="OUR VALUES"
          title="Innovation, Quality, and Trust — in every line of code."
          description="We believe great software starts with understanding the people who use it. Our core values — innovation, transparency, security, and excellence — drive every project we deliver and every relationship we build."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop&auto=format"
        />

        <Stats />

        <FAQ />

        <CTA />

        <Pricing />
      </main>
      <Footer />
    </>
  );
}
