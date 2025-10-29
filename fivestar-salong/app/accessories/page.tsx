"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function AccessoriesPage() {
  const { addToCart } = useCart();

  const accessories = [
    { id: "1", name: "Name", category: "Category", price: 90 },
    { id: "2", name: "Name", category: "Category", price: 110 },
    { id: "3", name: "Name", category: "Category", price: 95 },
    { id: "4", name: "Name", category: "Category", price: 105 },
    { id: "5", name: "Name", category: "Category", price: 115 },
    { id: "6", name: "Name", category: "Category", price: 80 },
    { id: "7", name: "Name", category: "Category", price: 75 },
    { id: "8", name: "Name", category: "Category", price: 100 },
  ];

  return (
    <main className="bg-white text-black pt-40 pb-20">
      <section className="container mx-auto px-6">
        <h1 className="text-3xl font-semibold text-center mb-10 uppercase">
          Accessories
        </h1>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search accessories..."
            className="w-full md:w-2/3 border-b border-black text-center py-2 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {accessories.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center border border-gray-200 shadow-sm hover:shadow-md transition relative bg-white"
            >
              {/* Clickable image only */}
              <Link
                href="/singleproduct"
                className="relative w-full aspect-[3/4] overflow-hidden block"
              >
                <div className="absolute top-2 right-2 bg-[#800020] text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                  20% OFF
                </div>

                <Image
                  src="/images/accessories1.jpg"
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </Link>

              <div className="bg-white w-full py-3 px-2">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-sm mt-1">${item.price}</p>

                {/* Buttons */}
                <div className="flex flex-col items-center gap-2 mt-3">
                  <button
                    className="bg-[#800020] text-white px-6 py-1 uppercase text-sm hover:bg-[#660018] transition"
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: "/images/accessories1.jpg",
                      })
                    }
                  >
                    Buy Now
                  </button>

                  <button
                    className="border border-[#800020] text-[#800020] px-6 py-1 uppercase text-sm hover:bg-[#660018] hover:text-white transition"
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: "/images/accessories1.jpg",
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
      </section>
    </main>
  );
}
