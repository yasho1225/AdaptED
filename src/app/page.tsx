import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { InteractiveDemo } from "@/components/sections/interactive-demo";
import { PostDemoBrief } from "@/components/sections/post-demo-brief";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <a
        href="#demo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-card-foreground focus:shadow-[var(--shadow-elevated)] focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to live demo
      </a>
      <Nav />
      <main id="main-content" className="flex-1">
        <Hero />
        <InteractiveDemo />
        <PostDemoBrief />
      </main>
      <Footer />
    </>
  );
}
