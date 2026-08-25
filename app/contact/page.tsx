import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Battambang Table",
  description: "Share a correction, a memory, or a recipe of your own."
};

export default function ContactPage() {
  return (
    <section className="bg-paper">
      <div className="max-w-content mx-auto px-5 md:px-8 py-20 md:py-28 grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-mono-tag text-[11px] tracking-widest uppercase text-clay mb-4">
            Get in touch
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-umber mb-6">
            Tell us your version
          </h1>
          <p className="text-umber/70 leading-relaxed max-w-sm">
            Every household in Battambang makes these dishes a little
            differently. If a story here doesn&apos;t match what you grew up
            with, or you&apos;d like to share a dish of your own, we&apos;d
            like to hear it.
          </p>
        </div>

        <form className="bg-paper-deep/60 border border-umber/10 rounded-sm p-6 md:p-8 space-y-5">
          <div>
            <label htmlFor="name" className="block font-mono-tag text-[11px] tracking-widest uppercase text-umber/50 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full bg-paper border border-umber/20 rounded-sm px-4 py-3 text-umber placeholder:text-umber/30 focus:outline-none focus:border-turmeric"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-mono-tag text-[11px] tracking-widest uppercase text-umber/50 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full bg-paper border border-umber/20 rounded-sm px-4 py-3 text-umber placeholder:text-umber/30 focus:outline-none focus:border-turmeric"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-mono-tag text-[11px] tracking-widest uppercase text-umber/50 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full bg-paper border border-umber/20 rounded-sm px-4 py-3 text-umber placeholder:text-umber/30 focus:outline-none focus:border-turmeric resize-none"
              placeholder="Share a memory, a correction, or a recipe..."
            />
          </div>

          <button
            type="submit"
            className="font-mono-tag text-xs tracking-widest uppercase text-ink bg-turmeric hover:bg-turmeric-deep transition-colors px-6 py-3.5 rounded-sm"
          >
            Send
          </button>
          <p className="text-xs text-umber/40 leading-relaxed">
            This form is a placeholder — wire it up to an email service (e.g.
            Resend, Formspree) or an API route to actually receive messages.
          </p>
        </form>
      </div>
    </section>
  );
}