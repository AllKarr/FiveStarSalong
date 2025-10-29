import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import ReviewSection from "@/components/ReviewSection";
import FAQSection from "@/components/FAQSection";
import InstagramGallery from "@/components/InstagramGallery";


export default function Home() {
  return (
    <main className="pt-[130px]"> {/* Offset for fixed header */}
      <Header />
      <HeroSection />
      <ProductSection />
      <ReviewSection />
      <FAQSection />
      <InstagramGallery />
    </main>
  );
}
