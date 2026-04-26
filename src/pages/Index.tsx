import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ForWhomSection from "@/components/ForWhomSection";
import WhyUsSection from "@/components/WhyUsSection";
import Footer from "@/components/Footer";

// Heavy below-the-fold sections — code-split so the first screen
// renders fast on mobile without waiting for the catalog/forms/FAQ.
const CatalogSection = lazy(() => import("@/components/CatalogSection"));
const RentalIncludesSection = lazy(() => import("@/components/RentalIncludesSection"));
const SelectAndQuoteSection = lazy(() => import("@/components/SelectAndQuoteSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));

const SectionFallback = () => (
  <div className="py-20 md:py-28">
    <div className="container">
      <div className="h-6 w-40 mx-auto rounded bg-muted animate-pulse" />
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ForWhomSection />
        <WhyUsSection />
        <Suspense fallback={<SectionFallback />}>
          <CatalogSection />
          <RentalIncludesSection />
          <SelectAndQuoteSection />
          <ReviewsSection />
          <FAQSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
