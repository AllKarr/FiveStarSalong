"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function ProductSection() {
  const { addToCart } = useCart();

  const bestRated = [
    { id: "1", name: "Luxury Straight", category: "Human Hair", price: 120 },
    { id: "2", name: "Silky Wave", category: "Remy Hair", price: 140 },
    { id: "3", name: "Curly Queen", category: "Virgin Hair", price: 160 },
    { id: "4", name: "Deep Wave", category: "Human Hair", price: 130 },
  ];

  return (
    <section className="text-gray-900">
      {/* BEST RATED EXTENSIONS */}
      <div className="py-12 text-center bg-white">
        <h2 className="text-3xl font-bold mb-10 text-[#800020] uppercase">
          Best Rated Extensions
        </h2>

        <div className="mx-auto max-w-[1400px] px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestRated.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center text-center border border-gray-200 shadow-sm hover:shadow-md transition bg-white rounded-lg overflow-hidden"
              >
                {/* Product Image */}
                <Link
                  href="/singleproduct"
                  className="relative w-full aspect-[3/4] overflow-hidden block"
                >
                  <Image
                    src={`/images/extension${item.id}.png`}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Product Info */}
                <div className="bg-white w-full py-4 px-2">
                  <h3 className="font-semibold text-base">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-sm mt-1 font-medium">${item.price}</p>

                  {/* Buttons */}
                  <div
                    className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-3"
                    onClick={(e) => e.stopPropagation()} // prevent link click on button click
                  >
                    <button
                      className="bg-[#800020] text-white px-4 py-1 uppercase text-xs rounded hover:bg-[#660018] transition"
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: `/images/extension${item.id}.png`,
                        })
                      }
                    >
                      Buy Now
                    </button>

                    <button
                      className="border border-[#800020] text-[#800020] px-4 py-1 uppercase text-xs rounded hover:bg-[#660018] hover:text-white transition"
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: `/images/extension${item.id}.png`,
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
        </div>
      </div>

      {/* PRODUCTS & ACCESSORIES */}
      <div className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-left text-[#800020] mb-8">
            Products & Accessories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Products */}
            <Link
              href="/products"
              className="relative group rounded-lg overflow-hidden shadow-md aspect-[4/3] sm:aspect-[5/3]"
            >
              <Image
                src="/images/products.jpg"
                alt="Hair Products"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white text-2xl sm:text-3xl font-bold">
                  Products
                </p>
              </div>
            </Link>

            {/* Accessories */}
            <Link
              href="/accessories"
              className="relative group rounded-lg overflow-hidden shadow-md aspect-[4/3] sm:aspect-[5/3]"
            >
              <Image
                src="/images/accessories.jpg"
                alt="Hair Accessories"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white text-2xl sm:text-3xl font-bold">
                  Accessories
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
