import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteChrome } from "./SiteChrome-CGWSDdNn.mjs";
import { i as recipes, n as RecipeCard } from "./recipes-B5uqRf8V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D4W5gge3.js
var import_jsx_runtime = require_jsx_runtime();
var hero_battambang_default = "/assets/hero-battambang-BCu2xTMw.jpg";
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteChrome, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero_battambang_default,
				alt: "Golden hour over old shophouses and rice fields in Battambang, Cambodia",
				width: 1600,
				height: 900,
				className: "h-[60vh] min-h-72 w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-hero-veil" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full max-w-5xl px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-base text-accent",
							children: "ម្ហូបខ្មែរបុរាណ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 max-w-xl font-display text-3xl leading-tight text-primary-foreground sm:text-5xl",
							children: "Traditional Khmer Recipes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/85",
							children: "Nine dishes from Battambang province, written the way they were taught at the table."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/recipes",
							className: "mt-7 inline-block rounded-sm bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground",
							children: "See the recipes"
						})
					]
				})
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-5xl px-5 py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between border-b border-border pb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-primary",
				children: "Begin with three"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/recipes",
				className: "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary",
				children: "All nine"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: recipes.slice(0, 3).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecipeCard, { recipe: r }, r.id))
		})]
	})] });
}
//#endregion
export { Home as component };
