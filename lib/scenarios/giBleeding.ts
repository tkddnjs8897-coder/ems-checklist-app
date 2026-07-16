import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const giBleeding: Scenario = {
  id: "gi-bleeding",
  title: "토혈·혈변",
  status: "ready",
  steps: [
    {
      id: "airway-protect",
      severity: "critical",
      title: "기도폐쇄 예방",
      detail: "이송 중 토혈로 인한 기도폐쇄 가능성이 있으므로 구토 시 고개를 옆으로 돌린다.",
      sourceRef: "p.243",
    },
    {
      id: "oxygen",
      severity: "urgent",
      title: "저산소증 교정",
      detail: "모든 토혈·혈변 환자에서 SpO2<94% 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min 산소 투여.",
      sourceRef: "p.243",
    },
    {
      id: "oxygen-escalate",
      severity: "urgent",
      title: "산소 투여량 상향",
      condition: "산소투여 후에도 SpO2 95% 미만 지속 시",
      detail: "비재호흡마스크로 11~15L/min 투여.",
      sourceRef: "p.243",
    },
    {
      id: "shock-fluid",
      severity: "urgent",
      title: "하지 거상 · 정맥로 확보 · 수액 투여",
      condition: "혈역학적으로 불안정하거나 수축기혈압 90mmHg 이하 시",
      detail: "생리식염수·젖산링거액 300mL, 쇼크 지속 시 1L까지 추가.",
      sourceRef: "p.243",
      pediatricDetail: "생리식염수·젖산링거액 5mL/kg, 쇼크 지속 시 10mL/kg까지 추가.",
    },
    {
      id: "npo",
      severity: "important",
      title: "금식 유지",
      sourceRef: "p.243",
    },
    {
      id: "preserve-sample",
      severity: "important",
      title: "토혈·혈변물 보존",
      detail: "양과 성상 파악을 위해 버리지 않고 이송병원에 인계한다.",
      sourceRef: "p.243",
    },
  ],
};

export default giBleeding;
