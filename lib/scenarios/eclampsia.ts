import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본) - 자간증
const eclampsia: Scenario = {
  id: "eclampsia",
  title: "자간증",
  status: "ready",
  quickJumps: [
    { label: "응급분만", href: "/scenarios/childbirth" },
    { label: "질출혈", href: "/scenarios/vaginal-bleeding" },
  ],
  steps: [
    {
      id: "seizure-active",
      severity: "critical",
      title: "경련 지속 시 처치",
      condition: "경련이 계속되고 있는 환자",
      detail: "편평한 곳에 반듯이 눕혀 안정을 취하게 하고 안면마스크로 8~10L/min 산소를 투여한다.",
      sourceRef: "p.292",
    },
    {
      id: "recurrent-seizure",
      severity: "critical",
      title: "경련 재발 시",
      condition: "이송 중 또는 분만 후(대부분 48시간 이내, 최대 4주까지) 경련이 반복될 경우",
      detail: "‘경련 지속 시 처치’ 지침을 다시 적용한다.",
      sourceRef: "p.292~293",
    },
    {
      id: "seizure-resolved",
      severity: "urgent",
      title: "경련 종료 후 체위 및 산소",
      condition: "경련이 종료된 임신 20주 이상 임신부",
      detail: "좌측 측와위(옆누움) 자세를 취하게 하고 비강캐뉼러로 1~5L/min 산소를 투여한다.",
      sourceRef: "p.292",
    },
    {
      id: "iv-access",
      severity: "urgent",
      title: "정맥로 확보",
      detail: "경련이 멈춘 환자라도 이송 중 재발할 수 있으므로 정맥로를 확보해둔다.",
      sourceRef: "p.292~293",
    },
  ],
};

export default eclampsia;
