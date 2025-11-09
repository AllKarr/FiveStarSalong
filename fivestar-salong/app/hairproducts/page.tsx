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
}

export default function HairProductsPage() {
  const { addToCart } = useCart();
  const [hairProducts, setHairProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products?category=hairproducts");
      const data = await res.json();
      setHairProducts(data);
    }
    fetchProducts();
  }, []);

  const filteredHairProducts = hairProducts.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="bg-white text-black pt-40 pb-20">
      {/* Banner */}
      <section className="bg-[#800020] text-white text-center py-6 mb-12">
        <h2 className="text-3xl font-bold uppercase">
          20% Off All Hair Products
        </h2>
        <p className="text-sm mt-2">
          Limited time offer on shampoos, conditioners & oils!
        </p>
      </section>

      <section className="container mx-auto px-6">
        <h1 className="text-3xl font-semibold text-center mb-10 uppercase">
          Hair Products
        </h1>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search hair products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-2/3 border-b border-black text-center py-2 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {filteredHairProducts.length > 0 ? (
            filteredHairProducts.map((item) => (
              <div
                key={item._id}
                className="flex flex-col items-center text-center border border-gray-200 shadow-sm hover:shadow-md transition bg-white rounded-lg overflow-hidden"
              >
                <Link
                  href={`/products/${item._id}`}
                  className="relative w-full aspect-[3/4] overflow-hidden"
                >
                  <div className="absolute top-2 right-2 bg-[#800020] text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                    SALE
                  </div>
                  <Image
                    src={item.image || "/images/shampoo1.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div className="bg-white w-full py-3">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-sm mt-1 font-medium">${item.price}</p>

                  <div
                    className="flex flex-col items-center gap-2 mt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="bg-[#800020] text-white px-6 py-1 uppercase text-sm rounded hover:bg-[#660018] transition"
                      onClick={() =>
                        addToCart({
                          id: item._id,
                          name: item.name,
                          price: item.price,
                          image: item.image || "/images/shampoo1.jpg",
                        })
                      }
                    >
                      Buy Now
                    </button>
                    <button
                      className="border border-[#800020] text-[#800020] px-6 py-1 uppercase text-sm rounded hover:bg-[#660018] hover:text-white transition"
                      onClick={() =>
                        addToCart({
                          id: item._id,
                          name: item.name,
                          price: item.price,
                          image: item.image || "/images/shampoo1.jpg",
                        })
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No hair products found.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
