"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useSession } from "next-auth/react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { openCart } = useCart();
  const { data: session, status } = useSession();

  const navItems = [
    { href: "/bundles", label: "Bundles" },
    { href: "/extensions", label: "Extensions" },
    { href: "/products", label: "Products" },
    { href: "/accessories", label: "Accessories" },
  ];

  // Hide nav when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowSticky(false);
      else setShowSticky(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isLoggedIn = status === "authenticated";
  const userName = session?.user?.name?.split(" ")[0] || "Profile";

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* 🔝 Top Bar */}
      <div className="bg-black text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-wide"
          >
            <span className="text-3xl">5</span>
            <span>SALONG</span>
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-6">
            {/* 👤 Profile Icon */}
            <Link
              href={isLoggedIn ? "/profile" : "/login"}
              className="hover:text-gray-200 transition-colors flex items-center gap-2"
              title={isLoggedIn ? "Go to Profile" : "Login"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {/* Show username if logged in */}
              {isLoggedIn && (
                <span className="text-sm font-medium">{userName}</span>
              )}
            </Link>

            {/* 🛒 Cart Icon */}
            <button
              onClick={openCart}
              className="hover:text-gray-200 transition-colors"
              aria-label="Open cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6H18m-6 0a1 1 0 100 2 1 1 0 000-2zm-4 0a1 1 0 100 2 1 1 0 000-2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 🧭 Sticky Navigation */}
      <div
        className={`bg-[#660018] text-white transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative group pb-1 transition-colors duration-200"
              >
                {item.label}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#800020] px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block hover:text-[#D4AF37] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
