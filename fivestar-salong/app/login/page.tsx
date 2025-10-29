"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      alert(res.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <main className="pt-80 pb-20 bg-white text-center min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Login</h1>
      <p className="text-xs text-gray-600 mb-6">Enter your credentials</p>

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-black px-2 py-1 text-sm focus:outline-none"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-black px-2 py-1 text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="w-full bg-[#660018] text-white py-1 text-sm font-semibold hover:bg-[#800020] transition"
        >
          Login
        </button>
      </form>

      <p className="text-xs text-gray-700 mt-3">
        New user?{" "}
        <Link href="/register" className="text-[#660018] hover:underline">
          Register here
        </Link>
      </p>
    </main>
  );
}
