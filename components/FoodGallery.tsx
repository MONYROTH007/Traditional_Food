"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { foods, type Food } from "@/data/foods";
import DishArt from "./DishArt";
import KramaDivider from "./KramaDivider";

const filters = ["All", "Breakfast", "Lunch & Dinner"] as const;
type FilterKey = (typeof filters)[number];

export default function FoodGallery() {
  const [filter, setFilter] = useState<FilterKey>("All");
  const [activeId, setActiveId] = useState<string>(foods[0].id);
  const panelRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => foods.filter((f) => filter === "All" || f.mealTime === filter),
    [filter]
  );

  useEffect(() => {
    if (!visible.find((f) => f.id === activeId) && visible.length > 0) {
      setActiveId(visible[0].id);
    }
  }, [filter, visible, activeId]);

  const active: Food = foods.find((f) => f.id === activeId) ?? foods[0];

  function selectFood(id: string) {
    setActiveId(id);
    if (window.innerWidth < 1024) {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section id="dishes" className="bg-paddy-deep px-6 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter dishes by meal time">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                filter === f
                  ? "border-gold bg-gold text-ink"
                  : "border-rice/25 text-rice/70 hover:border-gold/60 hover:text-gold-bright"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-rice/40">
            {visible.length} of {foods.length} dishes
          </span>
        </div>

        <KramaDivider className="mt-6 max-w-[140px]" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* Rail of dish cards */}
          <div
            className="rail -mx-6 flex gap-4 overflow-x-auto px-6 pb-4 lg:mx-0 lg:grid lg:grid-cols-1 lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0"
            aria-label="Dish list"
          >
            {visible.map((food) => (
              <button
                key={food.id}
                onClick={() => selectFood(food.id)}
                aria-pressed={activeId === food.id}
                className={`group flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl border text-left transition-all lg:w-full lg:flex-row lg:items-stretch ${
                  activeId === food.id
                    ? "border-gold shadow-[0_0_0_1px_rgba(201,162,39,0.4)]"
                    : "border-rice/10 hover:border-gold/40"
                }`}
              >
                <DishArt food={food} className="h-36 w-full lg:h-auto lg:w-32" />
                <div className="flex flex-1 flex-col justify-center bg-paddy-light/60 p-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gold-bright/70">
                    {food.mealTime}
                  </span>
                  <span className="mt-1 font-display text-xl italic text-rice">
                    {food.name}
                  </span>
                  <span className="mt-1 text-sm text-rice/60">{food.region}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div
            ref={panelRef}
            key={active.id}
            className="animate-rise rounded-2xl border border-gold/20 bg-paddy-light/40 p-6 sm:p-8"
          >
            <DishArt food={active} className="h-48 w-full rounded-xl sm:h-56" />

            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-3xl italic text-rice sm:text-4xl">
                {active.name}
              </h2>
              <span className="font-mono text-sm text-gold-bright">
                {active.khmerName} · {active.pronunciation}
              </span>
            </div>

            <p className="mt-1 text-sm uppercase tracking-wide text-sage-light">
              {active.mealTime} — {active.region}
            </p>

            <p className="mt-5 text-base leading-relaxed text-rice/85">
              {active.description}
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-gold-bright/80">
                  Core ingredients
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-rice/80">
                  {active.ingredients.map((ing) => (
                    <li key={ing} className="flex gap-2">
                      <span className="text-brick-light">·</span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-gold-bright/80">
                  Where it comes from
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-rice/80">
                  {active.originNote}
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-rice/10 pt-5">
              <span className="font-mono text-xs text-rice/40">source</span>
              <a
                href={active.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-gold-bright underline decoration-gold/40 underline-offset-4 hover:text-gold"
              >
                {active.source.label} ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
