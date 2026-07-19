export interface CatalogEntry {
  slug: string;
  label: string;
  group: "disease" | "trauma" | "childbirth";
}

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 질병: Part 3 Ⅰ. 현장응급처치 표준지침 목차(p.3~4). 심정지·소생 후 치료·출산 관련은 홈 화면의 별도 진입점에서 다룬다.
// 질병외: Part 2 Ⅰ-9 구급활동일지 "환자발생유형-질병외" 분류(p.73, p.81~83) + Part 3 Ⅲ 손상·환경응급처치 표준지침 목차(p.4~5).
//   알레르기·아나필락시스는 대부분 외부 물질(음식·약물·곤충독)에 의한 반응이라 질병외로 분류한다.
// 출산: Part 3 Ⅰ-21~23 (응급분만, 질출혈, 자간증)
export const catalog: CatalogEntry[] = [
  { slug: "non-trauma-shock", label: "비외상성 쇼크", group: "disease" },
  { slug: "dyspnea", label: "호흡곤란", group: "disease" },
  { slug: "hyperventilation", label: "과호흡", group: "disease" },
  { slug: "chest-pain", label: "흉통", group: "disease" },
  { slug: "bradycardia", label: "서맥", group: "disease" },
  { slug: "tachycardia", label: "빈맥", group: "disease" },
  { slug: "syncope", label: "실신", group: "disease" },
  { slug: "hemoptysis", label: "객혈", group: "disease" },
  { slug: "gi-bleeding", label: "토혈·혈변", group: "disease" },
  { slug: "altered-mental-status", label: "의식장애", group: "disease" },
  { slug: "stroke", label: "뇌졸중 의증", group: "disease" },
  { slug: "seizure", label: "경련", group: "disease" },
  { slug: "hypoglycemia", label: "저혈당 의증", group: "disease" },
  { slug: "fever", label: "고열", group: "disease" },
  { slug: "sepsis-shock", label: "패혈증의심", group: "disease" },
  { slug: "abdominal-pain", label: "복통", group: "disease" },
  { slug: "nausea-vomiting", label: "오심·구토", group: "disease" },
  { slug: "diarrhea", label: "설사", group: "disease" },
  { slug: "dizziness", label: "어지러움", group: "disease" },

  { slug: "traffic-accident", label: "교통사고", group: "trauma" },
  { slug: "airway-obstruction", label: "기도폐쇄(이물)", group: "trauma" },
  { slug: "behavioral-emergency", label: "행동이상·자살", group: "trauma" },
  { slug: "fall-trauma", label: "낙상(넘어짐)", group: "trauma" },
  { slug: "fall-from-height", label: "추락(높은 곳)", group: "trauma" },
  { slug: "multi-trauma", label: "다발성·중증손상", group: "trauma" },
  { slug: "head-injury", label: "머리손상", group: "trauma" },
  { slug: "spine-injury", label: "척추·척수손상", group: "trauma" },
  { slug: "chest-injury", label: "흉부손상", group: "trauma" },
  { slug: "abdomen-pelvis-injury", label: "복부·골반손상", group: "trauma" },
  { slug: "limb-injury", label: "사지손상", group: "trauma" },
  { slug: "blunt-injury", label: "그 밖의 둔상", group: "trauma" },
  { slug: "laceration", label: "열상", group: "trauma" },
  { slug: "stab-penetrating", label: "자상·관통상", group: "trauma" },
  { slug: "machinery-injury", label: "기계·농기계 손상", group: "trauma" },
  { slug: "burn", label: "화상", group: "trauma" },
  { slug: "electrical-injury", label: "전기·낙뢰", group: "trauma" },
  { slug: "poisoning", label: "중독", group: "trauma" },
  { slug: "drowning", label: "익수", group: "trauma" },
  { slug: "asphyxiation", label: "질식", group: "trauma" },
  { slug: "hypothermia", label: "저체온증", group: "trauma" },
  { slug: "heat-illness", label: "고온환경질환", group: "trauma" },
  { slug: "animal-bite", label: "동물·곤충 교상", group: "trauma" },
  { slug: "anaphylaxis", label: "알레르기·아나필락시스", group: "trauma" },

  { slug: "childbirth", label: "응급분만", group: "childbirth" },
  { slug: "vaginal-bleeding", label: "질출혈", group: "childbirth" },
  { slug: "eclampsia", label: "자간증", group: "childbirth" },
];

export function findCatalogLabel(slug: string): string | undefined {
  return catalog.find((c) => c.slug === slug)?.label;
}
