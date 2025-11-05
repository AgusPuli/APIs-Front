import { useState } from "react";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isLogin
                  ? "bg-primary text-white shadow-md ring-2 ring-primary"
                  : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-primary/10"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>

            <button
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                !isLogin
                  ? "bg-primary text-white shadow-md ring-2 ring-primary"
                  : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-primary/10"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </main>
    </div>
  );
}
