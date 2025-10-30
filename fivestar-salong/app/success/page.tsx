"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      // Optionally verify with backend if needed
      queueMicrotask(() => setShowModal(true));
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-center">
      {showModal ? (
        <div className="p-8 bg-green-100 rounded-2xl shadow-lg border border-primary">
          <h1 className="text-2xl font-bold text-primary">
            Payment Complete!
          </h1>
          <p className="text-gray-700 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
            <Link
            href="/"
            className="inline-block bg-[#660018] text-white px-6 py-2 rounded-lg hover:bg-black transition"
            >
            Continue Shopping
            </Link>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
