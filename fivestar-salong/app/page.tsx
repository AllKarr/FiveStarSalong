import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import ReviewSection from "@/components/ReviewSection";
import FAQSection from "@/components/FAQSection";
import InstagramGallery from "@/components/InstagramGallery";

export default function Home() {
  return (
    <main className="pt-[130px]"> {/* Offset for fixed header */}
      <HeroSection />
      <ProductSection />
      <ReviewSection />
      <FAQSection />
      <InstagramGallery />
    </main>
  );
}
