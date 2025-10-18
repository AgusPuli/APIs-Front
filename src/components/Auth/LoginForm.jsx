import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../Context/SessionContext";
import toast from "react-hot-toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Enviando login:", { email, password });

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMsg = "Credenciales incorrectas";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // Guardar token en contexto global
      login(data.token);

      toast.success("Inicio de sesión exitoso");

      // Redirigir según rol
      if (data.type === "ADMIN") navigate("/admin");
      else navigate("/user");
    } catch (err) {
      toast.error(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <label htmlFor="email" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="form-input relative block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark px-3 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="form-input relative block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark px-3 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-primary hover:text-primary/80"
          >
            ¿Olvidó su contraseña?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full justify-center rounded-lg border border-transparent bg-primary py-3 px-4 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </div>
    </form>
  );
}
