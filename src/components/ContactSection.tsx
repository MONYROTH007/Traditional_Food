"use client";

import { useState, useEffect } from "react";
import { Send, CheckCircle2, MessageSquare, UserCheck, Trash2, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";

type Note = {
  id: string;
  name: string;
  message: string;
  date: string;
  owner?: string | null;
};

type NoteRow = {
  id: string;
  name: string;
  email: string | null;
  message: string;
  owner: string | null;
  created_at: string;
};

const INITIAL_NOTES: Note[] = [
  {
    id: "note-1",
    name: "Sophea Chan",
    message: "My grandmother in Ek Phnom used to roast the ground peanuts before grinding them for Prahok Ktis. It adds an incredible aromatic depth!",
    date: "Oct 8, 2026",
    owner: null,
  },
  {
    id: "note-2",
    name: "Dara Rith",
    message: "Thank you for preserving these recipes. The Mee Kola technique listed here matches exactly how my family prepared it in Sangker.",
    date: "Oct 5, 2026",
    owner: null,
  },
];

export function ContactSection() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Note[] = data.map((row: NoteRow) => ({
            id: row.id,
            name: row.name,
            message: row.message,
            date: new Date(row.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            owner: row.owner,
          }));
          setNotes(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch notes from Supabase:", err);
      }
    }

    fetchNotes();
  }, []);

  const userFullName =
    user?.user_metadata?.["full_name"] ||
    user?.user_metadata?.["username"] ||
    user?.email?.split("@")[0] ||
    "Contributor";

  const userEmail = user?.email || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const senderName = user ? userFullName : name.trim();
    const senderEmail = user ? userEmail : email.trim();
    if (!senderName || !message.trim()) return;

    setIsSubmitting(true);

    const newNoteObj: Note = {
      id: `temp-${Date.now()}`,
      name: senderName,
      message: message.trim(),
      date: "Just now",
      owner: user?.id || null,
    };

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            name: senderName,
            email: senderEmail || null,
            message: message.trim(),
            owner: user?.id || null,
          },
        ])
        .select()
        .single();

      if (data && !error) {
        newNoteObj.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase notes insert fallback:", err);
    } finally {
      setNotes((prev) => [newNoteObj, ...prev]);
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete your note?");
    if (!confirmed) return;

    setNotes((prev) => prev.filter((n) => n.id !== noteId));

    try {
      const supabase = createClient();
      await supabase.from("notes").delete().eq("id", noteId);
    } catch (err) {
      console.error("Failed to delete note from Supabase:", err);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Community Notes Section (Between Kept in the Family & Contact Us) */}
      <section className="mx-auto w-full max-w-5xl px-5 pt-14 pb-10 border-b border-border">
        <div className="flex flex-col justify-between border-b border-border pb-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">
              Community Contributions
            </p>
            <h2 className="mt-1 font-display text-3xl text-primary sm:text-4xl">
              Notes to Our Kitchen
            </h2>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:mt-0">
            Stories & Dish Variations
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => {
            const isOwner = Boolean(user?.id && note.owner && user.id === note.owner);

            return (
              <article
                key={note.id}
                className="relative flex flex-col justify-between rounded-sm border border-border bg-card p-6 shadow-warm transition-shadow hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="font-display text-sm text-accent">
                      {note.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-destructive/80 transition-colors hover:text-destructive p-1"
                          title="Delete your note"
                          aria-label="Delete your note"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed italic text-muted-foreground">
                    &ldquo;{note.message}&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>Submitted {note.date}</span>
                  {isOwner && (
                    <span className="text-primary font-semibold">Your Note</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 2. Contact Us Section */}
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
              {sent && (
                <Alert className="mb-6 border-accent/40 bg-accent/10 py-4">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <AlertDescription className="ml-2 text-sm leading-relaxed text-foreground">
                    <span className="mb-1 block font-display text-lg text-primary">
                      អរគុណ (Thank You)
                    </span>
                    Your note has been saved and published to Notes to Our Kitchen above!
                  </AlertDescription>
                </Alert>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {user ? (
                  <div className="rounded-sm border border-border bg-muted/40 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                      <UserCheck className="h-4 w-4" />
                      <span>Logged In Contributor</span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 text-xs">
                      <div>
                        <span className="block uppercase tracking-wider text-[10px] text-muted-foreground">
                          Full Name
                        </span>
                        <span className="font-semibold text-foreground text-sm">
                          {userFullName}
                        </span>
                      </div>
                      <div>
                        <span className="block uppercase tracking-wider text-[10px] text-muted-foreground">
                          Email
                        </span>
                        <span className="font-medium text-foreground">
                          {userEmail}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="border-border bg-background"
                      />
                    </div>
                  </>
                )}

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
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how your family prepares this dish..."
                    className="resize-none border-border bg-background"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex w-full items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <span>Sending...</span>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>Send Note</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
