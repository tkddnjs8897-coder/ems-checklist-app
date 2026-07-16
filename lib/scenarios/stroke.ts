import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const stroke: Scenario = {
  id: "stroke",
  title: "뇌졸중 의증",
  status: "ready",
  quickJumps: [{ label: "의식장애", href: "/scenarios/altered-mental-status" }],
  steps: [
    {
      id: "cpss",
      severity: "critical",
      title: "신시네티 병원전 뇌졸중 선별검사(CPSS)",
      detail: "얼굴 처짐·팔 위약·발음장애 중 하나라도 양성이면 뇌졸중 양성으로 판정. 급성 의식저하로 검사 불가 시 양성으로 간주.",
      sourceRef: "p.251",
    },
    {
      id: "oxygen-unconscious",
      severity: "critical",
      title: "산소 투여 (의식 없는 환자)",
      condition: "SpO2<94%인 경우",
      detail: "백밸브마스크 또는 비재호흡마스크로 11~15L/min 투여, 필요시 양압 환기.",
      sourceRef: "p.252",
    },
    {
      id: "glucose",
      severity: "critical",
      title: "혈당 측정 · 포도당 투여",
      condition: "혈당 70mg/dL 이하 시",
      detail: "정맥로 확보 후 50% 포도당액 50mL(10세 미만은 10% 포도당액 5mL/kg) 투여.",
      sourceRef: "p.252",
    },
    {
      id: "no-delay",
      severity: "critical",
      title: "신속 이송",
      detail: "마지막으로 정상이었던 시간(LNT)·최초 이상소견 발견 시간(FAT)을 확인·기록. 최초 이상소견 발견 6시간 이내면 즉시 뇌졸중 치료 가능 응급의료기관으로 이송, 현장체류 10분 이상 지체 금지.",
      sourceRef: "p.252",
    },
    {
      id: "position-unconscious",
      severity: "urgent",
      title: "체위 조정 (의식 없는 환자)",
      detail: "수축기혈압 90mmHg 이상이면 상체 15~30도 거상, 90mmHg 미만이면 변형 트렌델렌버그 자세.",
      condition: "의식이 없는 환자",
      sourceRef: "p.251",
    },
    {
      id: "airway-unconscious",
      severity: "urgent",
      title: "기도 확보",
      condition: "구역반사 소실 시",
      detail: "입인두기도기(OPA)를 이용해 기도를 확보한다.",
      sourceRef: "p.251",
    },
    {
      id: "oxygen-conscious",
      severity: "urgent",
      title: "산소 투여 (의식 있는 환자)",
      condition: "의식 A, V이고 SpO2<94%인 경우",
      detail: "비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min, 교정 안 되면 비재호흡마스크 10~15L/min.",
      sourceRef: "p.252",
    },
    {
      id: "prenotify",
      severity: "urgent",
      title: "이송병원 사전연락",
      condition: "병원전 뇌졸중 선별검사 양성 시",
      sourceRef: "p.252",
    },
    {
      id: "npo-no-bp-control",
      severity: "important",
      title: "금식 유지 · 혈압조절 처치 금지",
      detail: "경구 공급 금지하며, 병원전 단계에서 혈압 조절을 위한 특별한 처치는 하지 않는다.",
      sourceRef: "p.252",
    },
  ],
};

export default stroke;
