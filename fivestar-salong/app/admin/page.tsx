/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function AdminPage() {
  const { data: session } = useSession();

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
  });

  const categories = [
    { value: "extensions", label: "Extensions" },
    { value: "bundles", label: "Bundles" },
    { value: "hairproducts", label: "Hair Products" },
    { value: "accessories", label: "Accessories" },
    { value: "misc", label: "Misc" },
  ];

  const headers = { "Content-Type": "application/json" };

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, productsRes, reviewsRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/products"),
        fetch("/api/admin/reviews"),
      ]);
      setOrders(await ordersRes.json());
      setProducts(await productsRes.json());
      setReviews(await reviewsRes.json());
    };
    fetchData();
  }, []);

  // IMAGE UPLOAD HANDLER
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setNewProduct({ ...newProduct, image: data.url });
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // PRODUCT CRUD
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category) {
      alert("Please enter a product name and category.");
      return;
    }

    await fetch("/api/products", {
      method: "POST",
      headers,
      body: JSON.stringify(newProduct),
    });

    setNewProduct({
      name: "",
      category: "",
      description: "",
      price: 0,
      stock: 0,
      image: "",
    });
    refreshProducts();
  };

  const editProduct = async (productId: string, updates: any) => {
    await fetch("/api/products", {
      method: "PUT",
      headers,
      body: JSON.stringify({ productId, updates }),
    });
    refreshProducts();
  };

  const deleteProduct = async (productId: string) => {
    await fetch("/api/products", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ productId }),
    });
    refreshProducts();
  };

  const refreshProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };

  // ORDER ACTIONS
  const handleOrderAction = async (orderId: string, action: string) => {
    await fetch("/api/admin/orders", {
      method: "POST",
      headers,
      body: JSON.stringify({ orderId, action }),
    });
    refreshOrders();
  };

  const refreshOrders = async () => {
    const res = await fetch("/api/admin/orders");
    setOrders(await res.json());
  };

  // REVIEW ACTIONS
  const handleReviewAction = async (action: string, reviewId?: string, data?: any) => {
    await fetch("/api/admin/reviews", {
      method: "POST",
      headers,
      body: JSON.stringify({ action, reviewId, data }),
    });
    refreshReviews();
  };

  const editReview = async (reviewId: string, updates: any) => {
    await fetch("/api/admin/reviews", {
      method: "PUT",
      headers,
      body: JSON.stringify({ reviewId, updates }),
    });
    refreshReviews();
  };

  const refreshReviews = async () => {
    const res = await fetch("/api/admin/reviews");
    setReviews(await res.json());
  };

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-start mt-10 pt-24 pb-20 px-4">
      {/* Header Section */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          Welcome, {session?.user?.name || "Admin"}
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-900 w-full sm:w-auto"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* PRODUCTS */}
        <section className="border border-gray-300 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Products</h2>

          {/* Add Product Form */}
          <div className="flex flex-col gap-3 mb-6">
            <input
              type="text"
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full text-sm"
            />

            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full text-sm"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full text-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Price (e.g. 29.99)"
                value={newProduct.price || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: Number(e.target.value) })
                }
                className="border border-gray-300 rounded p-2 text-sm"
              />

              <input
                type="number"
                placeholder="Stock quantity (e.g. 50)"
                value={newProduct.stock || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                }
                className="border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border border-gray-300 rounded p-2 text-sm"
            />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            {newProduct.image && (
              <Image
                src={newProduct.image}
                alt="Preview"
                width={100}
                height={100}
                className="rounded-md mt-2 object-cover"
              />
            )}

            <button
              onClick={addProduct}
              className="bg-[#660018] text-white px-6 py-2 rounded-xl hover:bg-[#800020] transition"
            >
              Add Product
            </button>
          </div>

          {/* Product List */}
          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {products.length === 0 && <p className="text-sm text-gray-600">No products found.</p>}
            {products.map((product: any) => (
              <div
                key={product._id}
                className="flex flex-col border border-gray-200 p-3 rounded-lg shadow-sm"
              >
                <span className="font-medium text-sm">{product.name}</span>
                <span className="text-xs text-gray-600">
                  {product.category} — ${product.price}
                </span>
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded mt-2 object-cover"
                  />
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => editProduct(product._id, { price: product.price + 5 })}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ORDERS */}
        <section className="border border-gray-300 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          {orders.length === 0 && <p className="text-sm text-gray-600">No orders found</p>}
          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col border border-gray-200 p-3 rounded-lg shadow-sm"
              >
                <span className="text-sm font-medium">Order ID: {order._id}</span>
                <span className="text-xs text-gray-600">Status: {order.status}</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => handleOrderAction(order._id, "complete")}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleOrderAction(order._id, "incomplete")}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleOrderAction(order._id, "refund")}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Refund
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section className="border border-gray-300 rounded-2xl p-5 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          {reviews.length === 0 && <p className="text-sm text-gray-600">No reviews found</p>}
          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="flex flex-col border border-gray-200 p-3 rounded-lg shadow-sm"
              >
                <p className="text-sm">{review.text}</p>
                <span className="text-xs text-gray-500">
                  {review.approved ? "Approved" : "Pending"}
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {!review.approved && (
                    <button
                      onClick={() => handleReviewAction("approve", review._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => editReview(review._id, { text: review.text + " (edited)" })}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleReviewAction("delete", review._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
