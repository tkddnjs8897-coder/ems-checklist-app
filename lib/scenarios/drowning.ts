import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const drowning: Scenario = {
  id: "drowning",
  title: "익수",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "rescue",
      severity: "critical",
      title: "구조 및 구출",
      detail: "직접 물에 뛰어들지 말고 기구나 로프를 이용해 구조 후 안전한 곳으로 옮긴다.",
      sourceRef: "p.373~376",
    },
    {
      id: "cardiac-arrest-normal",
      severity: "critical",
      title: "심정지(저체온 아님) 시 CPR",
      detail: "가슴압박(5cm 이상 6cm 이하, 분당 100~120회), 도수조작으로 기도확보, 백밸브마스크 30:2 또는 전문기도 후 분당 10회 호흡보조.",
      condition: "무반응·무호흡·무맥 확인 시",
      sourceRef: "p.374~375",
    },
    {
      id: "cardiac-arrest-hypothermic",
      severity: "critical",
      title: "저체온 심정지 시 재가온 병행",
      detail: "일반 심정지와 같은 순서로 치료하며 추가 인력이 있으면 구급차 히터 최대 가동, 따뜻한 수액을 겨드랑이·사타구니에 적용(피부 직접 접촉 금지).",
      sourceRef: "p.375",
    },
    {
      id: "dry-clothing",
      severity: "urgent",
      title: "젖은 피복 제거 · 보온",
      detail: "젖은 피복을 제거하고 마른 피복으로 덮는다.",
      sourceRef: "p.374",
    },
    {
      id: "spine-immobilize",
      severity: "urgent",
      title: "척추 고정",
      condition: "다이빙 등 외상성 척추손상 의심 시에만",
      detail: "척추손상 의심되지 않으면 척추 고정을 하지 않는다.",
      sourceRef: "p.375~376",
    },
    {
      id: "conscious-care",
      severity: "urgent",
      title: "의식 있는 환자 처치",
      detail: "호흡곤란 시 비재호흡마스크로 15L/min 100% 산소. 의식저하 시 기도확보 후 산소투여, 필요시 후두마스크·기관내삽관.",
      sourceRef: "p.375",
    },
    {
      id: "no-water-removal",
      severity: "important",
      title: "폐의 물 제거 시도 금지",
      detail: "이물에 의한 기도폐쇄가 아니면 폐의 물을 빼내려는 시도를 하지 않는다.",
      sourceRef: "p.376",
    },
    {
      id: "resuscitation-duration",
      severity: "important",
      title: "저체온 심정지는 소생술 장기 지속",
      detail: "체온이 35도 이상이 될 때까지 소생술을 중단하지 않는다.",
      sourceRef: "p.376",
    },
  ],
};

export default drowning;
