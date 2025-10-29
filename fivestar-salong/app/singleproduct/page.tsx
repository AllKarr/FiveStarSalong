import Image from "next/image";
import Link from "next/link";

export default function SingleProductPage() {
  const similarProducts = [
    { id: 1, name: "Similar Product 1", category: "Category", price: "Price" },
    { id: 2, name: "Similar Product 2", category: "Category", price: "Price" },
    { id: 3, name: "Similar Product 3", category: "Category", price: "Price" },
    { id: 4, name: "Similar Product 4", category: "Category", price: "Price" },
  ];

  return (
    <main className="bg-white text-black pt-40 pb-20">
      <section className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden border border-gray-200 shadow-sm">
          <Image
            src="/images/extension1.png"
            alt="Product Image"
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-semibold mb-4">Name</h1>
          <p className="text-lg text-gray-600 mb-2">Category</p>
          <p className="text-sm text-gray-500 mb-4">Description of the product goes here. It includes brief info about the product, materials, or features.</p>
          <p className="text-xl font-bold mb-6">Price</p>

          <div className="flex flex-col gap-3">
            <button className="bg-[#800020] text-white px-6 py-2 uppercase text-sm hover:bg-[#660018] transition">
              Buy Now
            </button>
            <button className="border border-[#800020] text-[#800020] px-6 py-2 uppercase text-sm hover:bg-[#660018] hover:text-white transition">
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      {/* Similar Products */}
      <section className="container mx-auto px-6 mt-20">
        <h2 className="text-2xl font-semibold text-center mb-10">Similar Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {similarProducts.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/extension1.png"
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="bg-white w-full py-3">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-sm mt-1">{item.price}</p>

                <Link
                  href="/singleproduct"
                  className="block mt-3 bg-[#800020] text-white px-6 py-1 uppercase text-sm hover:bg-[#660018] transition"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
