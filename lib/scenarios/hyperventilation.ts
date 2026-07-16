import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const hyperventilation: Scenario = {
  id: "hyperventilation",
  title: "과호흡",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "oxygen",
      severity: "urgent",
      title: "산소 공급",
      condition: "산소포화도 94% 미만 지속 시",
      detail: "안면마스크로 6~10L/min의 산소를 공급한다.",
      sourceRef: "p.223",
    },
    {
      id: "reassurance",
      severity: "important",
      title: "환자 안정 · 천천히 호흡 유도",
      detail: "병원 도착까지 숨을 천천히 쉬도록 환자를 안정시킨다.",
      sourceRef: "p.223",
    },
    {
      id: "no-paper-bag",
      severity: "important",
      title: "종이·비닐봉투 재호흡요법 금지",
      detail: "이산화탄소 증가보다 혈중 산소분압 감소가 더 심해질 수 있어 사용하지 않는다.",
      sourceRef: "p.224",
    },
  ],
};

export default hyperventilation;
