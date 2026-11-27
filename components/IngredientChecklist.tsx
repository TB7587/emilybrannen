"use client";

import { useEffect, useState } from "react";

/** Tap-to-check ingredients. Ticks are remembered on this device per recipe. */
export function IngredientChecklist({ slug, ingredients }: { slug: string; ingredients: string[] }) {
  const key = `ingredients:${slug}`;
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    try {
      setChecked(JSON.parse(localStorage.getItem(key) ?? "[]"));
    } catch {}
  }, [key]);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i];
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  return (
    <ul className="divide-y divide-linen">
      {ingredients.map((item, i) => {
        const on = checked.includes(i);
        return (
          <li key={i}>
            <label className="flex min-h-13 cursor-pointer items-center gap-4 py-2.5">
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggle(i)}
                className="size-7 shrink-0 cursor-pointer appearance-none rounded-lg border-2 border-cocoa-soft bg-white bg-center bg-no-repeat checked:border-sage checked:bg-sage checked:bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22white%22%20stroke-width=%223.5%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><path%20d=%22M5%2012.5l4.5%204.5L19%207.500%22/></svg>')] checked:bg-[length:1.1rem] print:size-4 print:rounded-sm"
              />
              <span className={on ? "text-cocoa-soft line-through" : ""}>{item}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
