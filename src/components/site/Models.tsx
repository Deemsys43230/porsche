import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import gt from "@/assets/model-gt.jpg";
import suv from "@/assets/model-suv.jpg";
import track from "@/assets/model-track.jpg";

const models = [
  {
    tag: "Grand Tourer",
    name: "Aurora GT",
    spec: "Dual motor · 720 km range",
    price: "From €148,900",
    img: gt,
  },
  {
    tag: "Luxury SUV",
    name: "Meridian",
    spec: "Tri motor · 640 km range",
    price: "From €132,400",
    img: suv,
  },
  {
    tag: "Track Edition",
    name: "Aeon RS",
    spec: "Quad motor · 612 km range",
    price: "From €248,000",
    img: track,
  },
];

export default function Models() {
  return (
    <section id="models" className="bg-background py-24 md:py-32">
      <div className="container-lux">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.3em] text-brand mb-3">
              The Range
            </div>
            <h2 className="text-4xl md:text-6xl font-medium max-w-2xl text-balance">
              Three silhouettes. One philosophy.
            </h2>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-2 text-sm font-medium border-b border-foreground/30 pb-1 hover:border-foreground w-fit"
          >
            All Models
            <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {models.map((m, i) => (
            <motion.a
              key={m.name}
              href="#"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col bg-surface hairline-b overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  width={1600}
                  height={1000}
                  className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col gap-3 min-h-[200px]">
                <div className="text-[10px] uppercase tracking-[0.3em] text-brand">
                  {m.tag}
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-medium">
                  {m.name}
                </h3>
                <div className="text-sm text-muted-foreground">{m.spec}</div>
                <div className="mt-auto flex items-end justify-between pt-6">
                  <div className="text-sm font-medium">{m.price}</div>
                  <div className="size-10 rounded-full border border-foreground/25 flex items-center justify-center group-hover:bg-brand group-hover:border-brand group-hover:text-brand-foreground transition-colors">
                    <ArrowUpRight className="size-4" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
