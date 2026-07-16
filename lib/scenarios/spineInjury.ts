import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const spineInjury: Scenario = {
  id: "spine-injury",
  title: "척추·척수손상",
  status: "ready",
  quickJumps: [
    { label: "심정지 발생", href: "/scenarios/cardiac-arrest" },
    { label: "기도폐쇄", href: "/scenarios/airway-obstruction" },
  ],
  steps: [
    {
      id: "airway",
      severity: "critical",
      title: "기도(A) 확보",
      detail: "의식 P 이하면 입인두기도기, 구역반사 시 코인두기도기. 두개골 기저부 골절 의심 시 도수조작만.",
      sourceRef: "p.334",
    },
    {
      id: "oxygen",
      severity: "critical",
      title: "산소 투여",
      detail: "SpO2<94% 시 저산소증으로 인한 척수손상 악화를 막기 위해 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min.",
      sourceRef: "p.334",
    },
    {
      id: "upper-c-spine",
      severity: "critical",
      title: "상부 경추손상 호흡부전 대비",
      condition: "상부 경추(목뼈) 손상으로 호흡부전 발생 시",
      detail: "백밸브마스크로 100% 산소를 공급하며 양압환기.",
      sourceRef: "p.334",
    },
    {
      id: "spinal-immobilize",
      severity: "critical",
      title: "척추 고정",
      detail: "경부 검사 후 경추고정기구 적용, 몸통·머리·팔다리 순으로 고정. 이송 중 의식·혈역학 지속 재평가.",
      sourceRef: "p.334",
    },
    {
      id: "circulation",
      severity: "critical",
      title: "순환(C) · 정맥로 확보",
      detail: "수축기혈압<90mmHg 시 18G 이상 정맥로 확보 후 생리식염수 300mL, 쇼크 지속 시 1L까지.",
      sourceRef: "p.335",
      pediatricDetail: "수축기혈압<90mmHg 시 18G 이상 정맥로 확보 후 생리식염수 5mL/kg, 쇼크 지속 시 10mL/kg까지.",
    },
    {
      id: "keep-immobilized",
      severity: "important",
      title: "고정 유지",
      detail: "척추손상 배제에는 영상검사가 필수이므로 현장에서 척추고정을 제거하지 않는다.",
      sourceRef: "p.335",
    },
  ],
};

export default spineInjury;
