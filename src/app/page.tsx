import { MoodController } from "@/components/motion/mood-controller";
import { Hero } from "@/components/site/hero";
import { Nav } from "@/components/site/nav";
import { HowItWorks } from "@/components/site/how-it-works";
import { CloseCta, Footer, Principles, Problem, Research } from "@/components/site/sections";
import { Studio } from "@/components/studio/studio";

export default function Home() {
  return (
    <>
      <MoodController />
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
