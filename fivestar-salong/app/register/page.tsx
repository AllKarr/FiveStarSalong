"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      console.error(data.errors);
      return;
    }

    alert("Registration successful!");
    window.location.href = "/login";
  };

  return (
    <main className="pt-80 pb-20 bg-white text-center min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Register</h1>
      <p className="text-xs text-gray-600 mb-6">
        Enter the following information
      </p>

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3">
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
          Register
        </button>
      </form>

      <p className="text-xs text-gray-700 mt-3">
        Already a member?{" "}
        <Link href="/login" className="text-[#660018] hover:underline">
          Login Here
        </Link>
      </p>
    </main>
  );
}
