import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import gt from "@/assets/model-gt.jpg";
import road from "@/assets/story-road.jpg";
import interior from "@/assets/interior.jpg";

const posts = [
  {
    tag: "Motorsport",
    date: "12 · 07 · 2026",
    title: "Aeon RS claims pole at the Nürburgring 24 Hours.",
    img: road,
  },
  {
    tag: "Design",
    date: "28 · 06 · 2026",
    title: "Inside the atelier: crafting the Aurora GT's tailored cabin.",
    img: interior,
  },
  {
    tag: "Innovation",
    date: "04 · 06 · 2026",
    title: "The 800-volt architecture powering our next decade.",
    img: gt,
  },
];

export default function News() {
  return (
    <section className="bg-surface hairline-t py-24 md:py-32">
      <div className="container-lux">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-brand mb-3">
              Newsroom
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-balance">
              Latest from Aurelia.
            </h2>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-2 text-sm border-b border-foreground/30 pb-1 hover:border-foreground w-fit"
          >
            All stories
            <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.a
              key={p.title}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group flex flex-col gap-5"
            >
              <div className="aspect-[4/3] overflow-hidden bg-background">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1600}
                  height={1000}
                  className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="text-brand">{p.tag}</span>
                <span className="h-px w-6 bg-foreground/20" />
                <span>{p.date}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-medium leading-snug group-hover:text-brand transition-colors text-balance">
                {p.title}
              </h3>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
