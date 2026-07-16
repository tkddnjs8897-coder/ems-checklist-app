import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본) - 성인 p.255~258, 소아 경련 p.312~314
const seizure: Scenario = {
  id: "seizure",
  title: "경련",
  status: "ready",
  quickJumps: [
    { label: "저혈당 의증", href: "/scenarios/hypoglycemia" },
    { label: "심정지 발생", href: "/scenarios/cardiac-arrest" },
  ],
  steps: [
    {
      id: "oxygen",
      severity: "critical",
      title: "산소 투여",
      detail: "말초 산소포화도 94% 미만 시 안면마스크로 6~10L/min 산소 투여.",
      sourceRef: "p.257",
      pediatricDetail:
        "경련이 지속되면 산소 10L/min을 입 주위에 대준다(blow-by). SpO2<90%이면서 청색증 등 저산소 징후 시 백밸브마스크 양압환기.",
      pediatricSourceRef: "p.319",
    },
    {
      id: "protect-position",
      severity: "urgent",
      title: "경련 중 자세 유지",
      detail: "경련하는 자세를 그대로 유지시키고 억지로 자세를 바꾸지 않는다.",
      condition: "경련이 지속되는 환자",
      sourceRef: "p.255",
      pediatricDetail: "토사물 흡인을 막기 위해 머리만 옆으로 돌려주고 자세를 억지로 바꾸지 않는다.",
      pediatricSourceRef: "p.319",
    },
    {
      id: "remove-hazard",
      severity: "urgent",
      title: "주변 위험물 제거",
      detail: "완력으로 경련을 멈추려 하지 않고 다치지 않도록 주변 물건만 치운다.",
      sourceRef: "p.257",
      pediatricSourceRef: "p.319",
    },
    {
      id: "glucose-check",
      severity: "urgent",
      title: "즉시 혈당 측정",
      detail: "70mg/dL 이하면 정맥로 확보 후 50% 포도당 50mL(10세 미만은 10% 포도당 5mL/kg) 투여.",
      sourceRef: "p.257",
    },
    {
      id: "post-seizure-airway",
      severity: "urgent",
      title: "경련 종료 후 기도 확보",
      detail: "구역반사가 소실되면 입인두기도기로 기도를 확보하고, 좌측 측와위로 흡인을 예방한다.",
      condition: "경련이 종료된 환자",
      sourceRef: "p.257",
    },
    {
      id: "no-oral-bite-block",
      severity: "important",
      title: "경구 공급 금지 · 설압자 삽입 금지",
      detail: "경련 중에는 어떤 것도 입으로 주지 말고, 경직 상태에서 혀 보호대를 억지로 넣지 않는다.",
      sourceRef: "p.257",
      pediatricDetail:
        "경련 중에는 어떤 것도 입으로 주지 말고, 닫힌 입을 벌리기 위해 억지로 손을 넣거나 입인두기도기를 삽입하지 않는다.",
      pediatricSourceRef: "p.319",
    },
  ],
};

export default seizure;
