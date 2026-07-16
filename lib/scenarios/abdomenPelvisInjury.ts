import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const abdomenPelvisInjury: Scenario = {
  id: "abdomen-pelvis-injury",
  title: "복부·골반손상",
  status: "ready",
  quickJumps: [
    { label: "심정지 발생", href: "/scenarios/cardiac-arrest" },
    { label: "기도폐쇄", href: "/scenarios/airway-obstruction" },
  ],
  steps: [
    {
      id: "airway-oxygen",
      severity: "critical",
      title: "기도(A) · 산소 투여",
      detail: "의식 P 이하면 입인두기도기(구역반사 시 코인두기도기). SpO2<94% 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min.",
      sourceRef: "p.343",
    },
    {
      id: "circulation",
      severity: "critical",
      title: "순환(C) · 정맥로 확보",
      detail: "수축기혈압<90mmHg 시 18G 이상 정맥로 확보 후 생리식염수 300mL, 쇼크 지속 시 1L까지 투여.",
      sourceRef: "p.343",
      pediatricDetail: "수축기혈압<90mmHg 시 18G 이상 정맥로 확보 후 생리식염수 5mL/kg, 쇼크 지속 시 10mL/kg까지 투여.",
    },
    {
      id: "evisceration",
      severity: "critical",
      title: "장기 노출 시 처치",
      condition: "내부 장기가 복부 밖으로 노출된 경우",
      detail: "정복 시도 금지. 생리식염수 적신 거즈로 덮어 건조 방지 후 압력 없이 두터운 드레싱.",
      sourceRef: "p.343",
    },
    {
      id: "pelvic-binder",
      severity: "critical",
      title: "골반뼈 고정",
      condition: "골반뼈 골절 의심 시",
      detail: "골반뼈 압박밴드(pelvic binder)로 고정.",
      sourceRef: "p.343",
    },
    {
      id: "impaled-object",
      severity: "urgent",
      title: "박힌 이물질 고정",
      condition: "이물질이 박혀있는 경우",
      detail: "현장에서 제거하지 말고 패드·타월로 움직이지 않게 고정 후 이송.",
      sourceRef: "p.343",
    },
    {
      id: "position",
      severity: "important",
      title: "체위 조정",
      detail: "복부근육 긴장 완화를 위해 다리를 구부린 자세로 무릎 아래 담요를 받쳐준다.",
      sourceRef: "p.343",
    },
  ],
};

export default abdomenPelvisInjury;
