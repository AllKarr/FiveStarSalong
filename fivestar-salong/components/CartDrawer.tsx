"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeFromCart, increaseQty, decreaseQty, total } = useCart();

  // Close drawer on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeCart]);

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Background overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      ></div>

      {/* Drawer panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[400px] bg-[#d9d9d9]/95 text-black shadow-[0_0_30px_rgba(0,0,0,0.6)] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#660018]">
          <h2 className="text-xl tracking-wide font-semibold text-[#222]">Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-lg hover:text-black transition"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-sm h-[calc(100%-160px)]">
          {items.length === 0 ? (
            <p className="text-center text-gray-700 tracking-widest mt-20">
              YOUR CART IS EMPTY
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-[#660018]/50 pb-4 items-start"
              >
                {/* Product image */}
                {item.image ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#660018]/40">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded-lg">
                    No Image
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 text-left">
                  <p className="font-medium text-base">{item.name}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="border border-[#660018] px-2 text-sm font-bold rounded hover:bg-black hover:text-white transition"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="border border-[#660018] px-2 text-sm font-bold rounded hover:bg-black hover:text-white transition"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-sm text-[#222]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="border border-black text-xs px-3 py-1 rounded hover:bg-black hover:text-white transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#660018] p-6 mt-auto bg-[#000]/10 backdrop-blur-md">
          <button
            disabled={items.length === 0}
            className={`w-full py-3 font-semibold text-sm uppercase rounded transition tracking-wide ${
              items.length === 0
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-[#660018] text-white hover:bg-black"
            }`}
          >
            Checkout – ${total.toFixed(2)}
          </button>
        </div>
      </aside>
    </div>
  );
}
