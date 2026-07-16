import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const burn: Scenario = {
  id: "burn",
  title: "화상",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "airway",
      severity: "critical",
      title: "기도 확보",
      detail: "의식 P 이하면 입인두기도기 삽입, 구역반사 있으면 코인두기도기로 대체.",
      sourceRef: "p.364",
    },
    {
      id: "intubation",
      severity: "critical",
      title: "기관내 삽관술",
      condition: "의식상태 악화, 호흡수 30회 이상 또는 SpO2 90% 미만, stridor·wheezing 악화 시",
      sourceRef: "p.364~365",
    },
    {
      id: "oxygen",
      severity: "critical",
      title: "100% 산소 투여",
      detail: "화재현장 구조 환자는 비재호흡마스크로 100% 산소. 연기흡입손상 시 SpO2 95% 이상이어도 고농도 산소 유지.",
      sourceRef: "p.364",
    },
    {
      id: "iv-fluid",
      severity: "urgent",
      title: "정맥로 확보 · 수액 투여",
      condition: "동반 손상으로 쇼크 위험 또는 수축기혈압 90mmHg 미만",
      detail: "18G 이상으로 정맥로 확보 후 젖산링거액 500mL를 5~10분마다 투여, 정상범위 회복까지.",
      sourceRef: "p.365",
      pediatricDetail: "18G 이상으로 정맥로 확보 후 젖산링거액 20mL/kg를 5~10분마다 투여, 정상범위 회복까지.",
    },
    {
      id: "clothing-cooling",
      severity: "important",
      title: "의복·장신구 제거 후 세척·보온",
      detail: "생리식염수 또는 깨끗한 수돗물로 세척·냉각 후 마른 시트로 보온. 손발가락 사이는 거즈로 분리.",
      sourceRef: "p.365",
    },
    {
      id: "avoid-overcooling",
      severity: "important",
      title: "과도한 냉각 주의",
      detail: "얼음찜질 금지(괴사 우려), 저체온 발생에 유의. 중증환자는 현장체류 10분 미만, 정맥로 확보로 이송 지연 금지.",
      sourceRef: "p.365",
    },
  ],
};

export default burn;
