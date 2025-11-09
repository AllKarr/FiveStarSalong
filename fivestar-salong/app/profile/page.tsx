/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(3);

  const [form, setForm] = useState({
    email: "",
    name: "",
    surname: "",
    currentPassword: "",
    newPassword: "",
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // 1-hour inactivity timer
  const [inactiveSecondsLeft, setInactiveSecondsLeft] = useState(3600);
  const lastActivityRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      setInactiveSecondsLeft(3600);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    intervalRef.current = setInterval(() => {
      setInactiveSecondsLeft(() => {
        const elapsed = Math.floor((Date.now() - lastActivityRef.current) / 1000);
        const newTimeLeft = 3600 - elapsed;

        if (newTimeLeft <= 0) {
          clearInterval(intervalRef.current!);
          signOut({ callbackUrl: "/login" });
          return 0;
        }

        return newTimeLeft;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [status]);

  // Fetch user or admin order history
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          session?.user?.role === "admin" ? "/api/admin/order" : "/api/orders"
        );
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (session?.user?.id) fetchOrders();
  }, [session]);

  // Handle password change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/users/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Password change failed");
      return;
    }

    alert("Password changed successfully");
    setForm({ ...form, currentPassword: "", newPassword: "" });
  };

  // Handle order actions (admin-only)
  const handleOrderAction = async (orderId: string, action: string) => {
    try {
      const res = await fetch("/api/admin/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Action failed");
        return;
      }

      alert(`Order ${action} successfully`);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                status:
                  action === "complete"
                    ? "completed"
                    : action === "refund"
                    ? "refunded"
                    : "pending",
              }
            : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  const minutes = Math.floor(inactiveSecondsLeft / 60);
  const seconds = inactiveSecondsLeft % 60;

  return (
    <main className="bg-white min-h-screen text-center pt-32 pb-20 px-4">
      <h1 className="text-2xl font-bold mb-2">Welcome</h1>
      <p className="text-gray-700 mb-2">{session.user?.name}</p>
      <p className="text-sm text-gray-500 mb-8">
        Auto-logout in {minutes}:{seconds.toString().padStart(2, "0")}
      </p>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">

      {/* --- Order History --- */}
      
      <section className="border border-gray-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Order History</h2>

        {loadingOrders ? (
          <p className="text-sm text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders found.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {orders.slice(0, visibleCount).map((order) => (
                <li key={order._id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">
                        #{order._id.toString().slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.purchasedAt || order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status:{" "}
                        <span
                          className={`capitalize ${
                            order.status === "completed"
                              ? "text-green-600"
                              : order.status === "refunded"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: ${order.totalPrice?.toFixed(2) || order.total?.toFixed(2) || 0}
                      </p>
                    </div>

                    {session.user?.role === "admin" && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleOrderAction(order._id, "complete")}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleOrderAction(order._id, "incomplete")}
                          className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Incomplete
                        </button>
                        <button
                          onClick={() => handleOrderAction(order._id, "refund")}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Refund
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* --- Show More Button --- */}
            {visibleCount < orders.length && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="text-sm text-[#660018] font-semibold hover:underline"
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}
      </section>


        {/* --- Account Settings --- */}
        <section className="border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Account Settings</h2>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded"
            />
            <input
              name="currentPassword"
              type="password"
              placeholder="Current Password"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded"
            />
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded"
            />
            <button
              type="submit"
              className="w-full bg-[#660018] text-white py-2 text-sm font-semibold rounded hover:bg-[#800020] transition"
            >
              Update Password
            </button>
          </form>
        </section>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-10 bg-gray-800 text-white px-5 py-2 rounded text-sm hover:bg-gray-900"
      >
        Logout
      </button>
    </main>
  );
}
