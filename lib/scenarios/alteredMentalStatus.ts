import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const alteredMentalStatus: Scenario = {
  id: "altered-mental-status",
  title: "의식장애",
  status: "ready",
  quickJumps: [
    { label: "뇌졸중 의증", href: "/scenarios/stroke" },
    { label: "경련", href: "/scenarios/seizure" },
  ],
  steps: [
    {
      id: "oxygen-pu",
      severity: "critical",
      title: "산소 투여 (의식 P, U)",
      condition: "의식이 P, U이고 SpO2<94%인 경우",
      detail: "백밸브마스크 또는 비재호흡마스크로 11~15L/min 투여, 필요시 양압 환기.",
      sourceRef: "p.247",
    },
    {
      id: "glucose",
      severity: "critical",
      title: "혈당 측정 · 포도당 투여",
      condition: "혈당 70mg/dL 이하 시",
      detail: "정맥로 확보 후 50% 포도당액 50mL(10세 미만은 10% 포도당액 5mL/kg) 투여.",
      sourceRef: "p.247",
    },
    {
      id: "position",
      severity: "urgent",
      title: "체위 조정",
      detail: "편평한 곳에 눕히고, 수축기혈압 90mmHg 이상이면 흡인 방지 위해 상체 15~30도 거상.",
      sourceRef: "p.246",
    },
    {
      id: "airway",
      severity: "urgent",
      title: "기도 확보",
      condition: "구역반사 소실 시",
      detail: "입인두기도기(OPA)를 이용하여 기도를 확보한다.",
      sourceRef: "p.246",
    },
    {
      id: "oxygen-v",
      severity: "urgent",
      title: "산소 투여 (의식 V)",
      condition: "의식이 V이고 SpO2<94%인 경우",
      detail: "안면마스크로 6~10L/min 산소 투여.",
      sourceRef: "p.246",
    },
    {
      id: "npo",
      severity: "important",
      title: "금식 유지",
      sourceRef: "p.247",
    },
    {
      id: "fever",
      severity: "important",
      title: "고열 환자 냉각",
      condition: "고열 확인 시",
      detail: "의복을 제거하고 환기하여 체온을 낮춘다. 고온환경 질환이면 해당 지침 적용.",
      sourceRef: "p.247",
    },
  ],
};

export default alteredMentalStatus;
