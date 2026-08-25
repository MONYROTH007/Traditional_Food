"use client";

import { useState } from "react";
import type { Ingredient } from "@/lib/recipes";

export default function IngredientChecklist({
  groups
}: {
  groups: Ingredient[];
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono-tag text-[11px] tracking-widest uppercase text-umber/50">
          Ingredients
        </p>
        <p className="font-mono-tag text-[11px] tracking-widest uppercase text-umber/50">
          {done}/{total} gathered
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.group}>
            <p className="font-display italic text-lg text-clay mb-3">
              {group.group}
            </p>
            <ul className="space-y-2.5">
              {group.items.map((item) => {
                const key = `${group.group}-${item}`;
                const isChecked = !!checked[key];
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      aria-pressed={isChecked}
                      className="w-full flex items-start gap-3 text-left group/item focus-visible:outline focus-visible:outline-2 focus-visible:outline-turmeric rounded-sm"
                    >
                      <span
                        className={`mt-1 flex-shrink-0 w-4 h-4 border rounded-sm transition-colors ${
                          isChecked
                            ? "bg-turmeric border-turmeric"
                            : "border-umber/30 group-hover/item:border-clay"
                        }`}
                      />
                      <span
                        className={`text-[15px] leading-relaxed transition-colors ${
                          isChecked ? "text-umber/40 line-through" : "text-umber/85"
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
