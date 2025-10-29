/**
 * Footer
 * Includes info bar (delivery, return, payment info) and footer links.
 */
export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* INFO BAR ABOVE FOOTER */}
      <div className="bg-[#660018] text-sm text-center py-3">
        <p>
          Free Delivery in Sweden • Easy Returns • Secure Payments with Klarna
        </p>
      </div>

      {/* MAIN FOOTER CONTENT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-10">
        {/* Customer Support */}
        <div>
          <h3 className="font-bold mb-3 text-white">Customer Support</h3>
          <ul className="space-y-2 text-sm">
            <li>My Order</li>
            <li>Products</li>
            <li>Delivery</li>
            <li>Payment with Klarna</li>
          </ul>
        </div>

        {/* About Section */}
        <div>
          <h3 className="font-bold mb-3 text-white">About Us</h3>
          <p className="text-sm leading-relaxed">
            At FiveStarSalong, we offer the best quality hair extensions and
            haircare products. Customer satisfaction is our top priority.
          </p>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-bold mb-3 text-white">Follow Us</h3>
          <div className="flex gap-4 mt-2 text-sm">
            <a href="#" className="hover:text-gray-300">
              Instagram
            </a>
            <a href="#" className="hover:text-gray-300">
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <p className="text-center text-xs py-4 border-t border-[#99002a]">
        © 2025 FiveStarSalong. All rights reserved.
      </p>
    </footer>
  );
}
