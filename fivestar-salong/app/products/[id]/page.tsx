/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";

// Demo products (for local viewing)
const demoProducts = [
  {
    id: "1",
    name: "Luxury Straight",
    category: "Human Hair",
    price: 120,
    image: "/images/extension1.png",
    description: "Soft and silky straight hair extensions.",
  },
  {
    id: "2",
    name: "Silky Wave",
    category: "Remy Hair",
    price: 140,
    image: "/images/extension2.png",
    description: "Beautiful natural wave texture with shine.",
  },
  {
    id: "3",
    name: "Curly Queen",
    category: "Virgin Hair",
    price: 160,
    image: "/images/extension3.png",
    description: "Bouncy curls that last all day.",
  },
  {
    id: "4",
    name: "Deep Wave",
    category: "Human Hair",
    price: 130,
    image: "/images/extension4.png",
    description: "Lush deep wave pattern with volume.",
  },
];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";

  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);

  // Fetch product info
  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      if (isDemo) {
        const demo = demoProducts.find((p) => p.id === id);
        setProduct(demo);
        return;
      }

      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error loading product:", err);
        setProduct(null);
      }
    };

    loadProduct();
  }, [id, isDemo]);

  // Fetch reviews
  useEffect(() => {
    if (!id || isDemo) return;

    const fetchReviews = async () => {
      const res = await fetch(`/api/reviews/${id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    };

    fetchReviews();
  }, [id, isDemo]);

  // Submit review (stored pending admin approval)
  const submitReview = async () => {
    if (!newReview.trim() || isDemo || rating < 1) return;

    const res = await fetch(`/api/reviews/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newReview, rating }),
    });

    if (res.ok) {
      setNewReview("");
      setRating(0);
      const updated = await fetch(`/api/reviews/${id}`);
      setReviews(await updated.json());
    }
  };

  if (!product) return <main className="pt-40 text-center">Loading...</main>;

  return (
    <main className="bg-white text-black pt-40 pb-20">
      {/* Product Info */}
      <section className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div className="relative w-full aspect-[3/4] overflow-hidden border border-gray-200 shadow-sm">
          <Image
            src={product.image || "/images/extension1.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
          <p className="text-lg text-gray-600 mb-2">{product.category}</p>
          <p className="text-sm text-gray-500 mb-4">{product.description}</p>
          <p className="text-xl font-bold mb-6">${product.price}</p>

          <div className="flex flex-col gap-3">
            <button
              className="bg-[#800020] text-white px-6 py-2 uppercase text-sm hover:bg-[#660018] transition"
              onClick={() => addToCart(product)}
            >
              Buy Now
            </button>
            <button
              className="border border-[#800020] text-[#800020] px-6 py-2 uppercase text-sm hover:bg-[#660018] hover:text-white transition"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {!isDemo && (
        <section className="container mx-auto px-6 mt-20">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Customer Reviews
          </h2>

          {reviews.length === 0 && (
            <p className="text-center">No reviews yet.</p>
          )}

          <div className="space-y-4 max-w-2xl mx-auto">
            {reviews.map((r, i) => (
              <div key={i} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span
                      key={starIndex}
                      className={
                        starIndex < r.rating ? "text-yellow-500" : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p>{r.text}</p>
                <span className="text-sm text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>

          {/* Review Form */}
          <div className="mt-10 max-w-2xl mx-auto">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write a review..."
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            <div className="flex justify-center mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className={`text-2xl ${
                    i < rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <button
              onClick={submitReview}
              className="mt-4 bg-[#800020] text-white px-6 py-2 rounded-lg hover:bg-[#660018] transition"
            >
              Submit Review
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
