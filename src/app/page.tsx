import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Nav } from "@/components/site/nav";
import { Research } from "@/components/site/research";
import { CloseCta, Footer, Stuck } from "@/components/site/sections";
import { Studio } from "@/components/studio/studio";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stuck />
        <Studio />
        <HowItWorks />
        <Research />
        <CloseCta />
      </main>
      <Footer />
    </>
  );
}
