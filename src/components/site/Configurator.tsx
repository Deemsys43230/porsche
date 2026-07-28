import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import track from "@/assets/model-track.jpg";
import gt from "@/assets/model-gt.jpg";
import suv from "@/assets/model-suv.jpg";

const options = [
  { key: "aeon", name: "Aeon RS", price: 248000, img: track },
  { key: "aurora", name: "Aurora GT", price: 148900, img: gt },
  { key: "meridian", name: "Meridian", price: 132400, img: suv },
];

const colors = [
  { name: "Obsidian", hex: "#0f1114" },
  { name: "Storm", hex: "#3b4048" },
  { name: "Ivory", hex: "#e9e4d8" },
  { name: "Ember", hex: "#c85a2a" },
  { name: "Abyss Blue", hex: "#1a2a4a" },
];

export default function Configurator() {
  const [sel, setSel] = useState(options[0]);
  const [color, setColor] = useState(colors[0]);

  return (
    <section id="configure" className="bg-surface hairline-t hairline-b py-24 md:py-32">
      <div className="container-lux">
        <div className="mb-14 md:mb-20 max-w-3xl">
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-brand mb-3">
            Configure
          </div>
          <h2 className="text-4xl md:text-6xl font-medium text-balance">
            Begin your specification.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <motion.div
            key={sel.key}
            initial={{ opacity: 0.4, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 relative aspect-[16/10] bg-background overflow-hidden"
          >
            <img
              src={sel.img}
              alt={sel.name}
              loading="lazy"
              width={1600}
              height={1000}
              className="size-full object-cover"
              style={{ filter: `hue-rotate(${color.name === "Obsidian" ? 0 : 10}deg)` }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-background/90 to-transparent">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-brand mb-1">
                    Selected
                  </div>
                  <div className="text-2xl md:text-3xl font-medium">
                    {sel.name} · {color.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    From
                  </div>
                  <div className="text-2xl font-medium tabular-nums">
                    €{sel.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
                Model
              </div>
              <div className="flex flex-col">
                {options.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => setSel(o)}
                    className={`text-left py-4 hairline-b flex items-center justify-between transition ${
                      sel.key === o.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="font-medium">{o.name}</span>
                    <span className="text-xs tabular-nums">
                      €{o.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
                Exterior
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    aria-label={c.name}
                    className={`size-10 rounded-full border-2 transition ${
                      color.name === c.name
                        ? "border-brand scale-110"
                        : "border-foreground/20 hover:border-foreground/50"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{color.name}</div>
            </div>

            <a
              href="#"
              className="mt-auto inline-flex items-center justify-between bg-foreground text-primary-foreground px-6 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
            >
              Continue configuration
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
