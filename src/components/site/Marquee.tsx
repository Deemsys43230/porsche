import { motion } from "framer-motion";

const stats = [
  { v: "812", u: "kW" },
  { v: "2.1s", u: "0–100 km/h" },
  { v: "352", u: "km/h top" },
  { v: "612", u: "km range" },
  { v: "0.24", u: "Cd" },
  { v: "1,540", u: "kg dry" },
];

export default function Marquee() {
  return (
    <section className="hairline-b bg-surface">
      <div className="container-lux py-8 md:py-10">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.u}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="flex flex-col"
            >
              <div className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                {s.v}
              </div>
              <div className="mt-1 text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {s.u}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
