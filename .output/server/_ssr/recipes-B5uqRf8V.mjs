import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function RecipeCard({ recipe }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group overflow-hidden rounded-sm border border-border bg-card shadow-warm transition-shadow hover:shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: recipe.image,
				alt: `${recipe.name}, a traditional Khmer dish from Battambang`,
				width: 768,
				height: 576,
				loading: "lazy",
				className: "h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
			}), recipe.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				className: "absolute top-3 right-3 bg-background/90 font-sans text-[10px] tracking-wider uppercase backdrop-blur-sm",
				children: recipe.category
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-sm text-accent",
					children: recipe.khmer
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-display text-xl text-primary",
					children: recipe.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted-foreground",
					children: recipe.note
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "inline",
						children: "From "
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "inline text-foreground",
						children: recipe.place
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "inline",
						children: "Time "
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "inline text-foreground",
						children: recipe.time
					})] })]
				})
			]
		})]
	});
}
var kralan_default = "/assets/kralan-s7HpFPXt.jpg";
var amok_default = "/assets/amok-DDUKswv7.jpg";
var machu_kroeung_default = "/assets/machu-kroeung-BKfUGIql.jpg";
var num_banh_chok_default = "/assets/num-banh-chok-BopWg2w8.jpg";
var prahok_ktis_default = "/assets/prahok-ktis-vSHwpf56.jpg";
var samlor_korko_default = "/assets/samlor-korko-DN3QR4og.jpg";
var num_krok_default = "/assets/num-krok-BipHJn_O.jpg";
var cha_kroeung_default = "/assets/cha-kroeung-By21ze9Y.jpg";
var bai_sach_chrouk_default = "/assets/bai-sach-chrouk-De06CVo9.jpg";
var RECIPE_CATEGORIES = [
	"Soups & Stews",
	"Main Dishes",
	"Noodles & Rice",
	"Snacks & Desserts"
];
var recipes = [
	{
		id: "kralan",
		name: "Kralan",
		khmer: "ក្រឡាន",
		category: "Snacks & Desserts",
		place: "Roadside stalls on National Road 5",
		time: "1 hr 30 min",
		note: "Sticky rice, black beans and coconut milk packed into a bamboo tube and roasted slowly over charcoal until the bamboo blackens.",
		image: kralan_default
	},
	{
		id: "amok-trey",
		name: "Amok Trey",
		khmer: "អាម៉ុកត្រី",
		category: "Main Dishes",
		place: "Sangkae riverside kitchens",
		time: "45 min",
		note: "Freshwater fish folded into coconut cream and yellow kroeung, then steamed in a banana leaf cup until it sets like a custard.",
		image: amok_default
	},
	{
		id: "samlor-machu-kroeung",
		name: "Samlor Machu Kroeung",
		khmer: "សម្លម្ជូរគ្រឿង",
		category: "Soups & Stews",
		place: "Ek Phnom village homes",
		time: "1 hr",
		note: "A sour lemongrass soup with beef and tamarind, seasoned with prahok and finished with a handful of bitter herbs.",
		image: machu_kroeung_default
	},
	{
		id: "num-banh-chok",
		name: "Num Banh Chok",
		khmer: "នំបញ្ចុក",
		category: "Noodles & Rice",
		place: "Psar Nath morning market",
		time: "2 hr",
		note: "Fermented rice noodles under a green fish gravy of lemongrass and turmeric, eaten at dawn with banana blossom and cucumber.",
		image: num_banh_chok_default
	},
	{
		id: "prahok-ktis",
		name: "Prahok Ktis",
		khmer: "ប្រហុកខ្ទិះ",
		category: "Main Dishes",
		place: "Battambang town family tables",
		time: "35 min",
		note: "Minced pork simmered with prahok, coconut cream and kroeung into a thick dip for raw eggplant, cabbage and long beans.",
		image: prahok_ktis_default
	},
	{
		id: "samlor-korko",
		name: "Samlor Korko",
		khmer: "សម្លករគោ",
		category: "Soups & Stews",
		place: "Rice fields of Bavel district",
		time: "1 hr 15 min",
		note: "The old harvest soup: whatever the garden gives, thickened with toasted ground rice and a spoon of prahok.",
		image: samlor_korko_default
	},
	{
		id: "num-krok",
		name: "Num Krok",
		khmer: "នំគ្រក",
		category: "Snacks & Desserts",
		place: "Evening stalls near the Bamboo Train",
		time: "30 min",
		note: "Coconut rice batter poured into a dimpled iron pan over coals, crisp at the edge and soft as cream inside.",
		image: num_krok_default
	},
	{
		id: "cha-kroeung-sach-ko",
		name: "Cha Kroeung Sach Ko",
		khmer: "ឆាគ្រឿងសាច់គោ",
		category: "Main Dishes",
		place: "Moung Ruessei roadside eateries",
		time: "25 min",
		note: "Beef stir fried hard and fast with hand pounded lemongrass paste, kaffir lime leaf and a little palm sugar.",
		image: cha_kroeung_default
	},
	{
		id: "bai-sach-chrouk",
		name: "Bai Sach Chrouk",
		khmer: "បាយសាច់ជ្រូក",
		category: "Noodles & Rice",
		place: "Street corners around Psar Boeung Chhouk",
		time: "40 min",
		note: "Coconut marinated pork grilled over charcoal, served on broken rice with pickles and a bowl of clear broth.",
		image: bai_sach_chrouk_default
	}
];
//#endregion
export { recipes as i, RecipeCard as n, cn as r, RECIPE_CATEGORIES as t };
