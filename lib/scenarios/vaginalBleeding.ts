import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본) - 질출혈
const vaginalBleeding: Scenario = {
  id: "vaginal-bleeding",
  title: "질출혈",
  status: "ready",
  quickJumps: [
    { label: "응급분만", href: "/scenarios/childbirth" },
    { label: "자간증", href: "/scenarios/eclampsia" },
  ],
  steps: [
    {
      id: "iv-fluid",
      severity: "critical",
      title: "정맥로 확보 및 수액 투여",
      condition: "출혈량 500mL 초과 또는 수축기혈압 90mmHg 미만",
      detail: "생리식염수 또는 하트만용액 500mL(소아 5mL/kg) 투여. 쇼크 지속 시 2L(소아 10mL/kg)까지 투여.",
      sourceRef: "p.289",
    },
    {
      id: "no-packing",
      severity: "critical",
      title: "질 내 거즈 삽입 금지",
      detail: "지혈을 위해 질 안으로 거즈 등을 삽입하지 않는다.",
      sourceRef: "p.289",
    },
    {
      id: "pregnancy-related",
      severity: "urgent",
      title: "임신 관련 질출혈 체위",
      condition: "임신 20주 이상 임신부",
      detail: "좌측 측와위(옆누움) 자세를 취하게 하고 엉덩이 아래에 소독포를 깐다.",
      sourceRef: "p.289",
    },
    {
      id: "o2-therapy",
      severity: "important",
      title: "산소 투여",
      detail: "산소포화도 94% 미만 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min. 95% 이상 안 되면 비재호흡마스크로 11~15L/min.",
      sourceRef: "p.288~289",
    },
    {
      id: "delivery-related",
      severity: "important",
      title: "분만 관련 질출혈",
      condition: "분만이 진행 중이거나 임박한 경우",
      detail: "‘응급 분만’ 응급처치 및 술기 지침을 따른다.",
      sourceRef: "p.289",
    },
    {
      id: "gauze-count",
      severity: "important",
      title: "출혈량 파악 및 인계",
      detail: "사용한 거즈 수를 확인(4×4 거즈 1장당 최대 12mL 흡수)해 출혈량을 가늠하고 이송병원에 인계한다.",
      sourceRef: "p.289",
    },
  ],
};

export default vaginalBleeding;
