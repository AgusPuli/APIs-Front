import { useSession } from "../Context/SessionContext";

export default function ProfileSection() {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
        No hay usuario autenticado.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Mi Perfil
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.firstName || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Apellido</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.lastName || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.email || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Rol</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.role || "USER"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
