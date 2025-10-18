"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQSection from "../components/FAQ/FAQSection";

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FAQSection />
      </main>
    </div>
  );
}
