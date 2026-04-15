import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ForWhomSection from "@/components/ForWhomSection";
import WhyUsSection from "@/components/WhyUsSection";
import CatalogSection from "@/components/CatalogSection";
import RentalIncludesSection from "@/components/RentalIncludesSection";
import QuickSelectSection from "@/components/QuickSelectSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ForWhomSection />
        <WhyUsSection />
        <CatalogSection />
        <RentalIncludesSection />
        <QuickSelectSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
