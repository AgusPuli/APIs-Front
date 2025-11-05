import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../Context/SessionContext";
import { useAuth } from "../Context/AuthContext"; 
import toast from "react-hot-toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useSession();
  const { sharedEmail, setSharedEmail } = useAuth(); 

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sharedEmail, password }), 
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
      login(data.access_token);
      toast.success("Inicio de sesión exitoso");
      navigate("/");
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
          <input
            type="email"
            required
            value={sharedEmail} 
            onChange={(e) => setSharedEmail(e.target.value)} 
            placeholder="Correo electrónico"
            className="form-input relative block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark px-3 py-3"
          />
        </div>

        <div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="form-input relative block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark px-3 py-3"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group relative flex w-full justify-center rounded-lg bg-primary py-3 text-white font-semibold"
      >
        {loading ? "Cargando..." : "Iniciar Sesión"}
      </button>

      <p className="text-sm text-center mt-2">
        ¿No tienes cuenta?{" "}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={() => navigate("/register")}
        >
          Registrate
        </button>
      </p>
    </form>
  );
}
