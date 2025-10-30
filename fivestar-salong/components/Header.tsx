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
    { href: "/hairproducts", label: "Hair Products" },
    { href: "/accessories", label: "Accessories" },
  ];

  // handle scroll hide/show
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
  const isAdmin = session?.user?.role === "admin";

  const accountLink = isAdmin
    ? "/admin"
    : isLoggedIn
    ? "/profile"
    : "/login";

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top Bar */}
      <div className="bg-black text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wide">
            <span className="text-3xl">5</span>
            <span>SALONG</span>
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-6">
            {/* Account */}
            <Link
              href={accountLink}
              className="flex items-center gap-2 hover:text-gray-200 transition"
              title={isLoggedIn ? "Account" : "Login"}
            >
              {/* simple user icon */}
              <div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-current rounded-full"></div>
              </div>
              {isLoggedIn && (
                <span className="text-sm font-medium">{userName}</span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative hover:text-gray-200 transition"
              aria-label="Open cart"
            >
              <div className="w-6 h-6 border-2 border-current rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 border border-current border-b-0 border-l-0 rotate-45 translate-y-[2px]" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Nav */}
      <div
        className={`bg-[#660018] text-white transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          {/* Desktop nav */}
          <nav className="hidden md:flex gap-10 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative group pb-1 transition-colors"
              >
                {item.label}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#800020] px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block hover:text-[#D4AF37]"
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
