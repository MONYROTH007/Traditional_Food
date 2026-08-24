import KramaDivider from "./KramaDivider";

export default function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-gold/20 bg-paddy px-6 pb-16 pt-14 sm:px-10 sm:pt-20 lg:px-16">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl sm:h-96 sm:w-96"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-bright/80 animate-rise">
          ម្ហូបខ្មែរ — a field guide
        </p>
        <h1
          className="mt-5 font-display text-5xl italic leading-[1.05] text-rice sm:text-7xl animate-rise"
          style={{ animationDelay: "80ms" }}
        >
          Five dishes that
          <br />
          <span className="not-italic text-gold-bright">taste like Cambodia.</span>
        </h1>
        <p
          className="mt-6 max-w-xl text-base leading-relaxed text-rice/75 sm:text-lg animate-rise"
          style={{ animationDelay: "160ms" }}
        >
          From lakeside curry to charcoal-grilled breakfast carts, each entry
          below traces one dish back to the province, the market, or the
          household tradition it comes from. Scroll the rail, tap a dish, and
          read where it's really from.
        </p>
        <div className="mt-9 animate-rise" style={{ animationDelay: "240ms" }}>
          <KramaDivider className="max-w-[220px]" />
        </div>
      </div>
    </header>
  );
}
