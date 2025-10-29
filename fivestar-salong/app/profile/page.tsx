"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    email: session?.user?.email || "",
    name: "",
    surname: "",
    currentPassword: "",
    newPassword: "",
  });

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

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <main className="bg-white min-h-screen text-center pt-40 pb-20">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
      <p className="text-gray-700 mb-6">{session.user?.name}</p>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Order History */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Order History</h2>
          <input
            type="text"
            placeholder="Order_id_1"
            className="w-full border border-black px-2 py-1 text-sm mb-3"
          />
          <button className="w-full bg-[#660018] text-white py-1 text-sm font-semibold hover:bg-[#800020] transition">
            Manage
          </button>
        </section>

        {/* Account Settings */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-black px-2 py-1 text-sm focus:outline-none"
            />
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-black px-2 py-1 text-sm focus:outline-none"
            />
            <input
              name="surname"
              type="text"
              placeholder="Surname"
              value={form.surname}
              onChange={handleChange}
              className="w-full border border-black px-2 py-1 text-sm focus:outline-none"
            />
            <input
              name="currentPassword"
              type="password"
              placeholder="Current Password"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full border border-black px-2 py-1 text-sm focus:outline-none"
            />
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border border-black px-2 py-1 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-[#660018] text-white py-1 text-sm font-semibold hover:bg-[#800020] transition"
            >
              Manage
            </button>
          </form>
        </section>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-10 bg-gray-800 text-white px-4 py-1 text-sm rounded hover:bg-gray-900"
      >
        Logout
      </button>
    </main>
  );
}
