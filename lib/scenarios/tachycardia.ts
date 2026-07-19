import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const tachycardia: Scenario = {
  id: "tachycardia",
  title: "빈맥",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "pulseless-warning",
      severity: "critical",
      title: "무반응·무맥 시 심정지 지침 전환(제세동 포함)",
      detail:
        "빈맥 환자가 무반응·무맥 상태이고 심실세동·무맥성 심실빈맥으로 확인되면(=심정지 상황) 제세동을 포함한 심정지 표준지침을 따른다. 맥박이 있으면 이 항목은 해당하지 않는다.",
      sourceRef: "p.234",
    },
    {
      id: "airway",
      severity: "urgent",
      title: "기도 개방 및 유지",
      sourceRef: "p.233",
    },
    {
      id: "oxygen",
      severity: "urgent",
      title: "저산소증 교정",
      detail: "SpO2<94% 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min 산소 투여.",
      sourceRef: "p.233",
    },
    {
      id: "oxygen-escalate",
      severity: "urgent",
      title: "산소 투여량 상향",
      condition: "산소투여 후에도 SpO2 95% 미만 지속 시",
      detail: "비재호흡마스크로 11~15L/min 투여.",
      sourceRef: "p.233~234",
    },
    {
      id: "iv-access",
      severity: "urgent",
      title: "정맥로 확보",
      condition: "심각한 증상·징후를 동반한 빈맥 환자",
      sourceRef: "p.234",
    },
  ],
};

export default tachycardia;
