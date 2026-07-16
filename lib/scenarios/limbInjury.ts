import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const limbInjury: Scenario = {
  id: "limb-injury",
  title: "사지손상",
  status: "ready",
  quickJumps: [
    { label: "심정지 발생", href: "/scenarios/cardiac-arrest" },
    { label: "기도폐쇄", href: "/scenarios/airway-obstruction" },
  ],
  steps: [
    {
      id: "hemorrhage",
      severity: "critical",
      title: "외부출혈 지혈",
      detail: "멸균 소독거즈와 탄력붕대로 압박 지혈(안구출혈 제외).",
      sourceRef: "p.351",
    },
    {
      id: "amputation",
      severity: "critical",
      title: "완전절단 시 절단물 처치",
      condition: "사지 완전 절단 시",
      detail: "생리식염수 적신 거즈로 절단부 감싸 밀폐용기에 넣고 냉장 운반(직접 얼음 접촉 금지).",
      sourceRef: "p.351",
    },
    {
      id: "crush-syndrome",
      severity: "critical",
      title: "압궤증후군 대비",
      detail: "압박물체를 섣불리 제거하지 말고 기도확보와 수액처치를 먼저 시행. 부정맥·심정지 대비 제세동기 우선 부착.",
      sourceRef: "p.352",
    },
    {
      id: "splint",
      severity: "urgent",
      title: "부목 고정",
      detail: "무리한 정복 시도 금지, 상하 관절 포함하여 고정. 적용 전후 말단부 감각·운동·순환 확인.",
      sourceRef: "p.351~352",
    },
    {
      id: "iv-fluid",
      severity: "important",
      title: "정맥로 확보 · 수액",
      condition: "다발성 골절, 예상 이송시간 30분 이상, 구급대원 2인 이상",
      detail: "18G 이상 정맥로 확보 후 수액 공급으로 쇼크 예방.",
      sourceRef: "p.352",
    },
  ],
};

export default limbInjury;
