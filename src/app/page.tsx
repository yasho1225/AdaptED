import { Hero } from "@/components/site/hero";
import { Nav } from "@/components/site/nav";
import { CloseCta, Footer, HowItWorks, Principles, Problem, Research } from "@/components/site/sections";
import { Studio } from "@/components/studio/studio";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Studio />
        <HowItWorks />
        <Research />
        <Principles />
        <CloseCta />
      </main>
      <Footer />
    </>
  );
}
