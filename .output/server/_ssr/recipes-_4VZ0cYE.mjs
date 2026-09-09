import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteChrome } from "./SiteChrome-CGWSDdNn.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as recipes, n as RecipeCard, r as cn, t as RECIPE_CATEGORIES } from "./recipes-B5uqRf8V.mjs";
import { n as Search, r as RotateCcw, t as X } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recipes-_4VZ0cYE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var PER_PAGE = 6;
function RecipesPage() {
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("All");
	const [page, setPage] = (0, import_react.useState)(1);
	const categories = ["All", ...RECIPE_CATEGORIES];
	const filteredRecipes = (0, import_react.useMemo)(() => {
		return recipes.filter((r) => {
			const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
			const q = searchQuery.trim().toLowerCase();
			const matchesQuery = !q || r.name.toLowerCase().includes(q) || r.khmer.toLowerCase().includes(q) || r.note.toLowerCase().includes(q) || r.place.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
			return matchesCategory && matchesQuery;
		});
	}, [searchQuery, selectedCategory]);
	const totalPages = Math.ceil(filteredRecipes.length / PER_PAGE);
	const safePage = Math.min(page, Math.max(1, totalPages));
	const shown = filteredRecipes.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
	const handleSearchChange = (val) => {
		setSearchQuery(val);
		setPage(1);
	};
	const handleCategoryChange = (cat) => {
		setSelectedCategory(cat);
		setPage(1);
	};
	const handleReset = () => {
		setSearchQuery("");
		setSelectedCategory("All");
		setPage(1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl px-5 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.3em] text-muted-foreground",
				children: "Battambang"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl text-primary sm:text-4xl",
				children: "The Recipes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
				children: "Nine dishes cooked in the villages, markets and riverside kitchens of Battambang province."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-5 border-y border-border py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-md w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "text",
							placeholder: "Search recipes, ingredients, locations...",
							value: searchQuery,
							onChange: (e) => handleSearchChange(e.target.value),
							className: "pl-9 pr-9 text-sm"
						}),
						searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleSearchChange(""),
							className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
							"aria-label": "Clear search query",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-1 text-xs uppercase tracking-wider text-muted-foreground font-medium",
						children: "Category:"
					}), categories.map((cat) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleCategoryChange(cat),
							className: `rounded-full px-3 py-1 text-xs transition-colors ${selectedCategory === cat ? "bg-primary text-primary-foreground font-medium" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`,
							children: cat
						}, cat);
					})]
				})]
			}),
			filteredRecipes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
					children: shown.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecipeCard, { recipe: r }, r.id))
				}),
				totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "Pagination",
					className: "mt-12 flex items-center justify-center gap-3 border-t border-border pt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							disabled: safePage === 1,
							className: "rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary disabled:opacity-40",
							children: "Prev"
						}),
						Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPage(n),
							"aria-current": safePage === n ? "page" : void 0,
							className: safePage === n ? "h-10 w-10 rounded-sm border border-primary bg-primary font-display text-primary-foreground" : "h-10 w-10 rounded-sm border border-border font-display text-muted-foreground transition-colors hover:text-primary",
							children: n
						}, n)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
							disabled: safePage === totalPages,
							className: "rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary disabled:opacity-40",
							children: "Next"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground",
					children: [
						totalPages > 1 ? `Page ${safePage} of ${totalPages} · ` : "",
						shown.length,
						" of ",
						filteredRecipes.length,
						" matching dish",
						filteredRecipes.length === 1 ? "" : "es",
						filteredRecipes.length !== recipes.length && ` (filtered from ${recipes.length})`
					]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex flex-col items-center justify-center rounded-sm border border-dashed border-border py-16 px-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full bg-muted p-4 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-8 w-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-xl text-primary",
						children: "No recipes found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-sm text-sm text-muted-foreground",
						children: [
							"We couldn't find any dishes matching \"",
							searchQuery,
							"\"",
							selectedCategory !== "All" ? ` in category "${selectedCategory}"` : "",
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						onClick: handleReset,
						className: "mt-6 inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "Reset Filters"]
					})
				]
			})
		]
	}) });
}
//#endregion
export { RecipesPage as component };
