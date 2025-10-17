import Hero from "../components/Landing/Hero";
import FeaturedProducts from "../components/Landing/FeaturedProducts";
import AboutUs from "../components/Landing/AboutUs";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <AboutUs />
      <Footer />
    </div>
  );
}
