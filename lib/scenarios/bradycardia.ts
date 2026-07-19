import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const bradycardia: Scenario = {
  id: "bradycardia",
  title: "서맥",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "airway",
      severity: "critical",
      title: "기도 개방 및 유지",
      sourceRef: "p.231",
    },
    {
      id: "pea-check",
      severity: "critical",
      title: "무반응·무맥 시 심정지 지침 전환",
      detail: "심전도상 서맥이나 반응 없고 맥박이 없으면 심정지 표준지침에 따라 처치한다.",
      sourceRef: "p.231",
    },
    {
      id: "unstable-bradycardia",
      severity: "critical",
      title: "불안정 서맥(즉시 처치 대상) 판단",
      detail:
        "다음 중 하나라도 있으면 불안정 서맥으로 판단해 즉시 처치·이송한다: 의식변화·저혈압·흉통·호흡곤란·실신·울혈성 심부전·발한·구역/구토 등 불량한 관류 징후.",
      sourceRef: "p.230~231",
    },
    {
      id: "oxygen-low-flow",
      severity: "urgent",
      title: "저산소증 교정 산소투여",
      condition: "산소포화도 94% 미만",
      detail: "비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min 투여.",
      sourceRef: "p.231",
    },
    {
      id: "oxygen-high-flow",
      severity: "urgent",
      title: "비재호흡마스크 산소투여 상향",
      condition: "산소투여 후에도 SpO2 95% 미만",
      detail: "비재호흡마스크로 11~15L/min 투여.",
      sourceRef: "p.231",
    },
    {
      id: "iv-access",
      severity: "important",
      title: "정맥로 확보",
      condition: "서맥으로 인한 의식변화·저혈압·흉통·호흡곤란·실신·울혈성 심부전·발한·구역/구토 등 불량한 관류 징후가 있는 경우에만",
      sourceRef: "p.230~231",
    },
  ],
};

export default bradycardia;
