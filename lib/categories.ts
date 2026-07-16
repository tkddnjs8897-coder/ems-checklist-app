import type { CategoryTileData } from "./types";
import { catalog } from "./catalog";
import { readyScenarioIds } from "./scenarios";

function toTile(entry: { slug: string; label: string }): CategoryTileData {
  return {
    label: entry.label,
    href: `/scenarios/${entry.slug}`,
    status: readyScenarioIds.has(entry.slug) ? "ready" : "planned",
  };
}

export const diseaseTiles: CategoryTileData[] = catalog
  .filter((c) => c.group === "disease")
  .map(toTile);

export const traumaTiles: CategoryTileData[] = catalog
  .filter((c) => c.group === "trauma")
  .map(toTile);

export const childbirthTiles: CategoryTileData[] = catalog
  .filter((c) => c.group === "childbirth")
  .map(toTile);
