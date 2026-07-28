const cols = [
  {
    title: "Models",
    links: ["Aurora GT", "Vantage S", "Meridian SUV", "Aeon RS", "Pre-owned"],
  },
  {
    title: "Ownership",
    links: ["Concierge", "Charging", "Warranty", "Service", "Financial Services"],
  },
  {
    title: "Company",
    links: ["Heritage", "Motorsport", "Careers", "Sustainability", "Investors"],
  },
  {
    title: "Discover",
    links: ["Ateliers", "Track Days", "Journal", "Contact", "Press"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-background hairline-t">
      <div className="container-lux py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-4">
            <div className="font-display text-2xl font-semibold tracking-[0.3em] mb-6">
              AURELIA
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Independent electric performance, engineered in Turin since 2019.
            </p>
            <form className="mt-8 flex border-b border-foreground/25 max-w-sm">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="text-xs uppercase tracking-widest font-medium py-3 hover:text-brand transition">
                Subscribe
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-[10px] uppercase tracking-[0.3em] text-brand mb-5">
                  {c.title}
                </div>
                <ul className="flex flex-col gap-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-foreground/80 hover:text-foreground transition"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="hairline-t pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-muted-foreground">
          <div>© 2026 Aurelia Automobili S.p.A. All rights reserved.</div>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:text-foreground">Legal</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Cookie Settings</a>
            <a href="#" className="hover:text-foreground">Region: Europe</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
