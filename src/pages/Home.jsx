import Hero from "../components/Landing/Hero";
import FeaturedProducts from "../components/Landing/FeaturedProducts";
import AboutUs from "../components/Landing/AboutUs";
import { useSelector, useDispatch } from "react-redux";
import { increment } from "../store/slices/testSlice";

export default function Home() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.test.count);

  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <AboutUs />

      {/* 🔹 Sección temporal para probar Redux */}
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Contador Redux: {count}
        </h2>
        <button
          onClick={() => dispatch(increment())}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Incrementar
        </button>
      </div>
    </div>
  );
}
