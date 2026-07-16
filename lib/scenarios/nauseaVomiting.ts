import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 오심·구토는 전용 처치 챕터가 없다. 반복적 구토는 저혈량성 쇼크의 원인으로 언급되며(p.219),
// 아래는 흡인 방지·탈수 대응 등 문서 전반의 관련 원칙을 묶은 것이다.
const nauseaVomiting: Scenario = {
  id: "nausea-vomiting",
  title: "오심·구토",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "aspiration-precaution",
      severity: "critical",
      title: "흡인 방지 체위",
      condition: "의식저하 동반 시",
      detail: "머리를 옆으로 돌리거나 좌측 측와위를 취해 구토물 흡인을 예방한다.",
      sourceRef: "p.257",
    },
    {
      id: "shock-fluid",
      severity: "critical",
      title: "쇼크 징후 시 정맥로 확보 · 수액 투여",
      condition: "반복적 구토로 수축기혈압 90mmHg 미만 등 쇼크 징후 동반 시",
      detail: "생리식염수 또는 젖산링거액 300mL 투여, 필요시 최대 1L까지.",
      pediatricDetail: "생리식염수 또는 젖산링거액 5mL/kg 투여, 필요시 최대 10mL/kg까지.",
      sourceRef: "p.213, p.219",
    },
    {
      id: "vitals-monitor",
      severity: "urgent",
      title: "활력징후 측정 및 지속 감시",
      detail: "혈압·맥박·호흡·산소포화도를 측정하고 이송 중에도 지속 감시한다.",
      sourceRef: "p.451",
    },
    {
      id: "npo",
      severity: "important",
      title: "금식 유지",
      detail: "경구 음식·음료는 주지 않는다.",
      sourceRef: "p.343",
    },
  ],
};

export default nauseaVomiting;
