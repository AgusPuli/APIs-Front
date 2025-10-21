import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Logo from "./Header/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Sobre Nosotros", href: "/faq" },
      { name: "Contacto", href: "/contact" },
      { name: "Carreras", href: "/faq" },
    ],
    support: [
      { name: "Centro de Ayuda", href: "/faq" },
      { name: "Envíos", href: "/faq" },
      { name: "Devoluciones", href: "/faq" },
    ],
    legal: [
      { name: "Términos y Condiciones", href: "/faq" },
      { name: "Política de Privacidad", href: "/faq" },
      { name: "Cookies", href: "/faq" },
    ],
  };

  const socialLinks = [
    { icon: FaGithub, href: "#", label: "GitHub" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-gray-700">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo size="h-10 w-10" />
              <h2 className="text-2xl font-bold text-white">TechGadget</h2>
            </div>
            <p className="text-gray-400 mb-4 max-w-sm">
              Tu tienda de confianza para los últimos gadgets tecnológicos. 
              Calidad, innovación y el mejor servicio al cliente.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-200 hover-lift"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-b border-gray-700">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Suscríbete a nuestro newsletter
            </h3>
            <p className="text-gray-400 mb-4">
              Recibe ofertas exclusivas y las últimas novedades
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="btn-primary whitespace-nowrap px-6 py-3">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} TechGadget. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Desarrollado</span>
            <span>por Grupo 8</span>
            <span className="text-red-500 animate-pulse">❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}