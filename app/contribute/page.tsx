"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  Lock,
  LogIn,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ListOrdered,
  Plus,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { SiteChrome } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { mapEntryToRecipe, type EntryRow } from "@/utils/entries";

type FieldErrors = {
  title?: string | undefined;
  title_en?: string | undefined;
  ingredients?: string | undefined;
  steps?: string | undefined;
  source?: string | undefined;
  photo?: string | undefined;
};

export default function ContributePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
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

  const handleResetForm = () => {
    setTitle("");
    setTitleEn("");
    setIngredients("");
    setSteps("");
    setSource("");
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setErrors({});
    setGeneralError(null);
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

      // Note: do NOT send status; database default sets it to 'pending'
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
        handleResetForm();
        setIsSubmitting(false);
        setSuccessMessage(
          `Submission Received! Your dish "${newRecipe.name}" has been submitted to the Battambang Food Archive curators. Curators usually review family recipes within 1–3 business days to verify culinary provenance, ingredient measurements, and photo quality.`
        );
      }
    } catch (err) {
      console.error("Unexpected submission error:", err);
      setGeneralError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Heritage Archive
            </p>
            <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">
              Contribute a Recipe
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Share a traditional Khmer dish from your family or village to be submitted for curation in the Battambang archive.
            </p>
          </div>

          {user && (
            <Button asChild variant="outline" className="text-xs uppercase tracking-[0.18em] shrink-0">
              <Link href="/my-entries">
                <ListOrdered className="mr-2 h-4 w-4" />
                View My Entries
              </Link>
            </Button>
          )}
        </div>

        {/* Confirmation banner after submission */}
        {successMessage && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-amber-500/40 bg-amber-500/10 p-5 text-sm text-foreground">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Submission Received</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {successMessage}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild size="sm" className="text-xs uppercase tracking-wider">
                <Link href="/my-entries">
                  Go to My Entries →
                </Link>
              </Button>
            </div>
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
              Sign up or log in to submit your traditional recipes to the Battambang archive and track their curation.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild className="uppercase tracking-[0.2em] text-xs">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Link>
              </Button>
              <Button asChild variant="outline" className="uppercase tracking-[0.2em] text-xs">
                <Link href="/signup">
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                onClick={handleResetForm}
                disabled={isSubmitting}
                className="text-xs uppercase tracking-[0.2em]"
              >
                Clear Form
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
                  <>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Submit Recipe
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </SiteChrome>
  );
}
