import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Globe, Moon, Sun } from "lucide-react";

const links = ["Models", "Electric", "Vehicle Purchase", "Services", "Experience", "Find a Dealer"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textStyle = scrolled || open ? "text-foreground hover:text-foreground/80" : "text-white hover:text-white/80 drop-shadow-sm";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open
          ? "bg-background/95 backdrop-blur-xl border-b border-hairline text-foreground"
          : "bg-transparent text-white"
        }`}
    >
      <div className="container-lux flex h-16 items-center md:h-20 relative">
        {/* Left: Menu */}
        <div className="flex-1 flex items-center justify-start">
          <button
            onClick={() => setOpen(true)}
            className={`flex items-center gap-2 p-2 -ml-2 transition-colors font-medium text-sm md:text-base ${textStyle}`}
            aria-label="Menu"
          >
            <Menu className="size-6 drop-shadow-sm" />
            <span className="hidden md:inline-block">Menu</span>
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex items-center justify-center">
          <a href="#" className={`flex items-center transition-colors ${textStyle}`}>
            <span className="font-display text-xl md:text-2xl font-semibold tracking-[0.4em] uppercase drop-shadow-sm">
              PORSCHE
            </span>
          </a>
        </div>

        {/* Right: Icons */}
        <div className="flex-1 flex items-center gap-1 md:gap-3 justify-end">
          <button onClick={toggleTheme} className={`p-2 transition-colors ${textStyle}`} aria-label="Toggle Theme">
            {theme === "light" ? <Moon className="size-5 drop-shadow-sm" /> : <Sun className="size-5 drop-shadow-sm" />}
          </button>
          <button className={`p-2 transition-colors ${textStyle}`} aria-label="Region">
            <Globe className="size-5 drop-shadow-sm" />
          </button>
          <button className={`p-2 -mr-2 transition-colors ${textStyle}`} aria-label="Account">
            <User className="size-5 drop-shadow-sm" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-md bg-background text-foreground border-r border-border p-6 md:p-10 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-display text-lg font-semibold tracking-[0.4em] uppercase">PORSCHE</span>
                <button onClick={() => setOpen(false)} className="p-2 -mr-2 text-foreground/80 hover:text-foreground">
                  <X className="size-6" />
                </button>
              </div>
              <div className="flex flex-col gap-6 overflow-y-auto pb-8">
                {links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-2xl md:text-3xl font-display font-medium hover:text-brand transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
