import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 높은 곳에서 떨어진 추락 환자용. 판정 기준(성인 6m/소아 3m 또는 키의 2~3배)은 현장 확인
// 기준으로, 정확한 지침 페이지는 추후 확인 필요. 같은 높이에서 넘어진 경우는
// "낙상(넘어짐)" 시나리오(fall-trauma)를 따른다.
const fallFromHeight: Scenario = {
  id: "fall-from-height",
  title: "추락(높은 곳)",
  status: "ready",
  quickJumps: [
    { label: "심정지 발생", href: "/scenarios/cardiac-arrest" },
    { label: "기도폐쇄", href: "/scenarios/airway-obstruction" },
    { label: "다발성·중증손상 기준 해당", href: "/scenarios/multi-trauma" },
  ],
  steps: [
    {
      id: "height-criteria",
      severity: "critical",
      title: "추락 판정 기준",
      detail:
        "성인 6m(건물 2층 높이) 이상, 소아(15세 미만) 3m(또는 아이 키의 2~3배) 이상 낙하 시 추락으로 판단한다. 기준 미만이면 '낙상(넘어짐)' 시나리오를 따른다.",
      sourceRef: "현장 판단 기준",
      pediatricDetail:
        "소아(15세 미만)는 3m(또는 아이 키의 2~3배) 이상 낙하 시 추락으로 판단한다. 기준 미만이면 '낙상(넘어짐)' 시나리오를 따른다.",
      pediatricSourceRef: "현장 판단 기준",
    },
    {
      id: "high-energy-warning",
      severity: "critical",
      title: "고에너지 손상 가능성 염두",
      detail:
        "추락 기준을 충족하면 겉보기 손상이 가볍더라도 다발성·중증손상에 준해 평가한다. 착지면(단단한 바닥 등)·착지 자세(머리·발부터 등)도 함께 확인한다.",
      sourceRef: "현장 판단 기준",
    },
    {
      id: "airway",
      severity: "critical",
      title: "기도(A) 확보",
      detail: "경추손상 의심 시 head-tilt 금지, jaw thrust만 시행. 의식 P 이하면 100% 산소 투여.",
      sourceRef: "p.448~449",
    },
    {
      id: "c-collar",
      severity: "critical",
      title: "경추보호대(C-collar) 착용",
      detail: "추락 기준 충족 시 증상 유무와 관계없이 우선 착용을 고려한다.",
      sourceRef: "p.334, p.337",
    },
    {
      id: "breathing",
      severity: "critical",
      title: "호흡(B) · 산소포화도",
      detail: "SpO2<94% 산소투여. 개방성기흉→삼면밀봉드레싱, 동요가슴→압박고정.",
      sourceRef: "p.345",
    },
    {
      id: "circulation",
      severity: "critical",
      title: "순환(C) · 외부출혈 지혈",
      detail: "수축기혈압<90 → 정맥로 확보, 생리식염수 300mL 투여.",
      sourceRef: "p.341",
      pediatricDetail: "수축기혈압<90 → 정맥로 확보, 생리식염수 5mL/kg 투여.",
    },
    {
      id: "spine-immobilize",
      severity: "urgent",
      title: "척추 고정",
      detail: "통나무 굴리기로 긴 척추고정판·분리형들것에 고정.",
      sourceRef: "p.340",
    },
    {
      id: "head-injury",
      severity: "urgent",
      title: "머리손상 처치",
      detail: "뇌탈출 징후 시 두부 30도 거상. 코·귀 출혈은 막지 말고 닦기만.",
      sourceRef: "p.337",
    },
    {
      id: "abdomen-pelvis",
      severity: "urgent",
      title: "골반 · 복부 손상 처치",
      detail: "골반 불안정 시 압박밴드 고정. 장기 노출 시 식염수 거즈로 덮기.",
      sourceRef: "p.349",
    },
    {
      id: "glucose",
      severity: "important",
      title: "혈당 측정 · 포도당 투여",
      detail: "70mg/dL 이하 시 50% 포도당 50mL 투여.",
      sourceRef: "p.341",
    },
  ],
};

export default fallFromHeight;
