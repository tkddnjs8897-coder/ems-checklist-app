import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const syncope: Scenario = {
  id: "syncope",
  title: "실신",
  status: "ready",
  quickJumps: [{ label: "뇌졸중 의증", href: "/scenarios/stroke" }],
  steps: [
    {
      id: "oxygen",
      severity: "urgent",
      title: "저산소증 교정",
      detail: "SpO2<94% 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min 산소 투여.",
      sourceRef: "p.237",
    },
    {
      id: "oxygen-escalate",
      severity: "urgent",
      title: "산소 투여량 상향",
      condition: "산소투여 후에도 SpO2 95% 미만 지속 시",
      detail: "비재호흡마스크로 11~15L/min 투여.",
      sourceRef: "p.237",
    },
    {
      id: "fluid",
      severity: "urgent",
      title: "정맥로 확보 · 수액 투여",
      condition: "저혈량성 쇼크 등 필요 시",
      detail: "생리식염수·젖산링거액 300mL, 쇼크 지속 시 1L까지 추가.",
      sourceRef: "p.237",
      pediatricDetail: "생리식염수·젖산링거액 5mL/kg, 쇼크 지속 시 10mL/kg까지 추가.",
    },
    {
      id: "head-neck",
      severity: "important",
      title: "머리 · 경추 손상 처치",
      detail: "기립 중 실신으로 쓰러지며 외상을 입었는지 확인, 손상 확인 시 머리손상 처치 지침 적용.",
      sourceRef: "p.237",
    },
    {
      id: "npo",
      severity: "important",
      title: "금식 유지",
      detail: "의식이 있는 환자라도 경구로 어떠한 것도 공급하지 않는다.",
      sourceRef: "p.237",
    },
  ],
};

export default syncope;
