"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="bg-white text-black min-h-screen py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-[#800020] mb-10">
          About Us
        </h1>

        {/* Image */}
        <div className="relative w-full h-[300px] sm:h-[400px] mb-10 rounded-lg overflow-hidden shadow-md">
          <Image
            src="/images/hero-bg.jpg"
            alt="FiveStarSalong Team"
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="space-y-6 text-lg leading-relaxed text-gray-800">
          <p>
            Welcome to <strong>FiveStarSalong</strong> — your destination for
            premium hair extensions and hair care products. We’ve worked in the
            beauty industry for over <strong>25 years</strong>, bringing
            expertise and passion to every style we create.
          </p>

          <p>
            Our founder has styled clients across <strong>7 different countries</strong>,
            gaining global experience and insight into the best techniques and
            products from around the world.
          </p>

          <p>
            We believe in testing and using only the highest quality products —
            so <em>you don’t have to</em>. Each product we offer has been handpicked
            and tried by our team to ensure it meets the highest standards for
            quality, safety, and results.
          </p>

          <p>
            Based in <strong>Stockholm, Sweden</strong>, we’re proud to bring you
            a curated collection of extensions, hair products, and accessories
            tailored to your needs. Our goal is simple: to help you feel
            confident, beautiful, and completely yourself.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a
            href="/extensions"
            className="inline-block bg-[#800020] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#660018] transition-colors shadow-md"
          >
            Shop Our Collection
          </a>
        </div>
      </div>
    </section>
  );
}
