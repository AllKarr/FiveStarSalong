/**
 * FAQSection
 * Expandable question list for customer information.
 */
export default function FAQSection() {
  const questions = [
    "What types of hair extensions are available?",
    "Are hair extensions made from real hair?",
    "How long do hair extensions last?",
    "Can I style and color my hair extensions?",
    "Do hair extensions damage your natural hair?",
    "How should I care for my hair extensions?",
    "Can I wear hair extensions every day?",
  ];

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-2xl font-bold mb-8 text-primary">
        Most Asked Questions about Hair Extensions
      </h2>

      <div className="max-w-2xl mx-auto text-left space-y-4">
        {questions.map((q, i) => (
          <details
            key={i}
            className="border border-gray-200 rounded-lg p-4 open:bg-gray-50 transition-all"
          >
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-2 text-gray-600 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              aliquet tincidunt arcu non placerat.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
