import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 구급활동일지 "환자발생유형-질병 외-기계·농기계 손상"에 대응하는 별도 챕터가 없어
// '다발성/중증손상' 일반 지침(p.321~326)의 신체검사 기준(압궤·절단 등)과
// '손상 처치: 지혈 및 상처 드레싱 · 절단된 조직 · 부목 고정' 술기 지침(p.504~507)을 적용하여 구성함.
// 기계 정지·전원 차단 확인은 술기 지침에 명시된 내용이 아니라, 압궤손상 환자 접근 시 통상적으로
// 요구되는 현장안전 절차로 추가함.
const machineryInjury: Scenario = {
  id: "machinery-injury",
  title: "기계·농기계 손상",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "machine-stopped",
      severity: "critical",
      title: "기계 작동 정지 · 전원 차단 확인",
      detail: "환자 접근 및 처치 전 기계(콤바인·탈곡기 등)의 가동이 멈추고 전원이 차단되었는지 확인한다. (현장안전 확보를 위한 통상 절차)",
      sourceRef: "p.322",
    },
    {
      id: "airway-breathing",
      severity: "critical",
      title: "기도(A) · 호흡(B) 처치",
      detail: "산소포화도 96~98% 유지, 필요 시 백밸브마스크 사용.",
      sourceRef: "p.322~323",
    },
    {
      id: "hemorrhage-amputation",
      severity: "critical",
      title: "지혈 · 절단부 처치",
      detail:
        "압박지혈, 필요 시 지혈대 사용 고려. 절단된 조직은 생리식염수를 적신 후 꼭 짠 거즈로 감싸 밀폐용기에 넣고 얼음물에 담그되, 조직이 얼음에 직접 닿지 않도록 한다.",
      sourceRef: "p.323, p.505",
    },
    {
      id: "circulation",
      severity: "critical",
      title: "순환(C) · 정맥로 확보",
      detail: "수축기혈압<90mmHg 시 정맥로 확보 후 생리식염수 300mL 투여, 쇼크 지속 시 1L까지.",
      sourceRef: "p.323",
      pediatricDetail:
        "수축기혈압이 연령별 저혈압 기준 미만 시 정맥로 확보 후 생리식염수 5mL/kg 투여, 쇼크 지속 시 10mL/kg까지.",
    },
    {
      id: "splinting",
      severity: "urgent",
      title: "부목 고정",
      detail: "골절 부위를 포함해 근위부·원위부 관절을 함께 고정한다. 고정 전·후로 손상부위 원위부의 순환·운동·감각 상태를 평가한다.",
      sourceRef: "p.506~507",
    },
  ],
};

export default machineryInjury;
