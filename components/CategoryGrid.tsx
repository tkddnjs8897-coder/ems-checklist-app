import Link from "next/link";
import type { AgeGroup, CategoryTileData } from "@/lib/types";
import { getScenarioIcon } from "@/lib/icons";
import { withAge } from "@/lib/age";

const accentStyles = {
  blue: { bg: "bg-blue-500/15", icon: "text-blue-300" },
  amber: { bg: "bg-amber-500/15", icon: "text-amber-300" },
  pink: { bg: "bg-pink-500/15", icon: "text-pink-300" },
} as const;

export function CategoryGrid({
  tiles,
  age,
  accent = "blue",
}: {
  tiles: CategoryTileData[];
  age: AgeGroup;
  accent?: keyof typeof accentStyles;
}) {
  const style = accentStyles[accent];
  return (
    <div className="grid grid-cols-3 gap-2.5 px-4 pb-6">
      {tiles.map((tile, i) => {
        const slug = tile.href.split("/").pop() ?? "";
        const Icon = getScenarioIcon(slug);
        return (
          <Link
            key={`${tile.href}-${i}`}
            href={withAge(tile.href, age)}
            className="relative aspect-square rounded-xl border flex flex-col items-center justify-center gap-2 px-2 text-center border-slate-700 bg-slate-800/60 active:bg-slate-800"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center ${style.bg}`}>
              <Icon size={22} className={style.icon} />
            </div>
            <span className="text-[12.5px] leading-tight font-medium text-slate-100">
              {tile.label}
            </span>
            {tile.status === "planned" && (
              <span className="absolute top-1.5 right-1.5 text-[9px] leading-none px-1.5 py-1 rounded-full bg-slate-700 text-slate-300">
                준비중
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
