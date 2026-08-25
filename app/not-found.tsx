import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-ink text-paper min-h-[60vh] flex items-center">
      <div className="max-w-content mx-auto px-5 md:px-8 py-24 text-center">
        <p className="font-mono-tag text-[11px] tracking-widest uppercase text-turmeric mb-4">
          404
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-6">
          That plate isn&apos;t on the table.
        </h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono-tag text-xs tracking-widest uppercase text-ink bg-turmeric hover:bg-turmeric-deep transition-colors px-6 py-3.5 rounded-sm"
        >
          Back to the table
        </Link>
      </div>
    </section>
  );
}
