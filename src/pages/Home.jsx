import Hero from "../components/Landing/Hero";
import FeaturedProducts from "../components/Landing/FeaturedProducts";
import AboutUs from "../components/Landing/AboutUs";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <AboutUs />
    </div>
  );
}