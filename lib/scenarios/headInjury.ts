import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const headInjury: Scenario = {
  id: "head-injury",
  title: "머리손상",
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
      detail: "의식 P 이하면 입인두기도기, 구역반사 시 코인두기도기. 두개골 골절 의심 시 코인두기도기 금지, 도수조작만.",
      sourceRef: "p.331",
    },
    {
      id: "oxygen",
      severity: "critical",
      title: "산소 투여",
      detail: "SpO2<94% 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min.",
      sourceRef: "p.331",
    },
    {
      id: "herniation",
      severity: "critical",
      title: "뇌탈출 징후 시 두부 거상",
      condition: "호흡이상 · 동공반사 이상 · 제뇌경직 등 뇌탈출 징후",
      detail: "머리를 30도 정도 올리고 산소포화도 94~98% 유지.",
      sourceRef: "p.331",
    },
    {
      id: "c-collar",
      severity: "critical",
      title: "경추보호대(C-collar) 착용",
      detail: "모든 중증 머리손상환자에 적용. 의식명료·후경부압통없음·신경학적이상없음인 65세 이하 경증환자는 생략 가능. 기도손상으로 착용이 어려우면 기도개방을 우선한다.",
      sourceRef: "p.331",
    },
    {
      id: "circulation",
      severity: "critical",
      title: "순환(C) · 정맥로 확보",
      detail: "수축기혈압<90mmHg 시 18G 이상 정맥로 확보 후 생리식염수 300mL, 쇼크 지속 시 1L까지.",
      sourceRef: "p.331",
      pediatricDetail:
        "수축기혈압<90mmHg 시 18G 이상 정맥로 확보 후 생리식염수 5mL/kg, 쇼크 지속 시 10mL/kg까지 투여.",
    },
    {
      id: "skull-fracture",
      severity: "urgent",
      title: "두개골골절 출혈 처치",
      condition: "너구리눈 · 귀 뒷부분 반상출혈 등 두개골골절 징후 시",
      detail: "코·귀 출혈은 막지 말고 닦아준다.",
      sourceRef: "p.331",
    },
  ],
};

export default headInjury;
