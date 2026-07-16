import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const chestInjury: Scenario = {
  id: "chest-injury",
  title: "흉부손상",
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
      detail: "의식 P 이하면 입인두기도기, 구역반사 시 코인두기도기.",
      sourceRef: "p.339",
    },
    {
      id: "oxygen",
      severity: "critical",
      title: "산소 투여 · 양압환기",
      detail: "SpO2<94% 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min. 투여 후에도 94% 미만이거나 호흡부전 시 백밸브마스크로 100% 산소·양압환기.",
      sourceRef: "p.339",
    },
    {
      id: "open-pneumothorax",
      severity: "critical",
      title: "개방성기흉 삼면 밀봉드레싱",
      condition: "개방성기흉(공기가슴증) 확인 시",
      sourceRef: "p.339",
    },
    {
      id: "flail-chest",
      severity: "critical",
      title: "동요가슴 압박고정",
      condition: "호흡 시 모순운동(동요가슴) 관찰 시",
      detail: "앙와위를 유지하며 두꺼운 패드와 붕대로 압박·고정.",
      sourceRef: "p.339",
    },
    {
      id: "hemorrhage",
      severity: "critical",
      title: "외부출혈 지혈",
      detail: "멸균 소독거즈로 압박 지혈.",
      sourceRef: "p.339",
    },
    {
      id: "circulation",
      severity: "critical",
      title: "순환(C) · 정맥로 확보",
      detail: "수축기혈압<90mmHg 시 18G 이상 정맥로 확보 후 생리식염수 300mL, 쇼크 지속 시 1L까지.",
      sourceRef: "p.339",
      pediatricDetail:
        "수축기혈압<90mmHg 시 18G 이상 정맥로 확보 후 생리식염수 5mL/kg, 쇼크 지속 시 10mL/kg까지 투여.",
    },
  ],
};

export default chestInjury;
