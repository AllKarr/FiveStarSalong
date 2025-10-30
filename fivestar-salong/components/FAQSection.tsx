/**
 * FAQSection
 * Expandable, SEO-optimized question list for hair extension information.
 */

export default function FAQSection() {
  const faqs = [
    {
      question: "What types of hair extensions are available?",
      answer:
        "We offer a wide range of high-quality hair extensions including clip-in, tape-in, sew-in (weft), keratin bond, and micro-link extensions. Each method provides different levels of hold, comfort, and styling flexibility — perfect for adding length, volume, or color highlights without damaging your natural hair.",
    },
    {
      question: "Are hair extensions made from real hair?",
      answer:
        "Yes! Our premium extensions are made from 100% ethically sourced human Remy hair. This ensures the cuticle remains intact, giving you natural shine, softness, and long-lasting durability. We also offer synthetic options for customers who prefer a lower-cost alternative.",
    },
    {
      question: "How long do hair extensions last?",
      answer:
        "The lifespan of your extensions depends on the type and care routine. Human hair extensions typically last 6 to 12 months with proper maintenance, while semi-permanent methods such as tape-ins may need repositioning every 6–8 weeks. Regular deep conditioning and gentle handling will extend their lifespan.",
    },
    {
      question: "Can I style and color my hair extensions?",
      answer:
        "Yes, human hair extensions can be curled, straightened, and even colored — just like your natural hair. We recommend using a heat protectant spray and professional-grade styling tools. For coloring, consult a stylist experienced with extensions to maintain the hair’s health and shine.",
    },
    {
      question: "Do hair extensions damage your natural hair?",
      answer:
        "When applied and removed correctly, hair extensions will not damage your natural hair. Always have permanent or semi-permanent extensions installed by a licensed stylist. Avoid excessive tension, and follow the recommended aftercare routine to keep both your extensions and natural hair healthy.",
    },
    {
      question: "How should I care for my hair extensions?",
      answer:
        "Use sulfate-free shampoo and moisturizing conditioner to keep your extensions soft and manageable. Brush gently with a wide-tooth comb or extension-safe brush, starting from the ends upward. Avoid sleeping with wet hair and tie it loosely at night to prevent tangling.",
    },
    {
      question: "Can I wear hair extensions every day?",
      answer:
        "Absolutely! Clip-in extensions can be worn daily and removed at night, while tape-ins and sew-ins are designed for long-term wear. To keep your look fresh, give your scalp a break between installations and schedule regular salon maintenance for professional cleaning and adjustment.",
    },
  ];

  return (
    <section
      className="py-16 bg-white text-center"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <h2 className="text-2xl font-bold mb-8 text-primary">
        Most Asked Questions About Hair Extensions
      </h2>

      <div className="max-w-2xl mx-auto text-left space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="border border-gray-200 rounded-lg p-4 open:bg-gray-50 transition-all"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary
              className="cursor-pointer font-medium"
              itemProp="name"
            >
              {faq.question}
            </summary>
            <div
              className="mt-2 text-gray-600 text-sm"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p itemProp="text">{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
