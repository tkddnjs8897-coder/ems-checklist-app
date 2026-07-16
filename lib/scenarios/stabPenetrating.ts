import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 구급활동일지 "환자발생유형-질병 외-자상·관통상"에 대응하는 별도 챕터가 없어
// '다발성/중증손상' 일반 지침(p.321~326)의 신체검사 기준(관통·자상 부위)과
// '손상 처치: 지혈 및 상처 드레싱' 술기 지침(p.504~505)을 적용하여 구성함.
const stabPenetrating: Scenario = {
  id: "stab-penetrating",
  title: "자상·관통상",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "no-remove-object",
      severity: "critical",
      title: "박힌 물체 제거 금지 · 고정",
      detail: "칼날 등 삽입물은 제거하지 말고 움직이지 않도록 그 상태로 고정한다.",
      sourceRef: "p.505",
    },
    {
      id: "hemorrhage",
      severity: "critical",
      title: "지혈",
      detail: "삽입물 주변을 멸균 소독거즈로 압박지혈하며, 생명을 위협하는 출혈이면 지혈대 사용을 고려한다.",
      sourceRef: "p.323, p.504",
    },
    {
      id: "airway-breathing",
      severity: "critical",
      title: "기도(A) · 호흡(B) 처치",
      detail: "목·가슴 부위 손상 시 호흡곤란·비대칭 호흡 여부를 관찰한다. 산소포화도 96~98% 유지, 필요 시 백밸브마스크 사용.",
      sourceRef: "p.322~323",
    },
    {
      id: "circulation",
      severity: "critical",
      title: "순환(C) · 정맥로 확보",
      detail: "수축기혈압<90mmHg 시 18G 이상 정맥로 확보 후 생리식염수 300mL 투여, 쇼크 지속 시 1L까지.",
      sourceRef: "p.323",
      pediatricDetail:
        "수축기혈압이 연령별 기준 미만 시 18G 이상 정맥로 확보 후 생리식염수 5mL/kg 투여, 쇼크 지속 시 10mL/kg까지.",
    },
    {
      id: "pain-control",
      severity: "important",
      title: "통증 조절",
      condition: "통증점수 10점 만점에 8점 이상, 활력징후 안정 시",
      detail: "지도의사 지시에 따라 정맥로 확보 후 아세트아미노펜(프리믹스) 1bag을 15분간 투여.",
      sourceRef: "p.323~324",
      adultOnly: true,
    },
  ],
};

export default stabPenetrating;
