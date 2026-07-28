import { motion } from "framer-motion";
import { Zap, Wrench, Shield, MapPin } from "lucide-react";

const items = [
  {
    icon: Zap,
    title: "Charging Network",
    body: "Access to 42,000 ultra-fast chargers across Europe with a single membership.",
  },
  {
    icon: Wrench,
    title: "Concierge Service",
    body: "Vehicle pickup, valet-return maintenance, and priority scheduling at every atelier.",
  },
  {
    icon: Shield,
    title: "8-Year Warranty",
    body: "Comprehensive powertrain and battery coverage. Zero-degradation guarantee.",
  },
  {
    icon: MapPin,
    title: "Track Days",
    body: "Twelve annual driving events at the world's most storied circuits, included.",
  },
];

export default function Ownership() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container-lux">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.3em] text-brand mb-3">
              Ownership
            </div>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight text-balance">
              More than delivery. A relationship.
            </h2>
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-base md:text-lg text-muted-foreground leading-relaxed">
            Purchase is the first mile. From your first delivery to the tenth year,
            Aurelia Concierge orchestrates every detail — so you keep your hands on
            the wheel and nothing else.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="p-8 border-t border-r-0 md:border-r md:last:border-r-0 border-hairline first:border-l-0 md:[&:nth-child(3)]:border-r-0 lg:[&:nth-child(3)]:border-r lg:[&:nth-child(4)]:border-r-0"
            >
              <it.icon className="size-6 text-brand mb-8" strokeWidth={1.4} />
              <h3 className="text-xl font-medium mb-3">{it.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {it.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
