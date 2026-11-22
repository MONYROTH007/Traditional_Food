"use client";

import {
  useState,
  useEffect,
  useRef,
  use,
  ChangeEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  LogIn,
  Upload,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { SiteChrome } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage, type MsgKey } from "@/lib/i18n";
import { createClient } from "@/utils/supabase/client";
import {
  isMissingEnColumnsError,
  mapEntryToRecipe,
  type EntryRow,
} from "@/utils/entries";

type FieldErrors = {
  title?: string | undefined;
  title_en?: string | undefined;
  ingredients?: string | undefined;
  ingredients_en?: string | undefined;
  steps?: string | undefined;
  steps_en?: string | undefined;
  source?: string | undefined;
  source_en?: string | undefined;
  photo?: string | undefined;
};

/**
 * Fields in the order they appear in the form. Used to jump to the first
 * invalid one: validation errors render inline beside their field, so on a
 * long form a failure near the top is invisible to someone looking at the
 * submit button a thousand pixels below — it reads as "nothing happened".
 */
const FIELD_ORDER = [
  "title",
  "title_en",
  "ingredients",
  "ingredients_en",
  "steps",
  "steps_en",
  "source",
  "source_en",
  "photo",
] as const;

function focusFirstError(errs: FieldErrors) {
  const key = FIELD_ORDER.find((k) => errs[k]);
  if (!key) return;
  const el = document.getElementById(key);
  if (!el) return;
  // The photo input is visually hidden, so scroll its drop zone instead.
  const target = key === "photo" ? (el.closest("div") ?? el) : el;
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  if (key !== "photo") {
    window.setTimeout(
      () => (el as HTMLElement).focus({ preventScroll: true }),
      300,
    );
  }
}

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [existingOwner, setExistingOwner] = useState<string | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);

  // Form field states
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [ingredientsEn, setIngredientsEn] = useState("");
  const [steps, setSteps] = useState("");
  const [stepsEn, setStepsEn] = useState("");
  const [source, setSource] = useState("");
  const [sourceEn, setSourceEn] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Validation & Submit states
  const [errors, setErrors] = useState<FieldErrors>({});
  // Store the message key, not the translated text, so an error already on
  // screen re-translates when the reader switches language.
  const [generalErrorKey, setGeneralErrorKey] = useState<MsgKey | null>(null);
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

  // Fetch initial entry to pre-fill form
  useEffect(() => {
    async function loadEntry() {
      try {
        setInitialLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (error || !data) {
          console.error("Error loading entry for edit:", error);
          setGeneralErrorKey("edit.notFound");
        } else {
          const entry = data as EntryRow;
          setTitle(entry.title || "");
          setTitleEn(entry.title_en || "");
          setIngredients(entry.ingredients || "");
          setIngredientsEn(entry.ingredients_en || "");
          setSteps(entry.steps || "");
          setStepsEn(entry.steps_en || "");
          setSource(entry.source || "");
          setSourceEn(entry.source_en || "");
          setExistingOwner(entry.owner || null);

          const recipeObj = mapEntryToRecipe(entry);
          setExistingPhotoUrl(entry.photo_url || null);
          setPhotoPreview(recipeObj.image || null);
        }
      } catch (err) {
        console.error("Failed to fetch entry for edit:", err);
        setGeneralErrorKey("edit.notFound");
      } finally {
        setInitialLoading(false);
      }
    }

    loadEntry();
  }, [resolvedParams.id]);

  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setErrors((prev) => ({ ...prev, photo: undefined }));
    setGeneralErrorKey(null);

    if (!file) {
      setPhotoFile(null);
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhotoPreview(existingPhotoUrl);
      return;
    }

    // OWASP file validation: MIME type, Extension, Size
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedExts = ["jpg", "jpeg", "png", "webp"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!allowedTypes.includes(file.type) || !allowedExts.includes(ext)) {
      setErrors((prev) => ({
        ...prev,
        photo: t("form.errPhotoType"),
      }));
      setPhotoFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: t("form.errPhotoSize"),
      }));
      setPhotoFile(null);
      return;
    }

    setPhotoFile(file);
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validateForm = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    // 1. title: required, trimmed, 2-120 characters, must contain Khmer script
    const titleTrimmed = title.trim();
    if (!titleTrimmed) {
      newErrors.title = t("form.errTitleRequired");
    } else if (titleTrimmed.length < 2 || titleTrimmed.length > 120) {
      newErrors.title = t("form.errTitleLength");
    } else if (!/[\u1780-\u17FF]/.test(titleTrimmed)) {
      newErrors.title = t("form.errTitleKhmer");
    }

    // 2. title_en: optional, trimmed, 0-100 characters, Latin characters only if filled
    const titleEnTrimmed = titleEn.trim();
    if (titleEnTrimmed.length > 100) {
      newErrors.title_en = t("form.errTitleEnLength");
    } else if (
      titleEnTrimmed &&
      !/^[a-zA-Z0-9\s.,'()\-–—&!?]*$/.test(titleEnTrimmed)
    ) {
      newErrors.title_en = t("form.errTitleEnLatin");
    }

    // 3. ingredients: required, trimmed, 10-2000 characters
    const ingredientsTrimmed = ingredients.trim();
    if (!ingredientsTrimmed) {
      newErrors.ingredients = t("form.errIngredientsRequired");
    } else if (
      ingredientsTrimmed.length < 10 ||
      ingredientsTrimmed.length > 2000
    ) {
      newErrors.ingredients = t("form.errIngredientsLength");
    }

    if (ingredientsEn.trim().length > 2000) {
      newErrors.ingredients_en = t("form.errIngredientsEnLength");
    }

    // 4. steps: required, trimmed, 20-3000 characters
    const stepsTrimmed = steps.trim();
    if (!stepsTrimmed) {
      newErrors.steps = t("form.errStepsRequired");
    } else if (stepsTrimmed.length < 20 || stepsTrimmed.length > 3000) {
      newErrors.steps = t("form.errStepsLength");
    }

    if (stepsEn.trim().length > 3000) {
      newErrors.steps_en = t("form.errStepsEnLength");
    }

    // 5. source: optional, trimmed, 0-150 characters
    const sourceTrimmed = source.trim();
    if (sourceTrimmed.length > 150) {
      newErrors.source = t("form.errSourceLength");
    }

    if (sourceEn.trim().length > 150) {
      newErrors.source_en = t("form.errSourceEnLength");
    }

    // 6. photo: optional on edit. If a new photo is selected, validate it.
    if (photoFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const allowedExts = ["jpg", "jpeg", "png", "webp"];
      const ext = photoFile.name.split(".").pop()?.toLowerCase() || "";
      if (
        !allowedTypes.includes(photoFile.type) ||
        !allowedExts.includes(ext)
      ) {
        newErrors.photo = t("form.errPhotoType");
      } else if (photoFile.size > 5 * 1024 * 1024) {
        newErrors.photo = t("form.errPhotoSize");
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralErrorKey(null);

    if (!user) {
      setGeneralErrorKey("edit.mustLogin");
      return;
    }

    if (existingOwner && user.id !== existingOwner) {
      setGeneralErrorKey("edit.noPermission");
      return;
    }

    const fieldErrors = validateForm();
    if (Object.keys(fieldErrors).length > 0) {
      // Say something at the button, then take them to the offending field.
      setGeneralErrorKey("form.fixErrors");
      focusFirstError(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      let updatedPhotoUrl = existingPhotoUrl;

      // If a new photo file was picked, upload it to storage
      if (photoFile) {
        const ext = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeExt = ext === "jpeg" ? "jpg" : ext;
        const randomUuid = crypto.randomUUID();
        const storagePath = `${user.id}/${randomUuid}.${safeExt}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(storagePath, photoFile, {
            contentType: photoFile.type,
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Supabase Storage Upload Error on Edit:", uploadError);
          setGeneralErrorKey("edit.saveFailed");
          setIsSubmitting(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("photos")
          .getPublicUrl(storagePath);

        updatedPhotoUrl = publicUrlData.publicUrl;
      }

      // Update record in entries table. Every edit resets the entry to
      // 'pending' so resubmissions re-enter the review queue and satisfy the
      // RLS WITH CHECK (status = 'pending') policy.
      const titleTrimmed = title.trim();
      const titleEnTrimmed = titleEn.trim();
      const ingredientsTrimmed = ingredients.trim();
      const ingredientsEnTrimmed = ingredientsEn.trim();
      const stepsTrimmed = steps.trim();
      const stepsEnTrimmed = stepsEn.trim();
      const sourceTrimmed = source.trim();
      const sourceEnTrimmed = sourceEn.trim();

      const updatePayload = {
        title: titleTrimmed,
        title_en: titleEnTrimmed || null,
        ingredients: ingredientsTrimmed,
        steps: stepsTrimmed,
        source: sourceTrimmed || null,
        photo_url: updatedPhotoUrl,
        status: "pending",
      };

      let { data: updateData, error: updateError } = await supabase
        .from("entries")
        .update({
          ...updatePayload,
          ingredients_en: ingredientsEnTrimmed || null,
          steps_en: stepsEnTrimmed || null,
          source_en: sourceEnTrimmed || null,
        })
        .eq("id", resolvedParams.id)
        .select();

      // The bilingual columns are optional: if this Supabase project has not
      // run the migration yet, save the edit without the translations.
      if (isMissingEnColumnsError(updateError)) {
        console.warn(
          "entries.ingredients_en/steps_en missing — saving without translations.",
        );
        ({ data: updateData, error: updateError } = await supabase
          .from("entries")
          .update(updatePayload)
          .eq("id", resolvedParams.id)
          .select());
      }

      // Check that a row actually came back
      if (updateError || !updateData || updateData.length === 0) {
        console.error(
          "Supabase Update Error or 0 rows returned:",
          updateError || "No row returned from update select",
        );
        setGeneralErrorKey("edit.saveFailed");
        setIsSubmitting(false);
        return;
      }

      // Go to my-entries page after successful save to view pending review status
      router.push("/my-entries");
    } catch (err) {
      console.error("Unexpected update error:", err);
      setGeneralErrorKey("edit.saveFailedConnection");
      setIsSubmitting(false);
    }
  };

  const isOwner = user && existingOwner && user.id === existingOwner;

  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <Link
          href={`/recipes/${resolvedParams.id}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("edit.cancelReturn")}
        </Link>

        <div className="border-b border-border pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {t("edit.kicker")}
          </p>
          <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">
            {t("edit.title")}
          </h1>
        </div>

        {authLoading || initialLoading ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-xs uppercase tracking-widest">
              {t("edit.loadingDetails")}
            </p>
          </div>
        ) : !user ? (
          <div className="mt-10 rounded-sm border border-border bg-card p-8 text-center shadow-warm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl text-primary">
              {t("common.loginRequired")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("edit.gateText")}
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild className="uppercase tracking-[0.2em] text-xs">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t("common.login")}
                </Link>
              </Button>
            </div>
          </div>
        ) : !isOwner ? (
          <div className="mt-10 rounded-sm border border-border bg-card p-8 text-center shadow-warm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl text-primary">
              {t("edit.accessDenied")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("edit.accessDeniedText")}
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                asChild
                variant="outline"
                className="uppercase tracking-[0.2em] text-xs"
              >
                <Link href={`/recipes/${resolvedParams.id}`}>
                  {t("edit.backToRecipe")}
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {generalErrorKey && (
              <div className="flex items-start gap-3 rounded-sm border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">{t("edit.updateFailedTitle")}</p>
                  <p className="mt-0.5 text-xs text-destructive/90">
                    {t(generalErrorKey)}
                  </p>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-medium uppercase tracking-wider text-foreground"
              >
                {t("form.titleLabel")}{" "}
                <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title)
                    setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                className={`mt-2 ${errors.title ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.title ? (
                <p className="mt-1 text-xs text-destructive">{errors.title}</p>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("form.titleHint")}
                </p>
              )}
            </div>

            {/* Title EN */}
            <div>
              <label
                htmlFor="title_en"
                className="block text-xs font-medium uppercase tracking-wider text-foreground"
              >
                {t("form.titleEnLabel")}
              </label>
              <Input
                id="title_en"
                type="text"
                value={titleEn}
                onChange={(e) => {
                  setTitleEn(e.target.value);
                  if (errors.title_en)
                    setErrors((prev) => ({ ...prev, title_en: undefined }));
                }}
                className={`mt-2 ${errors.title_en ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.title_en ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.title_en}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("form.titleEnHint")}
                </p>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <label
                htmlFor="ingredients"
                className="block text-xs font-medium uppercase tracking-wider text-foreground"
              >
                {t("form.ingredientsLabel")}{" "}
                <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="ingredients"
                rows={5}
                value={ingredients}
                onChange={(e) => {
                  setIngredients(e.target.value);
                  if (errors.ingredients)
                    setErrors((prev) => ({ ...prev, ingredients: undefined }));
                }}
                className={`mt-2 ${errors.ingredients ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.ingredients ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.ingredients}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("form.ingredientsHint")}
                </p>
              )}
            </div>

            {/* Ingredients in English (optional translation) */}
            <div>
              <label
                htmlFor="ingredients_en"
                className="block text-xs font-medium uppercase tracking-wider text-foreground"
              >
                {t("form.ingredientsEnLabel")}
              </label>
              <Textarea
                id="ingredients_en"
                rows={5}
                value={ingredientsEn}
                onChange={(e) => {
                  setIngredientsEn(e.target.value);
                  if (errors.ingredients_en)
                    setErrors((prev) => ({
                      ...prev,
                      ingredients_en: undefined,
                    }));
                }}
                className={`mt-2 ${errors.ingredients_en ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.ingredients_en ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.ingredients_en}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("form.ingredientsEnHint")}
                </p>
              )}
            </div>

            {/* Steps */}
            <div>
              <label
                htmlFor="steps"
                className="block text-xs font-medium uppercase tracking-wider text-foreground"
              >
                {t("form.stepsLabel")}{" "}
                <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="steps"
                rows={6}
                value={steps}
                onChange={(e) => {
                  setSteps(e.target.value);
                  if (errors.steps)
                    setErrors((prev) => ({ ...prev, steps: undefined }));
                }}
                className={`mt-2 ${errors.steps ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.steps ? (
                <p className="mt-1 text-xs text-destructive">{errors.steps}</p>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("form.stepsHint")}
                </p>
              )}
            </div>

            {/* Cooking steps in English (optional translation) */}
            <div>
              <label
                htmlFor="steps_en"
                className="block text-xs font-medium uppercase tracking-wider text-foreground"
              >
                {t("form.stepsEnLabel")}
              </label>
              <Textarea
                id="steps_en"
                rows={6}
                value={stepsEn}
                onChange={(e) => {
                  setStepsEn(e.target.value);
                  if (errors.steps_en)
                    setErrors((prev) => ({ ...prev, steps_en: undefined }));
                }}
                className={`mt-2 ${errors.steps_en ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.steps_en ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.steps_en}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("form.stepsEnHint")}
                </p>
              )}
            </div>

            {/* Source / Contributor */}
            <div>
              <label
                htmlFor="source"
                className="block text-xs font-medium uppercase tracking-wider text-foreground"
              >
                {t("form.sourceLabel")}
              </label>
              <Input
                id="source"
                type="text"
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  if (errors.source)
                    setErrors((prev) => ({ ...prev, source: undefined }));
                }}
                className={`mt-2 ${errors.source ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.source ? (
                <p className="mt-1 text-xs text-destructive">{errors.source}</p>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("form.sourceHint")}
                </p>
              )}
            </div>

            {/* Source in English (optional translation) */}
            <div>
              <label
                htmlFor="source_en"
                className="block text-xs font-medium uppercase tracking-wider text-foreground"
              >
                {t("form.sourceEnLabel")}
              </label>
              <Input
                id="source_en"
                type="text"
                value={sourceEn}
                onChange={(e) => {
                  setSourceEn(e.target.value);
                  if (errors.source_en)
                    setErrors((prev) => ({ ...prev, source_en: undefined }));
                }}
                className={`mt-2 ${errors.source_en ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.source_en ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.source_en}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("form.sourceEnHint")}
                </p>
              )}
            </div>

            {/* Photo Upload (Optional on edit) */}
            <div>
              <label
                htmlFor="photo"
                className="block text-xs font-medium uppercase tracking-wider text-foreground"
              >
                {t("form.photoOptionalLabel")}
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
                      alt="Dish photo preview"
                      className="h-44 w-full max-w-md rounded-sm object-cover shadow-sm"
                    />
                    <p className="mt-2 text-xs font-medium text-primary">
                      {photoFile
                        ? t("form.photoChangeNew", { name: photoFile.name })
                        : t("form.photoChooseNew")}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-muted p-3 text-muted-foreground">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="mt-2 text-xs font-medium text-foreground">
                      {t("form.photoSelectNew")}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {t("form.photoFormats")}
                    </p>
                  </div>
                )}
              </div>

              {errors.photo && (
                <p className="mt-1 text-xs text-destructive">{errors.photo}</p>
              )}
            </div>

            {/* Submit Actions */}
            <div className="pt-4 border-t border-border flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/recipes/${resolvedParams.id}`)}
                disabled={isSubmitting}
                className="uppercase tracking-[0.2em] text-xs"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[160px] uppercase tracking-[0.2em] text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("edit.saving")}
                  </>
                ) : (
                  t("edit.save")
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </SiteChrome>
  );
}
