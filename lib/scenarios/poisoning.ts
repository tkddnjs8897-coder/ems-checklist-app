import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const poisoning: Scenario = {
  id: "poisoning",
  title: "중독",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "airway",
      severity: "critical",
      title: "기도 확보",
      detail: "의식 P 이하면 입인두기도기 삽입, 구역반사 있으면 코인두기도기로 대체.",
      sourceRef: "p.390",
    },
    {
      id: "oxygen",
      severity: "critical",
      title: "산소 투여",
      detail: "SpO2 94% 미만 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min. 일산화탄소 중독은 SpO2 무관 비재호흡마스크 15L/min. 파라쿼트 중독은 중증 호흡부전 없으면 산소투여 금지.",
      sourceRef: "p.390~391",
    },
    {
      id: "naloxone-antidote",
      severity: "critical",
      title: "해독제 투여",
      detail: "마약성진통제→날록손, 콜린성(유기인계·카바메이트)→아트로핀·2-PAM, 저혈당제→포도당, 일산화탄소→고유량산소·고압산소 고려.",
      sourceRef: "p.387~388",
    },
    {
      id: "decontamination",
      severity: "urgent",
      title: "오염 의복 제거 · 세척",
      detail: "독성물질에 오염된 의복은 모두 제거하고 다량의 물로 세척한다.",
      sourceRef: "p.390",
    },
    {
      id: "iv-fluid",
      severity: "urgent",
      title: "정맥로 확보 · 수액 투여",
      condition: "혈역학적 불안정, 쇼크 징후 시",
      detail: "하지 거상 후 생리식염수·젖산링거액 300mL 투여, 쇼크 지속 시 1L까지.",
      sourceRef: "p.391",
      pediatricDetail: "하지 거상 후 생리식염수·젖산링거액 5mL/kg 투여, 쇼크 지속 시 10mL/kg까지.",
    },
    {
      id: "no-forced-vomit",
      severity: "important",
      title: "억지 구토 유발 금지",
      detail: "환자가 토할 경우 흡인 방지 위해 고개를 돌리고 필요시 흡인기 사용.",
      sourceRef: "p.391",
    },
    {
      id: "scene-evidence",
      severity: "important",
      title: "현장 정보 수집",
      detail: "빈 약물통·봉지, 유서, 특이 냄새 등 확인. 개인보호장비 철저히 착용해 2차 오염 방지.",
      sourceRef: "p.389~391",
    },
  ],
};

export default poisoning;
