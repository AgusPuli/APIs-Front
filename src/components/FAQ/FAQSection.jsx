"use client";

import FAQCategory from "./FAQCategory";

export default function FAQSection() {
  const faqData = [
    {
      title: "General",
      items: [
        {
          question: "Envíos y Entregas",
          answer:
            "Ofrecemos envíos a todo el país con diferentes opciones de entrega. Los tiempos de entrega varían según la ubicación y el método de envío seleccionado.",
        },
        {
          question: "Devoluciones y Reembolsos",
          answer:
            "Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre y cuando el producto esté en su estado original.",
        },
      ],
    },
    {
      title: "Pagos",
      items: [
        {
          question: "Pagos y Facturación",
          answer:
            "Aceptamos diversas formas de pago, incluyendo tarjetas de crédito, débito y plataformas de pago en línea.",
        },
      ],
    },
    {
      title: "Soporte",
      items: [
        {
          question: "Garantía y Soporte",
          answer:
            "Todos nuestros productos cuentan con una garantía de un año contra defectos de fabricación.",
        },
        {
          question: "Cuenta y Seguridad",
          answer:
            "Puedes crear una cuenta en nuestro sitio web para gestionar tus compras y proteger tu información personal.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Preguntas Frecuentes
        </h2>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios.
        </p>
      </div>

      <div className="space-y-8">
        {faqData.map((category, idx) => (
          <FAQCategory key={idx} title={category.title} items={category.items} />
        ))}
      </div>
    </div>
  );
}
