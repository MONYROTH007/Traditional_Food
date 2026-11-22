"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Recipe } from "@/data/recipes";

export type Lang = "km" | "en";

const STORAGE_KEY = "tkr-lang";
const DEFAULT_LANG: Lang = "km";

/**
 * Every UI string in the app, in English and Khmer. Keys are grouped by
 * screen with a dot prefix. Both languages must define the same keys —
 * the `satisfies` check below enforces it at compile time.
 */
const en = {
  // Site chrome
  "brand.title": "Traditional Khmer Recipes",
  "brand.subtitle": "Battambang Province",
  "nav.home": "Home",
  "nav.recipes": "Recipes",
  "nav.myEntries": "My Entries",
  "nav.review": "Review",
  "nav.contribute": "Contribute",
  "nav.login": "Log In",
  "nav.signup": "Sign Up",
  "nav.logout": "Logout",
  "nav.menu": "Menu",
  "footer.tagline":
    "Recipes kept by families of Battambang province, Cambodia.",

  // Common
  "common.loading": "Loading...",
  "common.checkingAuth": "Checking Authentication...",
  "common.loginRequired": "Login Required",
  "common.login": "Log In",
  "common.signup": "Sign Up",
  "common.cancel": "Cancel",
  "common.edit": "Edit",
  "common.delete": "Delete",
  "common.view": "View",
  "common.from": "From",
  "common.time": "Time",
  "common.contributedBy": "Contributed by",
  "common.ingredients": "Ingredients",
  "common.cooking": "Preparation & Cooking",
  "common.categoryAll": "All",

  // Recipe metadata that is generated rather than stored, so it must be
  // produced in the active language instead of baked in at mapping time.
  "recipe.note": "{title} — a traditional dish of Battambang province.",
  "recipe.defaultTime": "30 min",
  "recipe.defaultServings": "Serves 4",
  "recipe.unknownPlace": "Battambang province",
  "recipe.unknownContributor": "Battambang heritage kitchen",
  "recipe.communityContributor": "Community contributor",

  // Categories (display labels; stored values stay in English)
  "cat.Soups & Stews": "Soups & Stews",
  "cat.Main Dishes": "Main Dishes",
  "cat.Noodles & Rice": "Noodles & Rice",
  "cat.Snacks & Desserts": "Snacks & Desserts",

  // Entry statuses
  "status.published": "Published",
  "status.pending": "Pending Review",
  "status.returned": "Returned for Revisions",

  // Home page
  "home.heroTitle": "Traditional Khmer Recipes",
  "home.heroText":
    "Traditional dishes from Battambang province, written the way they were taught at the table.",
  "home.heroCta": "See the recipes",
  "home.popular": "Popular Dishes",
  "home.allDishes": "All dishes",
  "home.noEntriesTitle": "No entries yet",
  "home.noEntriesText": "No traditional food entries found in the database.",
  "home.aboutKicker": "Heritage & Craft",
  "home.aboutTitle": "Kept in the Family",
  "home.card1Title": "The Land & River",
  "home.card1Text":
    "Battambang has fed Cambodia for generations. Its rice fields, its river and its old shophouse streets all leave a mark on the cooking: sour soups thickened with toasted rice, coconut steamed in banana leaf, sticky rice roasted inside bamboo.",
  "home.card1Tag": "Rice Bowl of Cambodia",
  "home.card2Title": "Written at the Table",
  "home.card2Text":
    "These pages hold nine of those dishes. Each one was written down the way it was explained to us at the table — by measure of hand, not of cup — then tested until it tasted the way it was remembered.",
  "home.card2Tag": "Family Handed-Down",
  "home.card3Title": "Uncompromised Taste",
  "home.card3Text":
    "Nothing here is modernised. The lemongrass paste is pounded, the charcoal is real, and the prahok is not left out. Pure, unadulterated flavor kept intact.",
  "home.card3Tag": "Traditional Methods",

  // Recipes list page
  "recipes.kicker": "Battambang",
  "recipes.title": "The Recipes",
  "recipes.intro":
    "Dishes cooked in the villages, markets and riverside kitchens of Battambang province.",
  "recipes.contributeCta": "Contribute Recipe",
  "recipes.searchPlaceholder": "Search recipes, ingredients, locations...",
  "recipes.clearSearch": "Clear search query",
  "recipes.categoryLabel": "Category:",
  "recipes.pagination": "Pagination",
  "recipes.prev": "Prev",
  "recipes.next": "Next",
  "recipes.pageOf": "Page {page} of {total} · ",
  "recipes.showing": "{shown} of {total} matching dishes",
  "recipes.filteredFrom": " (filtered from {all})",
  "recipes.noDbTitle": "No entries in database",
  "recipes.noDbText":
    "There are currently no traditional food entries stored in Supabase.",
  "recipes.notFoundTitle": "No recipes found",
  "recipes.notFoundText": 'We couldn’t find any dishes matching "{query}".',
  "recipes.resetFilters": "Reset Filters",

  // Recipe card
  "card.loginToView": "Login to view",
  "card.viewDetails": "View Recipe Details",
  "card.editEntry": "Edit Entry",
  "card.viewDeletePage": "View / Delete Page",
  "card.authPromptText":
    "Full ingredients list and traditional step-by-step cooking instructions for {name} are reserved for registered users.",
  "card.authPromptBox":
    "Please log in to your account or create a new account to unlock all heritage recipes across all pages.",
  "card.createAccount": "Create Account",

  // Recipe detail page
  "detail.backToAll": "Back to all recipes",
  "detail.deleting": "Deleting...",
  "detail.deleteConfirm":
    'Are you sure you want to delete "{name}"? This action cannot be undone.',
  "detail.saveFailed": "That change wasn't saved",
  "detail.returnedTitle": "Returned for Revisions",
  "detail.returnedText":
    "Curators requested edits on this recipe. Please click Edit above to update and resubmit.",
  "detail.pendingTitle": "Pending Curator Review",
  "detail.pendingText":
    "This recipe is in the curation review queue and will be visible publicly once approved.",
  "detail.notFoundTitle": "Recipe Not Found",
  "detail.notFoundText":
    "The recipe you are looking for does not exist or has been removed.",
  "detail.viewAll": "View All Recipes",

  // Auth pages
  "auth.kicker": "Account",
  "auth.loginTitle": "Log In",
  "auth.loginIntro":
    "Sign in to access traditional recipes and saved collections.",
  "auth.invalidCreds": "Invalid email or password",
  "auth.email": "Email Address",
  "auth.password": "Password",
  "auth.loggingIn": "Logging in...",
  "auth.noAccount": "Don't have an account?",
  "auth.signupLink": "Sign up",
  "auth.signupTitle": "Sign Up",
  "auth.signupIntro":
    "Create an account to save and access traditional Khmer recipes.",
  "auth.fullName": "Full Name",
  "auth.fullNamePlaceholder": "e.g. Sothea Chan",
  "auth.confirmPassword": "Confirm Password",
  "auth.creating": "Creating Account...",
  "auth.haveAccount": "Already have an account?",
  "auth.loginLink": "Log in",
  "auth.errFullName": "Please enter your full name",
  "auth.errPasswordMatch": "Passwords do not match",
  "auth.errPasswordLength": "Password must be at least 6 characters",
  "auth.signupSuccess": "Account created successfully! Auto logging in...",
  "auth.unexpected": "An unexpected error occurred",

  // Contribute page
  "contribute.kicker": "Heritage Archive",
  "contribute.title": "Contribute a Recipe",
  "contribute.intro":
    "Share a traditional Khmer dish from your family or village to be submitted for curation in the Battambang archive.",
  "contribute.viewMyEntries": "View My Entries",
  "contribute.received": "Submission Received",
  "contribute.successBody":
    'Your dish "{name}" has been submitted to the Battambang Food Archive curators. Curators usually review family recipes within 1–3 business days to verify culinary provenance, ingredient measurements, and photo quality.',
  "contribute.goToMyEntries": "Go to My Entries →",
  "contribute.gateText":
    "Sign up or log in to submit your traditional recipes to the Battambang archive and track their curation.",
  "contribute.saveFailedTitle": "Save Failed",
  "contribute.mustLogin": "You must be logged in to submit a recipe.",
  "contribute.uploadFailed":
    "Photo upload failed. Please verify your internet connection or try another photo.",
  "contribute.insertFailed":
    "Unable to save your entry. Please check your information and try again.",
  "contribute.unexpected": "An unexpected error occurred. Please try again.",
  "contribute.clearForm": "Clear Form",
  "contribute.submit": "Submit Recipe",
  "contribute.submitting": "Uploading & Saving...",

  // Shared form labels (contribute + edit)
  "form.titleLabel": "Dish Name in Khmer",
  "form.titlePlaceholder": "e.g. ឡាបខ្មែរ ឬ អាម៉ុកត្រី",
  "form.titleHint": "Must contain Khmer script (2–120 characters).",
  "form.titleEnLabel": "English Name (optional)",
  "form.titleEnPlaceholder": "e.g. Larb Khmer or Fish Amok",
  "form.titleEnHint":
    "Latin letters, numbers, and common punctuation only (max 100 chars).",
  "form.ingredientsLabel": "Ingredients in Khmer",
  "form.ingredientsPlaceholder":
    "List ingredients in Khmer, one per line, e.g.:\nសាច់គោ ឬសាច់ជ្រូកចិញ្រាំ 400 ក្រាម\nម្សៅអង្ករលីង 2 ស្លាបព្រា\nទឹកក្រូចឆ្មា 3 ស្លាបព្រា",
  "form.ingredientsHint":
    "Write the ingredients in Khmer — this is the version Khmer readers see (10–2000 characters).",
  "form.ingredientsEnLabel": "Ingredients in English (optional)",
  "form.ingredientsEnHint":
    "English translation of the ingredients, shown to readers using the site in English (max 2000 characters).",
  "form.stepsLabel": "Cooking Steps in Khmer",
  "form.stepsPlaceholder":
    "Describe the steps in Khmer, one per line, e.g.:\n1. ដាំខ្ទះឱ្យក្តៅ រួចឆាសាច់ជាមួយប្រហុករហូតឈ្អិន។\n2. ដួសសាច់ដាក់ចាន រួចដាក់ទឹកក្រូចឆ្មា និងទឹកត្រី។",
  "form.stepsHint":
    "Write the steps in Khmer — this is the version Khmer readers see (20–3000 characters).",
  "form.stepsEnLabel": "Cooking Steps in English (optional)",
  "form.stepsEnHint":
    "English translation of the cooking steps, shown to readers using the site in English (max 3000 characters).",
  "form.sourceLabel": "Source / Contributor Name",
  "form.sourcePlaceholder":
    "e.g. Grandma Sokha (Wat Kor) or Family tables across Battambang",
  "form.sourceHint":
    "Your name, family cook, or village provenance (who or where the recipe came from). Defaults to your account name if left empty.",
  "form.photoLabel": "Dish Photo",
  "form.photoOptionalLabel": "Dish Photo (optional to update)",
  "form.photoSelect": "Click to select a photo of the dish",
  "form.photoSelectNew": "Click to select a new photo for this dish",
  "form.photoFormats": "JPG, PNG, or WebP formats supported (max 5 MB)",
  "form.photoChange": "Click to change photo ({name})",
  "form.photoChangeNew": "Click to change new photo ({name})",
  "form.photoChooseNew": "Click to choose a new photo file",
  "form.errTitleRequired": "Khmer dish title is required.",
  "form.errTitleLength": "Title must be between 2 and 120 characters.",
  "form.errTitleKhmer": "Title must contain Khmer script (e.g. ឡាបខ្មែរ).",
  "form.errTitleEnLength": "English title must be 100 characters or less.",
  "form.errTitleEnLatin": "English title must contain Latin characters only.",
  "form.errIngredientsRequired": "Ingredients list is required.",
  "form.errIngredientsLength":
    "Ingredients must be between 10 and 2000 characters.",
  "form.errIngredientsEnLength":
    "English ingredients must be 2000 characters or less.",
  "form.errStepsRequired": "Cooking steps are required.",
  "form.errStepsLength": "Steps must be between 20 and 3000 characters.",
  "form.errStepsEnLength": "English steps must be 3000 characters or less.",
  "form.errSourceLength": "Source must be 150 characters or less.",
  "form.errPhotoRequired": "A photo of the dish is required.",
  "form.errPhotoType": "Only JPG, PNG, or WebP photo files are allowed.",
  "form.errPhotoSize": "Photo file size must not exceed 5 MB.",

  // Edit page
  "edit.cancelReturn": "Cancel and return to recipe",
  "edit.kicker": "Edit Recipe",
  "edit.title": "Update Entry",
  "edit.loadingDetails": "Loading recipe details...",
  "edit.gateText": "You must be logged in to edit recipes.",
  "edit.accessDenied": "Access Denied",
  "edit.accessDeniedText":
    "Only the owner of this recipe entry is authorized to edit it.",
  "edit.backToRecipe": "Back to Recipe",
  "edit.updateFailedTitle": "Update Failed",
  "edit.notFound": "Recipe entry not found.",
  "edit.mustLogin": "You must be logged in to update a recipe.",
  "edit.noPermission": "You do not have permission to edit this recipe.",
  "edit.saveFailed":
    "That change wasn't saved. Please check your inputs and try again.",
  "edit.saveFailedConnection":
    "That change wasn't saved. Please check your connection and try again.",
  "edit.save": "Save Changes",
  "edit.saving": "Saving Changes...",

  // My entries page
  "myEntries.kicker": "Contributor Dashboard",
  "myEntries.title": "My Entries",
  "myEntries.intro":
    "Track the curation and review status of all your traditional recipes submitted to the Battambang archive.",
  "myEntries.submit": "Submit Recipe",
  "myEntries.gateText":
    "You must be logged in to view your submitted entries and track their review status.",
  "myEntries.total": "Total Submissions",
  "myEntries.loadError":
    "Unable to load your entries. Please refresh to try again.",
  "myEntries.unexpectedLoadError":
    "An unexpected error occurred while loading your entries.",
  "myEntries.revisionsRequested": "Revisions Requested",
  "myEntries.revisionsText":
    "Curators requested edits. Click Edit below to update and resubmit.",
  "myEntries.emptyTitle": "No Entries Found",
  "myEntries.emptyText":
    "You haven't contributed any traditional recipes yet. Share a family recipe from Battambang to get started!",
  "myEntries.submitFirst": "Submit Your First Recipe",

  // Review queue
  "review.kicker": "Kitchen Review Queue",
  "review.title": "Recipe Review Queue",
  "review.pendingCount": "{count} pending",
  "review.intro":
    "Review community submissions from Battambang province. Approve traditional dishes for the public archive or return them for revision.",
  "review.error":
    "Unable to update entry status. Please check your connection and try again.",
  "review.emptyTitle": "Queue is Empty",
  "review.emptyText":
    "All submitted recipes have been reviewed. The kitchen is all caught up!",
  "review.browseArchive": "Browse Public Archive",
  "review.recentlySubmitted": "Recently submitted",
  "review.cookingMethod": "Cooking Method",
  "review.reject": "Reject / Return",
  "review.approve": "Approve & Publish",
  "review.returning": "Returning...",
  "review.publishing": "Publishing...",

  // Contact / community notes section
  "contact.communityKicker": "Community Contributions",
  "contact.notesTitle": "Notes to Our Kitchen",
  "contact.storiesTag": "Stories & Dish Variations",
  "contact.deleteNote": "Delete your note",
  "contact.deleteConfirm": "Are you sure you want to delete your note?",
  "contact.submitted": "Submitted {date}",
  "contact.justNow": "Just now",
  "contact.yourNote": "Your Note",
  "contact.kicker": "Contact Us",
  "contact.writeTitle": "Write to Our Kitchen",
  "contact.intro":
    "If your family cooks one of these dishes another way, or if you have memories and stories from Battambang's old shophouses and markets, we would love to hear from you.",
  "contact.addressTag": "Battambang Province, Cambodia",
  "contact.preserveText":
    "Preserving traditional culinary heritage measure by measure, passed down through generations.",
  "contact.thankYou": "Thank You",
  "contact.sentText":
    "Your note has been saved and published to Notes to Our Kitchen above!",
  "contact.loggedIn": "Logged In Contributor",
  "contact.name": "Name",
  "contact.namePlaceholder": "Your name",
  "contact.email": "Email",
  "contact.yourMessage": "Your Message",
  "contact.messagePlaceholder": "Tell us how your family prepares this dish...",
  "contact.sending": "Sending...",
  "contact.sendNote": "Send Note",
};

const km = {
  // Site chrome
  "brand.title": "រូបមន្តម្ហូបខ្មែរបុរាណ",
  "brand.subtitle": "ខេត្តបាត់ដំបង",
  "nav.home": "ទំព័រដើម",
  "nav.recipes": "រូបមន្តម្ហូប",
  "nav.myEntries": "រូបមន្តរបស់ខ្ញុំ",
  "nav.review": "ត្រួតពិនិត្យ",
  "nav.contribute": "រួមចំណែក",
  "nav.login": "ចូលគណនី",
  "nav.signup": "បង្កើតគណនី",
  "nav.logout": "ចាកចេញ",
  "nav.menu": "ម៉ឺនុយ",
  "footer.tagline":
    "រូបមន្តដែលរក្សាទុកដោយគ្រួសារនៅខេត្តបាត់ដំបង ប្រទេសកម្ពុជា។",

  // Common
  "common.loading": "កំពុងដំណើរការ...",
  "common.checkingAuth": "កំពុងផ្ទៀងផ្ទាត់គណនី...",
  "common.loginRequired": "តម្រូវឱ្យចូលគណនី",
  "common.login": "ចូលគណនី",
  "common.signup": "បង្កើតគណនី",
  "common.cancel": "បោះបង់",
  "common.edit": "កែសម្រួល",
  "common.delete": "លុប",
  "common.view": "មើល",
  "common.from": "មកពី",
  "common.time": "រយៈពេល",
  "common.contributedBy": "អ្នករួមចំណែក",
  "common.ingredients": "គ្រឿងផ្សំ",
  "common.cooking": "វិធីធ្វើ",
  "common.categoryAll": "ទាំងអស់",

  // Recipe metadata that is generated rather than stored.
  "recipe.note": "{title} — ម្ហូបបុរាណនៃខេត្តបាត់ដំបង។",
  "recipe.defaultTime": "៣០ នាទី",
  "recipe.defaultServings": "សម្រាប់ ៤ នាក់",
  "recipe.unknownPlace": "ខេត្តបាត់ដំបង",
  "recipe.unknownContributor": "ផ្ទះបាយបេតិកភណ្ឌបាត់ដំបង",
  "recipe.communityContributor": "អ្នករួមចំណែកក្នុងសហគមន៍",

  // Categories
  "cat.Soups & Stews": "សម្ល និងស៊ុប",
  "cat.Main Dishes": "ម្ហូបមេ",
  "cat.Noodles & Rice": "មី និងបាយ",
  "cat.Snacks & Desserts": "ចំណី និងបង្អែម",

  // Entry statuses
  "status.published": "បានផ្សព្វផ្សាយ",
  "status.pending": "កំពុងរង់ចាំការពិនិត្យ",
  "status.returned": "បានប្រគល់ត្រឡប់មកវិញ",

  // Home page
  "home.heroTitle": "រូបមន្តម្ហូបខ្មែរបុរាណ",
  "home.heroText": "ម្ហូបបុរាណពីខេត្តបាត់ដំបង កត់ត្រាតាមការបង្រៀននៅតុបាយពិត។",
  "home.heroCta": "មើលរូបមន្តទាំងអស់",
  "home.popular": "ម្ហូបពេញនិយម",
  "home.allDishes": "ម្ហូបទាំងអស់",
  "home.noEntriesTitle": "មិនទាន់មានទិន្នន័យ",
  "home.noEntriesText": "រកមិនឃើញទិន្នន័យម្ហូបបុរាណក្នុងមូលដ្ឋានទិន្នន័យទេ។",
  "home.aboutKicker": "បេតិកភណ្ឌ និងសិប្បកម្ម",
  "home.aboutTitle": "រក្សាទុកក្នុងគ្រួសារ",
  "home.card1Title": "ដី និងទន្លេ",
  "home.card1Text":
    "ខេត្តបាត់ដំបងបានចិញ្ចឹមកម្ពុជាអស់ជាច្រើនជំនាន់មកហើយ។ វាលស្រែ ទន្លេ និងផ្លូវផ្ទះល្វែងចាស់ៗ សុទ្ធតែបន្សល់ស្នាមលើម្ហូបាហារ៖ សម្លម្ជូរខាប់ដោយអង្ករលីង ដូងចំហុយក្នុងស្លឹកចេក និងក្រឡានដុតក្នុងបំពង់ឫស្សី។",
  "home.card1Tag": "ជង្រុកស្រូវនៃកម្ពុជា",
  "home.card2Title": "កត់ត្រានៅតុបាយ",
  "home.card2Text":
    "ទំព័រទាំងនេះផ្ទុកម្ហូបចំនួនប្រាំបួនមុខ។ មុខម្ហូបនីមួយៗត្រូវបានកត់ត្រាតាមការពន្យល់នៅតុបាយ — វាស់ដោយដៃ មិនមែនដោយពែងទេ — រួចសាកល្បងរហូតដល់រសជាតិដូចការចងចាំ។",
  "home.card2Tag": "មរតកគ្រួសារ",
  "home.card3Title": "រសជាតិដើមពិតៗ",
  "home.card3Text":
    "គ្មានអ្វីត្រូវបានកែប្រែទំនើបទេ។ គ្រឿងស្លឹកគ្រៃបុកដោយត្បាល់ ធ្យូងពិត ហើយប្រហុកមិនដែលខ្វះឡើយ។ រសជាតិដើមសុទ្ធសាធត្រូវបានរក្សាទុកដដែល។",
  "home.card3Tag": "វិធីសាស្ត្របុរាណ",

  // Recipes list page
  "recipes.kicker": "បាត់ដំបង",
  "recipes.title": "រូបមន្តម្ហូប",
  "recipes.intro":
    "ម្ហូបដែលចម្អិននៅតាមភូមិ ផ្សារ និងផ្ទះបាយតាមដងទន្លេនៃខេត្តបាត់ដំបង។",
  "recipes.contributeCta": "ចែករំលែករូបមន្ត",
  "recipes.searchPlaceholder": "ស្វែងរករូបមន្ត គ្រឿងផ្សំ ទីកន្លែង...",
  "recipes.clearSearch": "លុបពាក្យស្វែងរក",
  "recipes.categoryLabel": "ប្រភេទ៖",
  "recipes.pagination": "ការបែងចែកទំព័រ",
  "recipes.prev": "មុន",
  "recipes.next": "បន្ទាប់",
  "recipes.pageOf": "ទំព័រ {page} នៃ {total} · ",
  "recipes.showing": "បង្ហាញ {shown} នៃ {total} មុខម្ហូប",
  "recipes.filteredFrom": " (ត្រងចេញពី {all})",
  "recipes.noDbTitle": "គ្មានទិន្នន័យក្នុងមូលដ្ឋានទិន្នន័យ",
  "recipes.noDbText":
    "បច្ចុប្បន្នមិនទាន់មានទិន្នន័យម្ហូបបុរាណក្នុង Supabase នៅឡើយទេ។",
  "recipes.notFoundTitle": "រកមិនឃើញរូបមន្ត",
  "recipes.notFoundText": 'យើងរកមិនឃើញមុខម្ហូបណាដែលត្រូវនឹង "{query}" ទេ។',
  "recipes.resetFilters": "កំណត់តម្រងឡើងវិញ",

  // Recipe card
  "card.loginToView": "ចូលគណនីដើម្បីមើល",
  "card.viewDetails": "មើលរូបមន្តលម្អិត",
  "card.editEntry": "កែសម្រួល",
  "card.viewDeletePage": "មើល / លុប",
  "card.authPromptText":
    "គ្រឿងផ្សំពេញលេញ និងវិធីធ្វើលម្អិតសម្រាប់ {name} ត្រូវបានកំណត់ទុកសម្រាប់តែអ្នកប្រើដែលបានចុះឈ្មោះប៉ុណ្ណោះ។",
  "card.authPromptBox":
    "សូមចូលគណនី ឬបង្កើតគណនីថ្មី ដើម្បីមើលរូបមន្តបេតិកភណ្ឌទាំងអស់។",
  "card.createAccount": "បង្កើតគណនី",

  // Recipe detail page
  "detail.backToAll": "ត្រឡប់ទៅរូបមន្តទាំងអស់",
  "detail.deleting": "កំពុងលុប...",
  "detail.deleteConfirm":
    'តើអ្នកពិតជាចង់លុប "{name}" មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
  "detail.saveFailed": "មិនអាចរក្សាទុកការផ្លាស់ប្តូរបានទេ",
  "detail.returnedTitle": "បានប្រគល់ត្រឡប់មកវិញ",
  "detail.returnedText":
    "អ្នកត្រួតពិនិត្យបានស្នើសុំឱ្យកែសម្រួលរូបមន្តនេះ។ សូមចុចប៊ូតុងកែសម្រួលខាងលើ ដើម្បីកែ និងដាក់ស្នើម្តងទៀត។",
  "detail.pendingTitle": "កំពុងរង់ចាំការពិនិត្យ",
  "detail.pendingText":
    "រូបមន្តនេះកំពុងស្ថិតក្នុងបញ្ជីរង់ចាំការពិនិត្យ។ វានឹងបង្ហាញជាសាធារណៈបន្ទាប់ពីត្រូវបានអនុម័ត។",
  "detail.notFoundTitle": "រកមិនឃើញរូបមន្ត",
  "detail.notFoundText": "រូបមន្តដែលអ្នកកំពុងស្វែងរកមិនមាន ឬត្រូវបានលុបចេញហើយ។",
  "detail.viewAll": "មើលរូបមន្តទាំងអស់",

  // Auth pages
  "auth.kicker": "គណនី",
  "auth.loginTitle": "ចូលគណនី",
  "auth.loginIntro": "ចូលគណនីដើម្បីមើលរូបមន្តបុរាណ និងការរក្សាទុករបស់អ្នក។",
  "auth.invalidCreds": "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ",
  "auth.email": "អាសយដ្ឋានអ៊ីមែល",
  "auth.password": "ពាក្យសម្ងាត់",
  "auth.loggingIn": "កំពុងចូលគណនី...",
  "auth.noAccount": "មិនទាន់មានគណនីមែនទេ?",
  "auth.signupLink": "បង្កើតគណនី",
  "auth.signupTitle": "បង្កើតគណនី",
  "auth.signupIntro": "បង្កើតគណនីដើម្បីរក្សាទុក និងមើលរូបមន្តម្ហូបខ្មែរបុរាណ។",
  "auth.fullName": "ឈ្មោះពេញ",
  "auth.fullNamePlaceholder": "ឧ. សុធា ចាន់",
  "auth.confirmPassword": "បញ្ជាក់ពាក្យសម្ងាត់",
  "auth.creating": "កំពុងបង្កើតគណនី...",
  "auth.haveAccount": "មានគណនីរួចហើយមែនទេ?",
  "auth.loginLink": "ចូលគណនី",
  "auth.errFullName": "សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក",
  "auth.errPasswordMatch": "ពាក្យសម្ងាត់មិនដូចគ្នាទេ",
  "auth.errPasswordLength": "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច 6 តួអក្សរ",
  "auth.signupSuccess": "បង្កើតគណនីបានជោគជ័យ! កំពុងចូលគណនីដោយស្វ័យប្រវត្តិ...",
  "auth.unexpected": "មានកំហុសដែលមិនរំពឹងទុកបានកើតឡើង",

  // Contribute page
  "contribute.kicker": "បណ្ណសារបេតិកភណ្ឌ",
  "contribute.title": "ចែករំលែករូបមន្ត",
  "contribute.intro":
    "ចែករំលែកម្ហូបខ្មែរបុរាណពីគ្រួសារ ឬភូមិរបស់អ្នក ដើម្បីដាក់ចូលក្នុងបណ្ណសារបាត់ដំបង។",
  "contribute.viewMyEntries": "មើលរូបមន្តរបស់ខ្ញុំ",
  "contribute.received": "បានទទួលការដាក់ស្នើ",
  "contribute.successBody":
    'ម្ហូប "{name}" របស់អ្នកត្រូវបានដាក់ជូនអ្នកត្រួតពិនិត្យបណ្ណសារ។ ជាធម្មតា ការពិនិត្យមានរយៈពេល 1–3 ថ្ងៃនៃថ្ងៃធ្វើការ។',
  "contribute.goToMyEntries": "ទៅកាន់រូបមន្តរបស់ខ្ញុំ →",
  "contribute.gateText":
    "សូមបង្កើតគណនី ឬចូលគណនី ដើម្បីដាក់ស្នើរូបមន្តបុរាណ និងតាមដានស្ថានភាពរបស់វា។",
  "contribute.saveFailedTitle": "ការរក្សាទុកបរាជ័យ",
  "contribute.mustLogin": "អ្នកត្រូវចូលគណនីដើម្បីដាក់ស្នើរូបមន្ត។",
  "contribute.uploadFailed":
    "ការផ្ទុករូបភាពបរាជ័យ។ សូមពិនិត្យអ៊ីនធឺណិត ឬសាករូបភាពផ្សេង។",
  "contribute.insertFailed":
    "មិនអាចរក្សាទុកទិន្នន័យរបស់អ្នកបានទេ។ សូមពិនិត្យព័ត៌មាន ហើយព្យាយាមម្តងទៀត។",
  "contribute.unexpected": "មានកំហុសដែលមិនរំពឹងទុក។ សូមព្យាយាមម្តងទៀត។",
  "contribute.clearForm": "សម្អាតទម្រង់",
  "contribute.submit": "ដាក់ស្នើរូបមន្ត",
  "contribute.submitting": "កំពុងផ្ទុក និងរក្សាទុក...",

  // Shared form labels
  "form.titleLabel": "ឈ្មោះម្ហូបជាភាសាខ្មែរ",
  "form.titlePlaceholder": "ឧ. ឡាបខ្មែរ ឬ អាម៉ុកត្រី",
  "form.titleHint": "ត្រូវមានអក្សរខ្មែរ (2–120 តួអក្សរ)។",
  "form.titleEnLabel": "ឈ្មោះជាភាសាអង់គ្លេស (ស្រេចចិត្ត)",
  "form.titleEnPlaceholder": "ឧ. Larb Khmer ឬ Fish Amok",
  "form.titleEnHint":
    "អក្សរឡាតាំង លេខ និងសញ្ញាធម្មតាប៉ុណ្ណោះ (អតិបរមា 100 តួអក្សរ)។",
  "form.ingredientsLabel": "គ្រឿងផ្សំជាភាសាខ្មែរ",
  "form.ingredientsPlaceholder":
    "សរសេរគ្រឿងផ្សំមួយបន្ទាត់ម្តង ឧ.:\nសាច់គោ ឬសាច់ជ្រូកចិញ្រាំ 400 ក្រាម\nម្សៅអង្ករលីង 2 ស្លាបព្រា\nទឹកក្រូចឆ្មា 3 ស្លាបព្រា",
  "form.ingredientsHint":
    "សរសេរគ្រឿងផ្សំជាភាសាខ្មែរ — នេះជាអត្ថបទដែលអ្នកអានជាភាសាខ្មែរនឹងឃើញ (10–2000 តួអក្សរ)។",
  "form.ingredientsEnLabel": "គ្រឿងផ្សំជាភាសាអង់គ្លេស (ស្រេចចិត្ត)",
  "form.ingredientsEnHint":
    "ការបកប្រែគ្រឿងផ្សំជាភាសាអង់គ្លេស សម្រាប់អ្នកអានជាភាសាអង់គ្លេស (អតិបរមា 2000 តួអក្សរ)។",
  "form.stepsLabel": "វិធីធ្វើជាភាសាខ្មែរ",
  "form.stepsPlaceholder":
    "ពណ៌នាវិធីធ្វើមួយជំហានម្តង ឧ.:\n1. ដាំខ្ទះឱ្យក្តៅ រួចឆាសាច់ជាមួយប្រហុករហូតឈ្អិន។\n2. ដួសសាច់ដាក់ចាន រួចដាក់ទឹកក្រូចឆ្មា និងទឹកត្រី។",
  "form.stepsHint":
    "សរសេរវិធីធ្វើជាភាសាខ្មែរ — នេះជាអត្ថបទដែលអ្នកអានជាភាសាខ្មែរនឹងឃើញ (20–3000 តួអក្សរ)។",
  "form.stepsEnLabel": "វិធីធ្វើជាភាសាអង់គ្លេស (ស្រេចចិត្ត)",
  "form.stepsEnHint":
    "ការបកប្រែវិធីធ្វើជាភាសាអង់គ្លេស សម្រាប់អ្នកអានជាភាសាអង់គ្លេស (អតិបរមា 3000 តួអក្សរ)។",
  "form.sourceLabel": "ប្រភព ឬឈ្មោះអ្នករួមចំណែក",
  "form.sourcePlaceholder": "ឧ. យាយសុខា (វត្តគរ) ឬតុបាយគ្រួសារនៅបាត់ដំបង",
  "form.sourceHint":
    "ឈ្មោះរបស់អ្នក អ្នកចម្អិនក្នុងគ្រួសារ ឬប្រភពភូមិ (ប្រសិនបើទុកទទេ នឹងប្រើឈ្មោះគណនីរបស់អ្នក)។",
  "form.photoLabel": "រូបភាពម្ហូប",
  "form.photoOptionalLabel": "រូបភាពម្ហូប (ស្រេចចិត្តក្នុងការកែ)",
  "form.photoSelect": "ចុចដើម្បីជ្រើសរើសរូបភាពម្ហូប",
  "form.photoSelectNew": "ចុចដើម្បីជ្រើសរើសរូបភាពថ្មី",
  "form.photoFormats": "គាំទ្រ JPG, PNG ឬ WebP (អតិបរមា 5 MB)",
  "form.photoChange": "ចុចដើម្បីផ្លាស់ប្តូររូបភាព ({name})",
  "form.photoChangeNew": "ចុចដើម្បីផ្លាស់ប្តូររូបភាពថ្មី ({name})",
  "form.photoChooseNew": "ចុចដើម្បីជ្រើសរើសរូបភាពថ្មី",
  "form.errTitleRequired": "ត្រូវបញ្ចូលឈ្មោះម្ហូបជាភាសាខ្មែរ។",
  "form.errTitleLength": "ឈ្មោះត្រូវមានពី 2 ដល់ 120 តួអក្សរ។",
  "form.errTitleKhmer": "ឈ្មោះត្រូវមានអក្សរខ្មែរ (ឧ. ឡាបខ្មែរ)។",
  "form.errTitleEnLength": "ឈ្មោះអង់គ្លេសត្រូវតិចជាង ឬស្មើ 100 តួអក្សរ។",
  "form.errTitleEnLatin": "ឈ្មោះអង់គ្លេសត្រូវប្រើអក្សរឡាតាំងប៉ុណ្ណោះ។",
  "form.errIngredientsRequired": "ត្រូវបញ្ចូលបញ្ជីគ្រឿងផ្សំ។",
  "form.errIngredientsLength": "គ្រឿងផ្សំត្រូវមានពី 10 ដល់ 2000 តួអក្សរ។",
  "form.errIngredientsEnLength":
    "គ្រឿងផ្សំអង់គ្លេសត្រូវតិចជាង ឬស្មើ 2000 តួអក្សរ។",
  "form.errStepsRequired": "ត្រូវបញ្ចូលវិធីធ្វើ។",
  "form.errStepsLength": "វិធីធ្វើត្រូវមានពី 20 ដល់ 3000 តួអក្សរ។",
  "form.errStepsEnLength": "វិធីធ្វើអង់គ្លេសត្រូវតិចជាង ឬស្មើ 3000 តួអក្សរ។",
  "form.errSourceLength": "ប្រភពត្រូវតិចជាង ឬស្មើ 150 តួអក្សរ។",
  "form.errPhotoRequired": "ត្រូវភ្ជាប់រូបភាពម្ហូប។",
  "form.errPhotoType": "គាំទ្រតែឯកសារ JPG, PNG ឬ WebP ប៉ុណ្ណោះ។",
  "form.errPhotoSize": "ទំហំរូបភាពមិនត្រូវលើសពី 5 MB ទេ។",

  // Edit page
  "edit.cancelReturn": "បោះបង់ ហើយត្រឡប់ទៅរូបមន្ត",
  "edit.kicker": "កែសម្រួលរូបមន្ត",
  "edit.title": "ធ្វើបច្ចុប្បន្នភាពទិន្នន័យ",
  "edit.loadingDetails": "កំពុងទាញយកទិន្នន័យរូបមន្ត...",
  "edit.gateText": "អ្នកត្រូវចូលគណនីដើម្បីកែសម្រួលរូបមន្ត។",
  "edit.accessDenied": "គ្មានសិទ្ធិចូលមើល",
  "edit.accessDeniedText": "មានតែម្ចាស់រូបមន្តនេះប៉ុណ្ណោះដែលអាចកែសម្រួលបាន។",
  "edit.backToRecipe": "ត្រឡប់ទៅរូបមន្ត",
  "edit.updateFailedTitle": "ការកែសម្រួលបរាជ័យ",
  "edit.notFound": "រកមិនឃើញរូបមន្តនេះទេ។",
  "edit.mustLogin": "អ្នកត្រូវចូលគណនីដើម្បីកែសម្រួលរូបមន្ត។",
  "edit.noPermission": "អ្នកមិនមានសិទ្ធិកែសម្រួលរូបមន្តនេះទេ។",
  "edit.saveFailed":
    "មិនអាចរក្សាទុកការកែប្រែបានទេ។ សូមពិនិត្យព័ត៌មាន ហើយព្យាយាមម្តងទៀត។",
  "edit.saveFailedConnection":
    "មិនអាចរក្សាទុកការកែប្រែបានទេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។",
  "edit.save": "រក្សាទុកការកែប្រែ",
  "edit.saving": "កំពុងរក្សាទុក...",

  // My entries page
  "myEntries.kicker": "ផ្ទាំងអ្នករួមចំណែក",
  "myEntries.title": "រូបមន្តរបស់ខ្ញុំ",
  "myEntries.intro":
    "តាមដានស្ថានភាពនៃការពិនិត្យរូបមន្តទាំងអស់ដែលអ្នកបានដាក់ស្នើទៅបណ្ណសារបាត់ដំបង។",
  "myEntries.submit": "ដាក់ស្នើរូបមន្ត",
  "myEntries.gateText":
    "អ្នកត្រូវចូលគណនីដើម្បីមើលរូបមន្តដែលអ្នកបានដាក់ស្នើ និងតាមដានស្ថានភាពពិនិត្យ។",
  "myEntries.total": "ការដាក់ស្នើសរុប",
  "myEntries.loadError":
    "មិនអាចទាញយករូបមន្តរបស់អ្នកបានទេ។ សូមផ្ទុកទំព័រឡើងវិញ។",
  "myEntries.unexpectedLoadError":
    "មានកំហុសដែលមិនរំពឹងទុកពេលកំពុងទាញយករូបមន្តរបស់អ្នក។",
  "myEntries.revisionsRequested": "ស្នើសុំការកែសម្រួល",
  "myEntries.revisionsText":
    "អ្នកត្រួតពិនិត្យបានស្នើសុំការកែសម្រួល។ ចុច កែសម្រួល ខាងក្រោមដើម្បីកែ និងដាក់ស្នើម្តងទៀត។",
  "myEntries.emptyTitle": "មិនទាន់មានរូបមន្ត",
  "myEntries.emptyText":
    "អ្នកមិនទាន់បានចែករំលែករូបមន្តណាមួយនៅឡើយទេ។ ចែករំលែករូបមន្តគ្រួសារពីបាត់ដំបងដើម្បីចាប់ផ្តើម!",
  "myEntries.submitFirst": "ដាក់ស្នើរូបមន្តដំបូងរបស់អ្នក",

  // Review queue
  "review.kicker": "ជួរត្រួតពិនិត្យផ្ទះបាយ",
  "review.title": "ផ្ទៀងផ្ទាត់រូបមន្ត",
  "review.pendingCount": "{count} កំពុងរង់ចាំ",
  "review.intro":
    "ពិនិត្យការដាក់ស្នើពីសហគមន៍នៃខេត្តបាត់ដំបង។ អនុម័តម្ហូបបុរាណសម្រាប់បណ្ណសារសាធារណៈ ឬប្រគល់ត្រឡប់ដើម្បីកែសម្រួល។",
  "review.error":
    "មិនអាចរក្សាទុកការផ្លាស់ប្តូរបានទេ។ សូមពិនិត្យមើលការតភ្ជាប់របស់អ្នក ហើយព្យាយាមម្តងទៀត។",
  "review.emptyTitle": "គ្មានរូបមន្តរង់ចាំការពិនិត្យទេ",
  "review.emptyText":
    "រាល់រូបមន្តដែលបានដាក់ស្នើត្រូវបានពិនិត្យរួចរាល់អស់ហើយ។ សូមត្រឡប់មកពិនិត្យម្តងទៀតនៅពេលក្រោយ។",
  "review.browseArchive": "មើលបណ្ណសារសាធារណៈ",
  "review.recentlySubmitted": "ទើបតែដាក់ស្នើ",
  "review.cookingMethod": "វិធីធ្វើ",
  "review.reject": "បដិសេធ / ប្រគល់ត្រឡប់",
  "review.approve": "អនុម័ត និងផ្សាយ",
  "review.returning": "កំពុងប្រគល់ត្រឡប់...",
  "review.publishing": "កំពុងផ្សាយ...",

  // Contact / community notes section
  "contact.communityKicker": "ការរួមចំណែកពីសហគមន៍",
  "contact.notesTitle": "កំណត់ចំណាំមកកាន់ផ្ទះបាយយើង",
  "contact.storiesTag": "រឿងរ៉ាវ និងការចម្អិនផ្សេងៗ",
  "contact.deleteNote": "លុបកំណត់ចំណាំរបស់អ្នក",
  "contact.deleteConfirm": "តើអ្នកពិតជាចង់លុបកំណត់ចំណាំរបស់អ្នកមែនទេ?",
  "contact.submitted": "ដាក់ស្នើ {date}",
  "contact.justNow": "អំបាញ់មិញនេះ",
  "contact.yourNote": "កំណត់ចំណាំរបស់អ្នក",
  "contact.kicker": "ទាក់ទងយើង",
  "contact.writeTitle": "សរសេរមកកាន់ផ្ទះបាយយើង",
  "contact.intro":
    "ប្រសិនបើគ្រួសារអ្នកចម្អិនម្ហូបទាំងនេះតាមរបៀបផ្សេង ឬមានរឿងរ៉ាវពីផ្សារ និងផ្លូវចាស់ៗនៃបាត់ដំបង យើងចង់ដឹងដែរ។",
  "contact.addressTag": "ខេត្តបាត់ដំបង ប្រទេសកម្ពុជា",
  "contact.preserveText":
    "រក្សាបេតិកភណ្ឌម្ហូបអាហារបុរាណ តពីជំនាន់មួយទៅជំនាន់មួយ។",
  "contact.thankYou": "អរគុណ",
  "contact.sentText": "កំណត់ចំណាំរបស់អ្នកត្រូវបានរក្សាទុក និងបង្ហាញនៅខាងលើ!",
  "contact.loggedIn": "អ្នករួមចំណែកដែលបានចូលគណនី",
  "contact.name": "ឈ្មោះ",
  "contact.namePlaceholder": "ឈ្មោះរបស់អ្នក",
  "contact.email": "អ៊ីមែល",
  "contact.yourMessage": "សាររបស់អ្នក",
  "contact.messagePlaceholder":
    "ប្រាប់យើងពីរបៀបដែលគ្រួសារអ្នកចម្អិនម្ហូបនេះ...",
  "contact.sending": "កំពុងផ្ញើ...",
  "contact.sendNote": "ផ្ញើកំណត់ចំណាំ",
} satisfies Record<keyof typeof en, string>;

export type MsgKey = keyof typeof en;

const MESSAGES: Record<Lang, Record<MsgKey, string>> = { en, km };

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: MsgKey, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always render "km" first so server and client markup match; the stored
  // preference is applied right after mount.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "km") {
        setLangState(stored);
      }
    } catch {
      // Storage unavailable (private mode, etc.) — keep the default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures; the choice still applies for this visit.
    }
  }, []);

  const t = useCallback(
    (key: MsgKey, vars?: Record<string, string | number>) => {
      let text: string = MESSAGES[lang][key] ?? MESSAGES.en[key] ?? key;
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.split(`{${name}}`).join(String(value));
        }
      }
      return text;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

/** Display label for a recipe category in the active language. */
export function categoryLabel(
  t: LanguageContextValue["t"],
  category: string,
): string {
  const key = `cat.${category}` as MsgKey;
  return key in MESSAGES.en ? t(key) : category;
}

/**
 * Language-aware titles for a recipe: the Khmer title leads in Khmer mode,
 * the English title (when present) leads in English mode. `secondary` is
 * empty when the entry has no distinct title in the other language.
 */
export function localizedTitles(
  recipe: Pick<Recipe, "name" | "khmer">,
  lang: Lang,
): { primary: string; secondary: string } {
  const hasDistinctEnglish = recipe.name !== recipe.khmer;
  if (lang === "km") {
    return {
      primary: recipe.khmer,
      secondary: hasDistinctEnglish ? recipe.name : "",
    };
  }
  return {
    primary: hasDistinctEnglish ? recipe.name : recipe.khmer,
    secondary: hasDistinctEnglish ? recipe.khmer : "",
  };
}

/**
 * Ingredients/instructions in the active language. English translations are
 * optional per entry; the original text is the fallback in both directions.
 */
export function localizedBody(
  recipe: Pick<
    Recipe,
    "ingredients" | "instructions" | "ingredientsEn" | "instructionsEn"
  >,
  lang: Lang,
): { ingredients: string[]; instructions: string[] } {
  if (lang === "en") {
    return {
      ingredients: recipe.ingredientsEn?.length
        ? recipe.ingredientsEn
        : recipe.ingredients,
      instructions: recipe.instructionsEn?.length
        ? recipe.instructionsEn
        : recipe.instructions,
    };
  }
  return { ingredients: recipe.ingredients, instructions: recipe.instructions };
}

/**
 * Display metadata for a recipe, produced in the active language.
 *
 * `place`, `contributor`, `time`, `servings` and `note` are derived strings
 * rather than stored columns. They used to be generated in English inside
 * `mapEntryToRecipe`, which meant English sentences and "30 min" appeared on
 * every card even with the UI set to Khmer. Generating them here keeps them
 * in step with the switcher. A contributor's own `source` text is theirs and
 * is shown verbatim — only the fallbacks are translated.
 */
export function recipeMeta(
  recipe:
    | Pick<
        Recipe,
        | "name"
        | "khmer"
        | "place"
        | "contributor"
        | "time"
        | "servings"
        | "note"
      >
    | null
    | undefined,
  t: LanguageContextValue["t"],
  lang: Lang,
): {
  place: string;
  contributor: string;
  time: string;
  servings: string;
  note: string;
} {
  const title = recipe ? localizedTitles(recipe, lang).primary : "";

  return {
    place: recipe?.place?.trim() || t("recipe.unknownPlace"),
    contributor: recipe?.contributor?.trim() || t("recipe.unknownContributor"),
    time: recipe?.time?.trim() || t("recipe.defaultTime"),
    servings: recipe?.servings?.trim() || t("recipe.defaultServings"),
    note: recipe?.note?.trim() || t("recipe.note", { title }),
  };
}

const KM_MONTHS = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
];

const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Formats an ISO timestamp as a short date in the active language.
 *
 * Deliberately does NOT use `toLocaleDateString`: Node often ships without
 * full ICU data for `km-KH`, so the server renders "Oct 8, 2026" while the
 * browser renders "8 តុលា 2026" — a hydration mismatch that makes React throw
 * away and re-render the tree. Reading the date in UTC also keeps server and
 * client in agreement when they sit in different time zones (Vercel runs in
 * UTC; readers are in ICT). Both halves of the render are therefore identical
 * by construction.
 */
export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.getUTCDate();
  const month = d.getUTCMonth();
  const year = d.getUTCFullYear();
  return lang === "km"
    ? `${day} ${KM_MONTHS[month]} ${year}`
    : `${EN_MONTHS[month]} ${day}, ${year}`;
}

/**
 * As `formatDate`, plus a 24-hour time. Used where reviewers need to tell
 * same-day submissions apart in the queue.
 */
export function formatDateTime(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${formatDate(iso, lang)} · ${hh}:${mm}`;
}
