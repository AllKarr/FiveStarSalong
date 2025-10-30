/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

interface Review {
  _id: string;
  text: string;
  rating: number;
  productId?: string;
  approved?: boolean;
  createdAt?: string;
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();

        // ✅ Filter only approved reviews, newest first
        const approved = data
          .filter((r: Review) => r.approved)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
          );

        setReviews(approved);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const renderStars = (rating: number) =>
    "★".repeat(rating) + "☆".repeat(5 - rating);

  if (loading) {
    return (
      <section className="py-16 bg-[#f7f7f7] text-center">
        <h2 className="text-2xl font-bold mb-8">Loading Reviews...</h2>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 bg-[#f7f7f7] text-center">
        <h2 className="text-2xl font-bold mb-8">No Reviews Yet</h2>
        <p className="text-gray-600 mb-8">Be the first to leave a review!</p>
      </section>
    );
  }

  const topReviews = reviews.slice(0, 3);

  return (
    <section className="py-16 bg-[#f7f7f7] text-center">
      <h2 className="text-2xl font-bold mb-8">Over 1000+ Happy Customers</h2>
      <p className="text-gray-600 mb-8">
        Don’t forget to leave a review of your own!
      </p>

      {/* === Review Cards === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {topReviews.map((r) => (
          <div
            key={r._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-600 italic mb-4">“{r.text}”</p>
            <p className="text-primary text-lg">{renderStars(r.rating)}</p>
            <p className="mt-2 font-semibold text-gray-700">Verified Customer</p>
          </div>
        ))}
      </div>

      {/* === All Reviews Button === */}
      <div className="mt-10">
        <button
          onClick={() => setShowAll(true)}
          className="bg-[#800020] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#660018] transition"
        >
          View All Reviews
        </button>
      </div>

      {/* === Popup Modal === */}
      {showAll && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-lg relative p-6">
            <button
              onClick={() => setShowAll(false)}
              className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-black"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center text-[#800020]">
              All Customer Reviews
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="border p-4 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                >
                  <p className="text-sm text-gray-700 mb-3 italic">“{r.text}”</p>
                  <p className="text-primary mb-1">{renderStars(r.rating)}</p>
                  <p className="text-xs text-gray-500">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
