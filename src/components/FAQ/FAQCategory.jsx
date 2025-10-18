"use client";

import FAQItem from "./FAQItem";

export default function FAQCategory({ title, items }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <FAQItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}
