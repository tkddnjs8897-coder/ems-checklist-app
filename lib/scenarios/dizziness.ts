import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 어지러움(현기증)은 전용 처치 챕터가 없다. 노인환자 특수상황(p.428)에서 실신·현기증을 치명적 질환의
// 경고 신호로 언급하며, 원인 감별이 필요할 때는 실신 체크리스트를 함께 참고한다.
const dizziness: Scenario = {
  id: "dizziness",
  title: "어지러움",
  status: "ready",
  quickJumps: [
    { label: "실신", href: "/scenarios/syncope" },
    { label: "저혈당 의증", href: "/scenarios/hypoglycemia" },
    { label: "심정지 발생", href: "/scenarios/cardiac-arrest" },
  ],
  steps: [
    {
      id: "fall-prevention",
      severity: "urgent",
      title: "낙상 방지 · 눕거나 앉은 자세 유지",
      detail: "혼자 걷게 하지 않고 눕거나 앉은 자세로 안정시켜 낙상을 예방한다.",
      sourceRef: "p.428",
    },
    {
      id: "glucose-check",
      severity: "urgent",
      title: "혈당 측정",
      detail: "70mg/dL 이하면 정맥로 확보 후 50% 포도당 50mL 투여.",
      pediatricDetail: "70mg/dL 이하면 정맥로 확보 후 10% 포도당 5mL/kg 투여.",
      sourceRef: "p.257",
    },
    {
      id: "vitals-monitor",
      severity: "urgent",
      title: "활력징후 측정 및 지속 감시",
      detail: "혈압·맥박·호흡·산소포화도를 측정한다. 치명적 질환(실신·가슴통증·호흡곤란·복통 동반)을 항상 염두에 둔다.",
      sourceRef: "p.428",
    },
  ],
};

export default dizziness;
