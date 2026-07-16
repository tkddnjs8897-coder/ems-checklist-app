import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const fallTrauma: Scenario = {
  id: "fall-trauma",
  title: "낙상·추락 환자",
  status: "ready",
  quickJumps: [
    { label: "심정지 발생", href: "/scenarios/cardiac-arrest" },
    { label: "기도폐쇄", href: "/scenarios/airway-obstruction" },
  ],
  steps: [
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
      condition: "의식저하 · 후경부 압통 · 경부강직 시",
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
      condition: "척추 압통 또는 사지 운동·감각 이상 시",
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

export default fallTrauma;
