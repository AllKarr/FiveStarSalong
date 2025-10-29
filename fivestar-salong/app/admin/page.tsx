"use client";
import { useSession } from "next-auth/react";

export default function AdminPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-start pt-32">
      <h1 className="text-3xl font-bold mb-8">
        Welcome {session?.user?.name || "Admin"}
      </h1>

      <div className="grid grid-cols-2 gap-10 max-w-4xl w-full">
        <section className="border border-gray-300 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          <input
            type="text"
            placeholder="Order_id_1"
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <input
            type="text"
            placeholder="Order_id_2"
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <button className="bg-[#660018] text-white px-6 py-2 rounded-xl hover:bg-[#800020]">
            Manage
          </button>
        </section>

        <section className="border border-gray-300 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <input
            type="text"
            placeholder="User_id_1"
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <input
            type="text"
            placeholder="User_id_2"
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <button className="bg-[#660018] text-white px-6 py-2 rounded-xl hover:bg-[#800020]">
            Manage
          </button>
        </section>

        <section className="border border-gray-300 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          <input
            type="text"
            placeholder="Review_id_1"
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <input
            type="text"
            placeholder="Review_id_2"
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <button className="bg-[#660018] text-white px-6 py-2 rounded-xl hover:bg-[#800020]">
            Manage
          </button>
        </section>

        <section className="border border-gray-300 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <input
            type="text"
            placeholder="Product_id_1"
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <input
            type="text"
            placeholder="Product_id_2"
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <button className="bg-[#660018] text-white px-6 py-2 rounded-xl hover:bg-[#800020]">
            Manage
          </button>
        </section>
      </div>
    </main>
  );
}
