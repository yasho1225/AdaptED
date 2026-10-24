import { HeadingReveal } from "@/components/motion/heading-reveal";
import { Reveals } from "@/components/motion/reveals";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Nav } from "@/components/site/nav";
import { CloseCta, Footer, Principles, Research, Stuck } from "@/components/site/sections";
import { Versions } from "@/components/site/versions";
import { Studio } from "@/components/studio/studio";

export default function Home() {
  return (
    <>
      <Reveals />
      <HeadingReveal />
      <Nav />
      <main>
        <Hero />
        <Stuck />
        <Studio />
        <HowItWorks />
        <Versions />
        <Research />
        <Principles />
        <CloseCta />
      </main>
      <Footer />
    </>
  );
}
