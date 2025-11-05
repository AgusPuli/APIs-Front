import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../Context/SessionContext";
import { useAuth } from "../Context/AuthContext"; 
import toast from "react-hot-toast";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useSession();
  const { sharedEmail, setSharedEmail } = useAuth(); 

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email: sharedEmail, password }), 
      });

      if (!response.ok) {
        let errorMsg = "Error al registrarse";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      login(data.access_token);

      toast.success("Usuario registrado correctamente");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
        <input
          type="text"
          placeholder="Apellido"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          required
          value={sharedEmail} 
          onChange={(e) => setSharedEmail(e.target.value)} 
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full flex justify-center py-3 px-4 rounded-lg bg-primary text-white font-medium"
      >
        {loading ? "Creando cuenta..." : "Crear Cuenta"}
      </button>

      <p className="text-sm text-center mt-2">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </button>
      </p>
    </form>
  );
}
