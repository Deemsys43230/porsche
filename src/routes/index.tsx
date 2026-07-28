import { createFileRoute } from "@tanstack/react-router";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Models from "@/components/site/Models";
import Story from "@/components/site/Story";
import Configurator from "@/components/site/Configurator";
import Ownership from "@/components/site/Ownership";
import News from "@/components/site/News";
import Footer from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Porsche — Electric Performance, Distilled" },
      {
        name: "description",
        content:
          "Porsche builds independent electric performance cars in Turin. Discover the Aurora GT, Meridian, and the track-bred Aeon RS.",
      },
      { property: "og:title", content: "Aurelia — Electric Performance, Distilled" },
      {
        property: "og:description",
        content:
          "Precision, distilled into motion. Explore the Aurelia range of electric grand tourers, luxury SUVs, and track editions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        {/* <Marquee /> */}
        <Models />
        <Story />
        <Configurator />
        {/* <Ownership /> */}
        <News />
      </main>
      <Footer />
    </div>
  );
}
