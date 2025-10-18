"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronRight } from "react-icons/hi";

export default function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <div className="group rounded-lg bg-white dark:bg-gray-800 shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:ring-2 hover:ring-primary/40">
      <button
        className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-900 dark:text-gray-100 focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {question}
        <HiChevronRight
          className={`w-6 h-6 ml-2 transform transition-transform duration-300 ${
            isOpen ? "rotate-90 text-primary" : "rotate-0"
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-4"
          >
            <div
              ref={contentRef}
              className="text-gray-700 dark:text-gray-200 text-sm sm:text-base"
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
