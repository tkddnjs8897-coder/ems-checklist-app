import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const hemoptysis: Scenario = {
  id: "hemoptysis",
  title: "객혈",
  status: "ready",
  quickJumps: [{ label: "기도폐쇄", href: "/scenarios/airway-obstruction" }],
  steps: [
    {
      id: "advanced-airway",
      severity: "critical",
      title: "전문기도유지술 시행",
      condition: "대량객혈로 질식 위험이 있는 경우",
      detail: "가능하면 이송 시작 전 시행.",
      sourceRef: "p.240",
    },
    {
      id: "oxygen",
      severity: "urgent",
      title: "저산소증 교정",
      detail: "쇼크·호흡곤란 또는 SpO2<94% 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min 산소 투여.",
      sourceRef: "p.240",
    },
    {
      id: "oxygen-escalate",
      severity: "urgent",
      title: "산소 투여량 상향",
      condition: "산소투여 후에도 SpO2 95% 미만 지속 시",
      detail: "비재호흡마스크로 11~15L/min 투여.",
      sourceRef: "p.240",
    },
    {
      id: "shock-fluid",
      severity: "urgent",
      title: "하지 거상 · 정맥로 확보 · 수액 투여",
      condition: "혈역학적으로 불안정하고 쇼크 징후 있을 시",
      detail: "생리식염수·하트만용액 300mL, 쇼크 지속 시 1L까지 추가.",
      sourceRef: "p.240",
      pediatricDetail: "생리식염수·하트만용액 5mL/kg, 쇼크 지속 시 10mL/kg까지 추가.",
    },
    {
      id: "preserve-sample",
      severity: "important",
      title: "객혈물 보존",
      detail: "현장·이송 중 습득한 객혈물은 버리지 않고 이송병원에 인계한다.",
      sourceRef: "p.240",
    },
  ],
};

export default hemoptysis;
