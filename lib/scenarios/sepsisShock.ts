import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본) - 성인 패혈증·패혈증성 쇼크 p.262~264
// 쇼크 징후 없는 단순 고열은 "고열" 시나리오(fever)를 따로 둔다.
const sepsisShock: Scenario = {
  id: "sepsis-shock",
  title: "패혈증의심",
  status: "ready",
  quickJumps: [
    { label: "심정지 발생", href: "/scenarios/cardiac-arrest" },
    { label: "알레르기·아나필락시스", href: "/scenarios/anaphylaxis" },
  ],
  steps: [
    {
      id: "oxygen",
      severity: "critical",
      title: "산소 투여",
      detail: "패혈증·패혈증성 쇼크 의심 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min 산소 투여.",
      sourceRef: "p.263",
    },
    {
      id: "high-flow-oxygen",
      severity: "critical",
      title: "고농도 산소로 전환",
      detail: "산소 투여 후에도 산소포화도 95% 미만이면 비재호흡마스크로 11~15L/min 투여.",
      sourceRef: "p.263",
    },
    {
      id: "iv-fluid",
      severity: "critical",
      title: "정맥로 확보 후 수액 투여",
      detail: "생리식염수 또는 하트만용액 300mL(소아 5mL/kg) 투여, 쇼크 지속 시 1L(소아 10mL/kg)까지 추가.",
      sourceRef: "p.263",
      pediatricDetail: "생리식염수 또는 하트만용액 5mL/kg 투여, 쇼크 지속 시 10mL/kg까지 추가.",
    },
    {
      id: "ppe",
      severity: "important",
      title: "개인보호장구 착용",
      detail: "접촉·공기매개 감염병 가능성을 고려해 마스크·장갑 등을 착용한다. 수막구균패혈증 의심 접촉자는 예방적 항생제 대상.",
      sourceRef: "p.264",
    },
  ],
};

export default sepsisShock;
