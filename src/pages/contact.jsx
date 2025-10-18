"use client";

import { motion } from "framer-motion";
import ContactForm from "../components/Contact/ContactForm";
import ContactInfo from "../components/Contact/ContactInfo";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ContactForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ContactInfo />
        </motion.div>
      </main>
    </div>
  );
}
