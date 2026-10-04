"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Clock,
  MapPin,
  CheckCircle2,
  LogIn,
  UserPlus,
  BookOpen,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Recipe } from "@/data/recipes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";

export function RecipeCard({
  recipe,
  requiresAuth = false,
}: {
  recipe: Recipe;
  requiresAuth?: boolean;
}) {
  const router = useRouter();
  const [user, setUser] = useState<unknown | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

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

  const isLocked = requiresAuth && !user;

  const handleCardClick = () => {
    if (!isLocked) {
      setDetailOpen(true);
    } else {
      setAuthPromptOpen(true);
    }
  };

  return (
    <>
      <article
        onClick={handleCardClick}
        className="group relative cursor-pointer overflow-hidden rounded-sm border border-border bg-card shadow-warm transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
      >
        <div className="relative overflow-hidden">
          <img
            src={recipe.image}
            alt={`${recipe.name}, a traditional Khmer dish from Battambang`}
            width={768}
            height={576}
            loading="lazy"
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {recipe.category && (
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 bg-background/90 font-sans text-[10px] tracking-wider uppercase backdrop-blur-sm"
            >
              {recipe.category}
            </Badge>
          )}

          {isLocked && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase text-muted-foreground backdrop-blur-sm">
              <Lock className="h-3 w-3 text-accent" />
              <span>Login to view</span>
            </div>
          )}
        </div>

        <div className="border-t border-border p-5">
          <p className="font-display text-sm text-accent">{recipe.khmer}</p>
          <h3 className="mt-1 font-display text-xl text-primary transition-colors group-hover:text-primary/90">
            {recipe.name}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {recipe.note}
          </p>

          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <div>
              <dt className="inline">From </dt>
              <dd className="inline text-foreground">{recipe.place}</dd>
            </div>
            <div>
              <dt className="inline">Time </dt>
              <dd className="inline text-foreground">{recipe.time}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2 text-xs font-medium text-primary">
            <span className="uppercase tracking-wider">
              {isLocked ? "Login Required" : "View Recipe Details"}
            </span>
            {isLocked ? (
              <Lock className="h-3.5 w-3.5 text-accent" />
            ) : (
              <BookOpen className="h-3.5 w-3.5" />
            )}
          </div>
        </div>
      </article>

      {/* 1. Full Recipe Details Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border-border bg-card p-0 sm:rounded-md">
          <div className="relative">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="h-56 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span className="font-display text-lg text-accent">
                {recipe.khmer}
              </span>
              <h2 className="font-display text-3xl text-primary">
                {recipe.name}
              </h2>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4 text-xs uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {recipe.place}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-accent" />
                {recipe.time}
              </span>
              {recipe.servings && (
                <>
                  <span>•</span>
                  <span>{recipe.servings}</span>
                </>
              )}
              <Badge variant="secondary" className="ml-auto">
                {recipe.category}
              </Badge>
            </div>

            {/* Note / Description */}
            <p className="text-sm leading-relaxed italic text-muted-foreground">
              &ldquo;{recipe.note}&rdquo;
            </p>

            {/* Ingredients */}
            <div className="space-y-3">
              <h4 className="border-b border-border pb-2 font-display text-xl text-primary">
                Ingredients (គ្រឿងផ្សំ)
              </h4>
              <ul className="grid gap-2 text-xs leading-relaxed text-foreground sm:grid-cols-2">
                {recipe.ingredients.map((ing, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 rounded-sm border border-border/60 bg-background/50 p-2"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="border-b border-border pb-2 font-display text-xl text-primary">
                Preparation & Cooking (វិធីធ្វើ)
              </h4>
              <ol className="space-y-3 text-xs leading-relaxed text-foreground">
                {recipe.instructions.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 rounded-sm border border-border/60 bg-background/50 p-3"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {Boolean((user as { id: string })?.id && recipe.owner && (user as { id: string }).id === recipe.owner) && (
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDetailOpen(false);
                    router.push(`/recipes/${recipe.id}/edit`);
                  }}
                  className="text-xs uppercase tracking-wider"
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Edit Entry
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDetailOpen(false);
                    router.push(`/recipes/${recipe.id}`);
                  }}
                  className="text-xs uppercase tracking-wider"
                >
                  View / Delete Page
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Login Prompt Pop-out Modal (For Logged-out Visitors) */}
      <Dialog open={authPromptOpen} onOpenChange={setAuthPromptOpen}>
        <DialogContent className="max-w-md border-border bg-card p-6 text-center shadow-warm sm:rounded-md">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Lock className="h-6 w-6" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl text-primary">
              Login Required
            </DialogTitle>
            <DialogDescription className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
              Full ingredients list and traditional step-by-step cooking
              instructions for{" "}
              <strong className="text-foreground">
                {recipe.name} ({recipe.khmer})
              </strong>{" "}
              on Page 2 and beyond are reserved for registered users.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-2 rounded-sm border border-border bg-background p-4 text-left text-xs">
            <p className="font-display text-sm text-accent">
              ម្ហូបខ្មែរបុរាណ · Battambang
            </p>
            <p className="text-muted-foreground">
              Please log in to your account or create a new account to unlock
              all heritage recipes across all pages.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                setAuthPromptOpen(false);
                router.push("/login");
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground"
            >
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setAuthPromptOpen(false);
                router.push("/signup");
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border-border text-xs uppercase tracking-[0.2em]"
            >
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              <span>Create Account</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
