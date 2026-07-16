import type { AgeGroup } from "./types";

export function withAge(href: string, age: AgeGroup): string {
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}age=${age}`;
}

export function parseAge(value: string | undefined): AgeGroup {
  return value === "pediatric" ? "pediatric" : "adult";
}
