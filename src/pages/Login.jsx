import { useState } from "react";
import Header from "../components/Header";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      <Header
        searchQuery=""
        setSearchQuery={() => {}}
        selectedCategory=""
        setSelectedCategory={() => {}}
        selectedSubcategory=""
        setSelectedSubcategory={() => {}}
        products={[]}
      />

      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                isLogin
                  ? "bg-primary text-white"
                  : "bg-background-light dark:bg-background-dark text-background-dark dark:text-background-light"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                !isLogin
                  ? "bg-primary text-white"
                  : "bg-background-light dark:bg-background-dark text-background-dark dark:text-background-light"
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
