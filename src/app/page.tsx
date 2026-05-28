import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { InteractiveDemo } from "@/components/sections/interactive-demo";
import { FeaturesScroll } from "@/components/sections/features-scroll";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Impact } from "@/components/sections/impact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <FeaturesScroll />
        <HowItWorks />
        <Impact />
        <InteractiveDemo />
      </main>
      <Footer />
    </>
  );
}
