"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  LogIn,
  Upload,
  Loader2,
  AlertCircle,
  Plus,
  BookOpen,
  Utensils,
  CheckCircle2,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { SiteChrome } from "@/components/SiteChrome";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { mapEntryToRecipe, type EntryRow } from "@/utils/entries";
import type { Recipe } from "@/data/recipes";

type FieldErrors = {
  title?: string | undefined;
  title_en?: string | undefined;
  ingredients?: string | undefined;
  steps?: string | undefined;
  source?: string | undefined;
  photo?: string | undefined;
};

export default function MyRecipesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // User's owned recipes & loading state
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  // Active view tab: "list" | "add"
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form field states
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [source, setSource] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Validation & Submit states
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setMyRecipes([]);
      setLoadingEntries(false);
      return;
    }

    async function fetchMyEntries() {
      try {
        setLoadingEntries(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .eq("owner", user!.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching user entries:", error);
          setMyRecipes([]);
        } else if (data) {
          setMyRecipes(data.map((row: EntryRow) => mapEntryToRecipe(row)));
        }
      } catch (err) {
        console.error("Failed to fetch user entries:", err);
        setMyRecipes([]);
      } finally {
        setLoadingEntries(false);
      }
    }

    fetchMyEntries();
  }, [user]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setErrors((prev) => ({ ...prev, photo: undefined }));
    setGeneralError(null);

    if (!file) {
      setPhotoFile(null);
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
      return;
    }

    // File validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedExts = ["jpg", "jpeg", "png", "webp"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!allowedTypes.includes(file.type) || !allowedExts.includes(ext)) {
      setErrors((prev) => ({
        ...prev,
        photo: "Only JPG, PNG, or WebP photo files are allowed.",
      }));
      setPhotoFile(null);
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "Photo file size must not exceed 5 MB.",
      }));
      setPhotoFile(null);
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
      return;
    }

    setPhotoFile(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {};

    const titleTrimmed = title.trim();
    if (!titleTrimmed) {
      newErrors.title = "Khmer dish title is required.";
    } else if (titleTrimmed.length < 2 || titleTrimmed.length > 120) {
      newErrors.title = "Title must be between 2 and 120 characters.";
    } else if (!/[\u1780-\u17FF]/.test(titleTrimmed)) {
      newErrors.title = "Title must contain Khmer script (e.g. ឡាបខ្មែរ).";
    }

    const titleEnTrimmed = titleEn.trim();
    if (titleEnTrimmed.length > 100) {
      newErrors.title_en = "English title must be 100 characters or less.";
    } else if (titleEnTrimmed && !/^[a-zA-Z0-9\s.,'()\-–—&!?]*$/.test(titleEnTrimmed)) {
      newErrors.title_en = "English title must contain Latin characters only.";
    }

    const ingredientsTrimmed = ingredients.trim();
    if (!ingredientsTrimmed) {
      newErrors.ingredients = "Ingredients list is required.";
    } else if (ingredientsTrimmed.length < 10 || ingredientsTrimmed.length > 2000) {
      newErrors.ingredients = "Ingredients must be between 10 and 2000 characters.";
    }

    const stepsTrimmed = steps.trim();
    if (!stepsTrimmed) {
      newErrors.steps = "Cooking steps are required.";
    } else if (stepsTrimmed.length < 20 || stepsTrimmed.length > 3000) {
      newErrors.steps = "Steps must be between 20 and 3000 characters.";
    }

    const sourceTrimmed = source.trim();
    if (sourceTrimmed.length > 150) {
      newErrors.source = "Source must be 150 characters or less.";
    }

    if (!photoFile) {
      newErrors.photo = "A photo of the dish is required.";
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const allowedExts = ["jpg", "jpeg", "png", "webp"];
      const ext = photoFile.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedTypes.includes(photoFile.type) || !allowedExts.includes(ext)) {
        newErrors.photo = "Only JPG, PNG, or WebP photo files are allowed.";
      } else if (photoFile.size > 5 * 1024 * 1024) {
        newErrors.photo = "Photo size must not exceed 5 MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);

    if (!user) {
      setGeneralError("You must be logged in to submit a recipe.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const ext = photoFile!.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExt = ext === "jpeg" ? "jpg" : ext;
      const randomUuid = crypto.randomUUID();
      const storagePath = `${user.id}/${randomUuid}.${safeExt}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(storagePath, photoFile!, {
          contentType: photoFile!.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        setGeneralError(
          "Photo upload failed. Please verify your internet connection or try another photo."
        );
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(storagePath);

      const photoUrl = publicUrlData.publicUrl;

      const titleTrimmed = title.trim();
      const titleEnTrimmed = titleEn.trim();
      const ingredientsTrimmed = ingredients.trim();
      const stepsTrimmed = steps.trim();
      const sourceTrimmed = source.trim();

      const { data: insertData, error: insertError } = await supabase
        .from("entries")
        .insert([
          {
            title: titleTrimmed,
            title_en: titleEnTrimmed || null,
            ingredients: ingredientsTrimmed,
            steps: stepsTrimmed,
            source: sourceTrimmed || null,
            photo_url: photoUrl,
            owner: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Supabase DB Insert Error:", insertError);
        setGeneralError(
          "Unable to save your entry. Please check your information and try again."
        );
        setIsSubmitting(false);
        return;
      }

      if (insertData) {
        const newRecipe = mapEntryToRecipe(insertData as EntryRow);
        setMyRecipes((prev) => [newRecipe, ...prev]);

        // Reset form fields
        setTitle("");
        setTitleEn("");
        setIngredients("");
        setSteps("");
        setSource("");
        setPhotoFile(null);
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoPreview(null);
        setIsSubmitting(false);
        setSuccessMessage(`"${newRecipe.name}" has been added to your recipes!`);
        setActiveTab("list");
      }
    } catch (err) {
      console.error("Unexpected submission error:", err);
      setGeneralError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-5xl px-5 py-12">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Personal Collection
            </p>
            <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">
              My Recipes
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Browse and view traditional recipes that you have contributed to the Battambang food archive.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <Button
                variant={activeTab === "list" ? "default" : "outline"}
                onClick={() => {
                  setActiveTab("list");
                  setSuccessMessage(null);
                }}
                className="text-xs uppercase tracking-[0.18em]"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                My Recipes ({myRecipes.length})
              </Button>
              <Button
                variant={activeTab === "add" ? "default" : "outline"}
                onClick={() => {
                  setActiveTab("add");
                  setSuccessMessage(null);
                }}
                className="text-xs uppercase tracking-[0.18em]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Recipe
              </Button>
            </div>
          )}
        </div>

        {successMessage && (
          <div className="mt-6 flex items-center gap-3 rounded-sm border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        {authLoading ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-xs uppercase tracking-widest">Checking Authentication...</p>
          </div>
        ) : !user ? (
          <div className="mt-10 rounded-sm border border-border bg-card p-8 text-center shadow-warm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl text-primary">Login Required</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Only registered members can view and manage their personal contributed recipes.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild className="uppercase tracking-[0.2em] text-xs">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Link>
              </Button>
            </div>
          </div>
        ) : activeTab === "list" ? (
          <div className="mt-8">
            {loadingEntries ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-sm border border-border bg-card p-5"
                  >
                    <div className="h-48 w-full rounded-sm bg-muted" />
                    <div className="mt-4 h-4 w-1/3 rounded bg-muted" />
                    <div className="mt-2 h-6 w-2/3 rounded bg-muted" />
                    <div className="mt-3 h-10 w-full rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : myRecipes.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myRecipes.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border px-4 py-16 text-center">
                <div className="rounded-full bg-muted p-4 text-muted-foreground">
                  <Utensils className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-display text-xl text-primary">
                  No recipes added yet
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  You haven't contributed any traditional recipes to the archive yet.
                </p>
                <Button
                  type="button"
                  onClick={() => setActiveTab("add")}
                  className="mt-6 inline-flex items-center gap-2 uppercase tracking-[0.2em] text-xs"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Recipe
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-border pb-4">
                <h2 className="font-display text-2xl text-primary">
                  Contribute a Recipe
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Share a traditional Khmer dish from your family or village to be saved under your account.
                </p>
              </div>

              {generalError && (
                <div className="flex items-start gap-3 rounded-sm border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Save Failed</p>
                    <p className="mt-0.5 text-xs text-destructive/90">{generalError}</p>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-xs font-medium uppercase tracking-wider text-foreground">
                  Dish Name in Khmer (ឈ្មោះម្ហូប) <span className="text-destructive">*</span>
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g. ឡាបខ្មែរ ឬ អាម៉ុកត្រី"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  className={`mt-2 ${errors.title ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors.title ? (
                  <p className="mt-1 text-xs text-destructive">{errors.title}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Must contain Khmer script (2–120 characters).
                  </p>
                )}
              </div>

              {/* Title EN */}
              <div>
                <label htmlFor="title_en" className="block text-xs font-medium uppercase tracking-wider text-foreground">
                  English Name (optional)
                </label>
                <Input
                  id="title_en"
                  type="text"
                  placeholder="e.g. Larb Khmer or Fish Amok"
                  value={titleEn}
                  onChange={(e) => {
                    setTitleEn(e.target.value);
                    if (errors.title_en) setErrors((prev) => ({ ...prev, title_en: undefined }));
                  }}
                  className={`mt-2 ${errors.title_en ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors.title_en ? (
                  <p className="mt-1 text-xs text-destructive">{errors.title_en}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Latin letters, numbers, and common punctuation only (max 100 chars).
                  </p>
                )}
              </div>

              {/* Ingredients */}
              <div>
                <label htmlFor="ingredients" className="block text-xs font-medium uppercase tracking-wider text-foreground">
                  Ingredients (គ្រឿងផ្សំ) <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="ingredients"
                  rows={5}
                  placeholder="List ingredients line by line, e.g.:
400g lean beef or pork, finely minced
2 tbsp toasted rice powder
3 tbsp fresh lime juice"
                  value={ingredients}
                  onChange={(e) => {
                    setIngredients(e.target.value);
                    if (errors.ingredients) setErrors((prev) => ({ ...prev, ingredients: undefined }));
                  }}
                  className={`mt-2 ${errors.ingredients ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors.ingredients ? (
                  <p className="mt-1 text-xs text-destructive">{errors.ingredients}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Provide the list of ingredients (10–2000 characters).
                  </p>
                )}
              </div>

              {/* Steps */}
              <div>
                <label htmlFor="steps" className="block text-xs font-medium uppercase tracking-wider text-foreground">
                  Cooking Steps (វិធីធ្វើ) <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="steps"
                  rows={6}
                  placeholder="Describe preparation and cooking step by step, e.g.:
1. Heat a skillet over medium heat and stir-fry minced meat with prahok until cooked.
2. Transfer cooked meat to a bowl and add lime juice and fish sauce."
                  value={steps}
                  onChange={(e) => {
                    setSteps(e.target.value);
                    if (errors.steps) setErrors((prev) => ({ ...prev, steps: undefined }));
                  }}
                  className={`mt-2 ${errors.steps ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors.steps ? (
                  <p className="mt-1 text-xs text-destructive">{errors.steps}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Describe how to prepare and cook the dish (20–3000 characters).
                  </p>
                )}
              </div>

              {/* Source */}
              <div>
                <label htmlFor="source" className="block text-xs font-medium uppercase tracking-wider text-foreground">
                  Source / Provenance (optional)
                </label>
                <Input
                  id="source"
                  type="text"
                  placeholder="e.g. Family tables across Battambang town or Market seller"
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    if (errors.source) setErrors((prev) => ({ ...prev, source: undefined }));
                  }}
                  className={`mt-2 ${errors.source ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors.source ? (
                  <p className="mt-1 text-xs text-destructive">{errors.source}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Who or where the recipe came from (max 150 chars).
                  </p>
                )}
              </div>

              {/* Photo Upload */}
              <div>
                <label htmlFor="photo" className="block text-xs font-medium uppercase tracking-wider text-foreground">
                  Dish Photo <span className="text-destructive">*</span>
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed p-6 text-center transition-colors ${
                    errors.photo
                      ? "border-destructive/60 bg-destructive/5"
                      : "border-border bg-card/50 hover:bg-card"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  {photoPreview ? (
                    <div className="relative flex flex-col items-center">
                      <img
                        src={photoPreview}
                        alt="Selected dish preview"
                        className="h-44 w-full max-w-md rounded-sm object-cover shadow-sm"
                      />
                      <p className="mt-2 text-xs font-medium text-primary">
                        Click to change photo ({photoFile?.name})
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-muted p-3 text-muted-foreground">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="mt-2 text-xs font-medium text-foreground">
                        Click to select a photo of the dish
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        JPG, PNG, or WebP formats supported (max 5 MB)
                      </p>
                    </div>
                  )}
                </div>

                {errors.photo && (
                  <p className="mt-1 text-xs text-destructive">{errors.photo}</p>
                )}
              </div>

              {/* Submit Actions */}
              <div className="flex justify-end gap-4 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("list")}
                  disabled={isSubmitting}
                  className="text-xs uppercase tracking-[0.2em]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[160px] text-xs uppercase tracking-[0.2em]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading & Saving...
                    </>
                  ) : (
                    "Submit Recipe"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
