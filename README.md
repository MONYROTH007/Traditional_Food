# Nhoam Khmer — Traditional Khmer Foods

An interactive, responsive guide to five traditional Cambodian dishes, built
with Next.js 14 (App Router) and Tailwind CSS.

## What's inside

- **5 real dishes** with original descriptions, ingredients, meal time,
  region of origin in Cambodia, and a source link for further reading:
  Fish Amok, Khmer Noodles (Num Banh Chok), Pork & Rice (Bai Sach Chrouk),
  Noodle Soup (Kuy Teav), and Beef Lok Lak.
- **Placeholder dish art** — generated SVG/CSS artwork (no external image
  files needed) standing in for real photography.
- **Interactive gallery** — filter by meal time, scroll the dish rail, and
  tap any dish to load its full detail panel.
- **Custom visual identity** — a palette drawn from Khmer rice paddies,
  temple gold, and Kampot brick-red, with a krama (checkered scarf) weave
  pattern used as the site's signature motif.
- Fully responsive: horizontal swipe rail on mobile, side-by-side layout
  on desktop.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
npm run start
```

## Project structure

```
app/
  layout.tsx       Root layout + metadata
  page.tsx          Assembles Hero, FoodGallery, Footer
  globals.css       Krama pattern, scrollbar, motion-reduction rules
components/
  Hero.tsx
  FoodGallery.tsx   Filter tabs + rail + detail panel (client component)
  DishArt.tsx       SVG placeholder artwork per dish
  KramaDivider.tsx  Signature checkered-weave divider
  Footer.tsx
data/
  foods.ts          The 5 dish entries (edit here to add more)
```

## Notes

- Fonts use a system font stack (Georgia/Palatino-family for display,
  system sans for body) so the project builds and looks good with zero
  external network calls. If you want branded fonts, swap in `next/font`
  with your choice of typeface.
- Dish images are placeholder SVG art, not real photography — swap
  `DishArt.tsx` for `next/image` with real photos when you have licensed
  images to use.
