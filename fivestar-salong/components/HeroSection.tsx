import Image from "next/image";

/**
 * HeroSection
 * Landing section with model images and introduction text.
 */
export default function HeroSection() {
  return (
    <section
      className="relative bg-cover bg-center text-[#f7f7f7]"
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')", // 🔹 same type of bg as discount banner
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-20">
        {/* Text content */}
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            FiveStarSalong
          </h1>
          <p className="mb-8 text-white leading-relaxed text-lg md:text-xl drop-shadow-md">
            At FiveStarSalong, we’re passionate about helping you look and feel your best.
            We offer high-quality hair extensions and products designed to bring out
            your natural beauty with style and confidence.
          </p>
          <a
            href="/about"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-[#660018] transition-colors shadow-md"
          >
            About Us
          </a>
        </div>

        {/* Model images side by side */}
        <div className="mt-12 md:mt-0 flex space-x-6">
          <div className="relative w-[240px] h-[350px] md:w-[450px] md:h-[600px]">
            <Image
              src="/images/hero-model.jpg"
              alt="Model with long hair extensions"
              fill
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="relative w-[240px] h-[350px] md:w-[450px] md:h-[600px] hidden sm:block">
            <Image
              src="/images/hero-model2.jpg"
              alt="Model showcasing hairstyle"
              fill
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
