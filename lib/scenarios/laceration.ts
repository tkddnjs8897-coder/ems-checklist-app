import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 구급활동일지 "환자발생유형-질병 외-열상"에 대응하는 별도 챕터가 없어
// '손상 처치: 지혈 및 상처 드레싱' 술기 지침(p.504~505)을 중심으로,
// 대량출혈·쇼크 대응은 '다발성/중증손상' 일반 지침(p.321~326)을 적용하여 구성함.
const laceration: Scenario = {
  id: "laceration",
  title: "열상",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "direct-pressure",
      severity: "critical",
      title: "직접 압박 지혈",
      detail: "상처 부위를 심장보다 높이 올리고 멸균 소독거즈로 직접 압박한다. 생명을 위협하는 출혈이면 지혈대 사용을 고려한다.",
      sourceRef: "p.323, p.504",
    },
    {
      id: "shock-assessment",
      severity: "critical",
      title: "정맥로 확보 · 수액 투여",
      detail: "수축기혈압<90mmHg 시 정맥로 확보 후 생리식염수 300mL 투여, 쇼크 지속 시 1L까지.",
      sourceRef: "p.323",
      pediatricDetail:
        "수축기혈압이 연령별 저혈압 기준 미만 시 정맥로 확보 후 생리식염수 5mL/kg 투여, 쇼크 지속 시 10mL/kg까지.",
    },
    {
      id: "no-remove-object",
      severity: "urgent",
      title: "박힌 이물질 제거 금지",
      detail: "창상에 박힌 이물질은 가급적 제거하지 않고 그대로 고정한다.",
      sourceRef: "p.505",
    },
    {
      id: "wound-dressing",
      severity: "important",
      title: "세척 · 드레싱 · 붕대 감기",
      detail:
        "지혈 후 멸균 생리식염수로 세척, 소독거즈로 덮고 붕대로 감는다. 원위부→근위부 방향으로 감으며 겹치는 부분은 폭의 50% 정도, 혈류장애가 생길 정도로 조이지 않는다. 드레싱 전후로 손상부위 원위부의 순환·운동·감각 상태를 확인한다.",
      sourceRef: "p.504~505",
    },
  ],
};

export default laceration;
