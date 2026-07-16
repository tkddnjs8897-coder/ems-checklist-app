import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const electricalInjury: Scenario = {
  id: "electrical-injury",
  title: "전기·낙뢰",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "scene-safety",
      severity: "critical",
      title: "전원 차단 확인 후 접근",
      detail: "전원이 차단되기 전에는 환자에게 접근 금지. 고압 전선은 반드시 전기회사에서 처리하도록 요청.",
      sourceRef: "p.368",
    },
    {
      id: "airway",
      severity: "critical",
      title: "기도 확보",
      detail: "의식 P 이하면 입인두기도기 삽입, 구역반사 있으면 코인두기도기로 대체.",
      sourceRef: "p.367",
    },
    {
      id: "intubation",
      severity: "critical",
      title: "기관내 삽관술",
      condition: "무호흡, 의식상태 지속 악화, 호흡수 30회 이상 또는 SpO2 90% 미만 시",
      sourceRef: "p.368",
    },
    {
      id: "cardiac-arrest",
      severity: "critical",
      title: "심정지 시 소생술",
      detail: "심폐소생술 성공률이 매우 높으므로 신속한 기본인명구조술 시행, 이송 전 현장 정맥로 확보 고려.",
      sourceRef: "p.368",
    },
    {
      id: "spine-immobilize",
      severity: "urgent",
      title: "척추 고정",
      detail: "적응증에 해당하지 않는 환자를 제외한 모든 환자에게 시행(추락 등 동반손상 고려).",
      sourceRef: "p.368",
    },
    {
      id: "iv-fluid",
      severity: "urgent",
      title: "정맥로 확보 · 수액 투여",
      condition: "동반 손상으로 쇼크 위험 또는 수축기혈압 90mmHg 미만",
      detail: "18G 이상 정맥로로 젖산링거액 300mL 투여, 쇼크 지속 시 1L까지.",
      sourceRef: "p.368",
      pediatricDetail: "18G 이상 정맥로로 젖산링거액 5mL/kg 투여, 쇼크 지속 시 10mL/kg까지.",
    },
    {
      id: "ecg-monitor",
      severity: "urgent",
      title: "자동심장충격기 부착",
      detail: "심장을 통과한 전류는 치명적 부정맥을 유발할 수 있어 부착 후 지속 감시.",
      sourceRef: "p.368",
    },
  ],
};

export default electricalInjury;
