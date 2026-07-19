import { catalog } from "./catalog";
import { readyScenarioIds } from "./scenarios";

export interface SearchableScenario {
  slug: string;
  label: string;
  group: "arrest" | "disease" | "trauma" | "childbirth";
  status: "ready" | "planned";
}

// 카탈로그에 없는 심정지(홈 화면 별도 진입점)도 검색 대상에 포함시킨다.
export const searchableScenarios: SearchableScenario[] = [
  {
    slug: "cardiac-arrest",
    label: "심정지",
    group: "arrest",
    status: readyScenarioIds.has("cardiac-arrest") ? "ready" : "planned",
  },
  ...catalog.map((c) => ({
    slug: c.slug,
    label: c.label,
    group: c.group,
    status: readyScenarioIds.has(c.slug) ? ("ready" as const) : ("planned" as const),
  })),
];
