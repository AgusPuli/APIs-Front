"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    console.log("Enviar mensaje:", form);
    toast.success("Mensaje enviado correctamente");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <form
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Contáctanos
      </h2>

      {/** Nombre */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Nombre
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tu nombre"
          className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
        />
      </div>

      {/** Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
        />
      </div>

      {/** Mensaje */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Mensaje
        </label>
        <textarea
          name="message"
          id="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="¿Cómo podemos ayudarte?"
          className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
        />
      </div>

      {/** Botón enviar */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md"
      >
        Enviar Mensaje
      </button>
    </form>
  );
}
