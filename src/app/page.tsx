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

export default function Home() {
  return (
    <>
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
