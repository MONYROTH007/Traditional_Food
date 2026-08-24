import Hero from "@/components/Hero";
import FoodGallery from "@/components/FoodGallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-paddy-deep">
      <Hero />
      <FoodGallery />
      <Footer />
    </main>
  );
}
