"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  rating?: number;
}

export default function ProductSection() {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState("03:00:00");
  const [extensions, setExtensions] = useState<Product[]>([]);

  // Fetch best rated extensions from DB
  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products?category=extensions");
      const data = await res.json();
      setExtensions(data.slice(0, 4)); // top 4
    }
    fetchProducts();
  }, []);

  // Countdown Timer
  useEffect(() => {
    let totalSeconds = 3 * 60 * 60;
    const timer = setInterval(() => {
      totalSeconds--;
      if (totalSeconds <= 0) {
        clearInterval(timer);
        setTimeLeft("00:00:00");
      } else {
        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const s = String(totalSeconds % 60).padStart(2, "0");
        setTimeLeft(`${h}:${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white text-black pb-16">
      {/* === DISCOUNT BANNER === */}
      <div className="relative bg-[#800020] text-white overflow-hidden mt-8 rounded-lg mx-4 shadow-md">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/discount-bg.jpg" alt="discount background" fill className="object-cover" />
        </div>

        <div className="relative max-w-[1000px] mx-auto px-6 py-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase mb-2">
            20% Off All Hair Products
          </h2>
          <p className="text-base sm:text-lg mb-4 opacity-90">
            Limited-time offer — shop now before it’s gone!
          </p>
          <div className="text-2xl font-bold mb-5">
            Offer ends in <span className="text-yellow-300">{timeLeft}</span>
          </div>

          <Link
            href="/hairproducts"
            className="bg-white text-[#800020] px-5 py-2 rounded-full text-sm sm:text-base font-semibold uppercase hover:bg-[#f8eaea] transition"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* === BEST RATED EXTENSIONS === */}
      <div className="max-w-[1400px] mx-auto px-4 mt-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#800020] mb-12">
          Our Best Rated Extensions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {extensions.map((product) => (
            <div
              key={product._id}
              className="flex flex-col items-center text-center border border-gray-200 shadow-sm hover:shadow-md transition bg-white rounded-lg overflow-hidden"
            >
              <Link
                href={`/products/${product._id}`}
                className="relative w-full aspect-[3/4] overflow-hidden block"
              >
                <Image
                  src={product.image || "/images/extension1.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </Link>

              <div className="bg-white w-full py-3 px-2">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-sm mt-1 font-medium">${product.price}</p>

                <div className="flex flex-col items-center gap-2 mt-3">
                  <button
                    className="bg-[#800020] text-white px-6 py-1 uppercase text-sm rounded hover:bg-[#660018] transition"
                    onClick={() =>
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image || "/images/extension1.png",
                      })
                    }
                  >
                    Buy Now
                  </button>
                  <button
                    className="border border-[#800020] text-[#800020] px-6 py-1 uppercase text-sm rounded hover:bg-[#660018] hover:text-white transition"
                    onClick={() =>
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image || "/images/extension1.png",
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === CATEGORY LINKS === */}
        <div className="mt-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-left text-[#800020] mb-8">
            Products & Accessories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/hairproducts"
              className="relative group rounded-lg overflow-hidden shadow-md aspect-[4/3]"
            >
              <Image
                src="/images/product1.jpeg"
                alt="Hair Products"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white text-2xl font-bold">Hair Products</p>
              </div>
            </Link>

            <Link
              href="/accessories"
              className="relative group rounded-lg overflow-hidden shadow-md aspect-[4/3]"
            >
              <Image
                src="/images/accessories.jpg"
                alt="Hair Accessories"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white text-2xl font-bold">Accessories</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
