import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 설사는 전용 처치 챕터가 없다. 지속적 설사는 저혈량성 쇼크의 원인으로 언급되며(p.219),
// 감염 가능성에 대한 개인보호장구 원칙(p.264)을 함께 적용한다.
const diarrhea: Scenario = {
  id: "diarrhea",
  title: "설사",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "shock-fluid",
      severity: "critical",
      title: "쇼크 징후 시 정맥로 확보 · 수액 투여",
      condition: "지속적 설사로 수축기혈압 90mmHg 미만 등 쇼크 징후 동반 시",
      detail: "생리식염수 또는 하트만용액 300mL 투여, 필요시 최대 1L까지.",
      pediatricDetail: "생리식염수 또는 하트만용액 5mL/kg 투여, 필요시 최대 10mL/kg까지.",
      sourceRef: "p.213, p.219",
    },
    {
      id: "ppe",
      severity: "urgent",
      title: "개인보호장구 착용",
      detail: "감염성 장염 가능성을 고려해 마스크·장갑 등을 착용한다.",
      sourceRef: "p.264",
    },
    {
      id: "vitals-monitor",
      severity: "urgent",
      title: "활력징후 측정 및 지속 감시",
      detail: "혈압·맥박·호흡·산소포화도를 측정하고 이송 중에도 지속 감시한다.",
      sourceRef: "p.451",
    },
  ],
};

export default diarrhea;
