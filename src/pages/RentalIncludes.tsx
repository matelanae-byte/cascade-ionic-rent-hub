import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RentalIncludesSection from "@/components/RentalIncludesSection";

const RentalIncludes = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Header />
    <main className="flex-1">
      <RentalIncludesSection />
    </main>
    <Footer />
  </div>
);

export default RentalIncludes;
