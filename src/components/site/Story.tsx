import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import road from "@/assets/story-road.jpg";
import detail from "@/assets/detail-headlight.jpg";
import interior from "@/assets/interior.jpg";

export default function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "15%"]);

  return (
    <section ref={ref} className="relative bg-background hairline-t">
      {/* Parallax cinematic band */}
      <div className="relative h-[70vh] md:h-[95vh] overflow-hidden">
        <motion.img
          style={{ y }}
          src={road}
          alt="Aurelia on a mountain pass at dusk"
          loading="lazy"
          width={1600}
          height={1100}
          className="absolute inset-0 size-full object-cover scale-110"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container-lux">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-2xl"
            >
              <div className="text-xs uppercase tracking-[0.3em] text-brand mb-4 drop-shadow-md">
                Chapter I — The Line
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.02] text-balance text-white drop-shadow-lg">
                Every curve is a decision. Ours are unanimous.
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Split editorial */}
      <div className="container-lux py-24 md:py-40 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="lg:col-span-7 relative"
        >
          <img
            src={detail}
            alt="Signature LED matrix headlight"
            loading="lazy"
            width={1600}
            height={1100}
            className="w-full aspect-[4/3] object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-brand mb-4">
            Chapter II — Light
          </div>
          <h3 className="text-3xl md:text-5xl font-medium leading-tight mb-6 text-balance">
            The matrix eye. 84 pixels of intention.
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Adaptive lumen mapping paints the road ahead in single-degree
            increments — carving a corridor of clarity while yielding to every
            oncoming driver.
          </p>
          <a
            href="#"
            className="mt-8 inline-block text-sm border-b border-foreground/30 pb-1 hover:border-foreground"
          >
            Read the engineering brief
          </a>
        </motion.div>
      </div>

      <div className="container-lux pb-24 md:pb-40 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="lg:col-span-5 order-2 lg:order-1"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-brand mb-4">
            Chapter III — Interior
          </div>
          <h3 className="text-3xl md:text-5xl font-medium leading-tight mb-6 text-balance">
            A cockpit that recedes so the drive can arrive.
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Full-grain Nappa, milled aluminum, and a floating 14-inch curved
            display. Every surface is honest — nothing pretends to be something
            it isn't.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="lg:col-span-7 order-1 lg:order-2"
        >
          <img
            src={interior}
            alt="Aurelia interior cockpit"
            loading="lazy"
            width={1600}
            height={1000}
            className="w-full aspect-[4/3] object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
