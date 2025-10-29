/**
 * ReviewSection
 * Displays customer testimonials with star ratings.
 */
export default function ReviewSection() {
  return (
    <section className="py-16 bg-[#f7f7f7] text-center">
      <h2 className="text-2xl font-bold mb-8">Over 1000+ Happy Customers</h2>
      <p className="text-gray-600 mb-8">
        Don’t forget to leave a review of your own!
      </p>

      {/* Review cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {[1, 2, 3].map((r) => (
          <div
            key={r}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-600 italic mb-4">
              “Amazing hair quality and service! Highly recommend.”
            </p>
            <p className="text-primary text-lg">★★★★★</p>
            <p className="mt-2 font-semibold text-gray-700">Customer {r}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
