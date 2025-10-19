// src/components/Admin/Product/types.js

// Solo exportamos los datos mock y estructuras de ejemplo
export const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 999.99,
    category: "Electrónica",
    subcategories: ["Smartphones", "Apple"],
    images: [
      "https://via.placeholder.com/400x400/3b82f6/ffffff?text=iPhone+1",
      "https://via.placeholder.com/400x400/60a5fa/ffffff?text=iPhone+2"
    ],
    featured: true,
    description: "El último iPhone con chip A17 Pro",
    specifications: {
      "Pantalla": "6.1 pulgadas OLED",
      "Procesador": "A17 Pro",
      "Cámara": "48MP principal"
    },
    colors: ["#000000", "#FFFFFF", "#0066CC"],
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    reviews: [
      {
        user: "Juan Pérez",
        rating: 5,
        comment: "Excelente producto, muy rápido",
        date: "2024-01-15",
        avatar: "https://i.pravatar.cc/150?img=1"
      }
    ]
  },
  {
    id: "2",
    name: "MacBook Pro 16\"",
    price: 2499.99,
    category: "Computadoras",
    subcategories: ["Laptops", "Apple"],
    images: [
      "https://via.placeholder.com/400x400/8b5cf6/ffffff?text=MacBook"
    ],
    featured: false,
    description: "Potente laptop para profesionales",
    specifications: {
      "Pantalla": "16 pulgadas Liquid Retina XDR",
      "Procesador": "M3 Max",
      "RAM": "36GB"
    },
    colors: ["#8B8B8B", "#1A1A1A"],
    storageOptions: ["512GB SSD", "1TB SSD", "2TB SSD"]
  }
];