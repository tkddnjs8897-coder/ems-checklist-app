import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 구급활동일지상 "질식"은 이물/목맴·목졸림/연기흡입 3개 세부기전으로 분류되며(p.704),
// 표준지침 본문에는 이 중 '이물질에 의한 기도폐쇄'(p.216~218)만 상세 절차가 마련되어 있다.
// 목맴·목졸림, 연기흡입에 대한 기전별 세부 처치는 본문에 별도로 기술되어 있지 않아
// 일반 평가·처치 절차를 준용하도록 안내함(과잉 구체화 금지).
const asphyxiation: Scenario = {
  id: "asphyxiation",
  title: "질식",
  status: "ready",
  quickJumps: [
    { label: "심정지 발생", href: "/scenarios/cardiac-arrest" },
    { label: "기도폐쇄(이물) 상세", href: "/scenarios/airway-obstruction" },
  ],
  steps: [
    {
      id: "foreign-body-relief",
      severity: "critical",
      title: "이물 기도폐쇄: 등 두드리기 → 하임리히법",
      condition: "이물질에 의한 기도막힘",
      detail: "완전기도폐쇄로 기침이 효과적이지 않으면 등 두드리기 5회, 이어서 복부밀어내기(하임리히법) 5회를 기도폐쇄가 해소되거나 의식을 잃을 때까지 반복한다.",
      sourceRef: "p.216",
    },
    {
      id: "unconscious-cpr",
      severity: "critical",
      title: "의식소실 시 심폐소생술",
      detail: "가슴압박 후 인공호흡마다 입안에 이물질이 보이는지 확인하고, 보이면 손가락으로 제거한다. 보이지 않거나 고형이 아니면 맹목적으로 훑어내지 않는다.",
      sourceRef: "p.216~217",
    },
    {
      id: "chest-thrust-special",
      severity: "urgent",
      title: "임산부 · 고도비만자는 가슴밀어내기",
      condition: "이물질에 의한 기도막힘, 등 두드리기로 제거되지 않을 때",
      sourceRef: "p.216",
      adultOnly: true,
    },
    {
      id: "strangulation-inhalation-general",
      severity: "urgent",
      title: "목맴·목졸림 · 연기흡입은 일반 처치 준용",
      condition: "외력에 의한 압박(목맴·목졸림) 또는 연기흡입",
      detail: "표준지침에 기전별 세부 절차가 별도로 마련되어 있지 않으므로, 기도(A)·호흡(B)·순환(C) 중심의 일반 처치 절차를 적용한다.",
      sourceRef: "p.704",
    },
  ],
};

export default asphyxiation;
