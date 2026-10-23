import { HeadingReveal } from "@/components/motion/heading-reveal";
import { Reveals } from "@/components/motion/reveals";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Nav } from "@/components/site/nav";
import { CloseCta, Footer, Principles, Research, Showcase, Stuck, VersionsMenu } from "@/components/site/sections";
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
        <Showcase />
        <Studio />
        <HowItWorks />
        <Research />
        <VersionsMenu />
        <Principles />
        <CloseCta />
      </main>
      <Footer />
    </>
  );
}
