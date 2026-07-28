import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import heroVideo from "@/assets/The new Cayenne Electric  Climbing to new heights - 1080.mp4";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-background">
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0"
      >
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="size-full object-cover"
        />
        {/* Subtle drop shadow gradient on the top and bottom edges for Nav and Footer overlap, leaving the main image clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent h-32" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 via-transparent to-transparent h-32" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 h-full">
        <div className="container-lux flex h-full flex-col justify-center pb-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-32 md:mt-48 max-w-2xl"
          >
            {/* Added drop-shadow to make text legible on bright images in both light/dark modes without a black background */}
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-medium leading-[1] text-white drop-shadow-md">
              Cayenne <br />
              Electric.
            </h1>
            <div className="mt-8 md:mt-12">
              <a
                href="#models"
                className="inline-flex items-center gap-4 bg-foreground text-background px-8 py-4 text-sm font-medium hover:opacity-80 transition-opacity rounded-[4px] shadow-sm"
              >
                Discover more <ArrowRight className="size-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator and small print */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-6 inset-x-0 px-4 flex flex-col items-center gap-4 text-white drop-shadow-sm"
        >
          <div className="text-center text-[11px] md:text-xs max-w-3xl opacity-80">
            Electric energy consumption combined (model range): 22.3 – 20.3 kWh/100 km, CO₂-emissions combined (model range): 0 g/km
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="size-5" />
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
