"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-14">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Heading & Heritage Context */}
        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Contact Us
          </p>
          <h2 className="mt-1 font-display text-3xl text-primary sm:text-4xl">
            Write to Our Kitchen
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            If your family cooks one of these dishes another way, or if you have
            memories and stories from Battambang&apos;s old shophouses and
            markets, we would love to hear from you.
          </p>

          <div className="mt-8 rounded-sm border border-border bg-card p-5 shadow-warm">
            <p className="font-display text-lg text-accent">ម្ហូបខ្មែរបុរាណ</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Battambang Province, Cambodia
            </p>
            <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
              Preserving traditional culinary heritage measure by measure,
              passed down through generations.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form Card */}
        <div className="lg:col-span-7">
          <div className="rounded-sm border border-border bg-card p-6 shadow-warm sm:p-8">
            {sent ? (
              <Alert className="border-accent/40 bg-accent/10 py-6">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <AlertDescription className="ml-2 text-sm leading-relaxed text-foreground">
                  <span className="mb-1 block font-display text-lg text-primary">
                    អរគុណ (Thank You)
                  </span>
                  Your note has been received. This form is currently in
                  demonstration mode, so no email was dispatched.
                </AlertDescription>
              </Alert>
            ) : (
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-name"
                    className="text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Name
                  </Label>
                  <Input
                    id="contact-name"
                    required
                    placeholder="Your name"
                    className="border-border bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-email"
                    className="text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="border-border bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-message"
                    className="text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Your Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={4}
                    required
                    placeholder="Tell us how your family prepares this dish..."
                    className="resize-none border-border bg-background"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
                >
                  <span>Send Note</span>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
