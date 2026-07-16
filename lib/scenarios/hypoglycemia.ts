import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const hypoglycemia: Scenario = {
  id: "hypoglycemia",
  title: "저혈당 의증",
  status: "ready",
  quickJumps: [
    { label: "경련", href: "/scenarios/seizure" },
    { label: "행동이상·자살", href: "/scenarios/behavioral-emergency" },
  ],
  steps: [
    {
      id: "iv-glucose",
      severity: "critical",
      title: "정맥로 확보 후 포도당 정주",
      detail: "의식저하·구역반사 소실 시 정맥로 확보 후 의료지도에 따라 50% 포도당 50mL 투여.",
      condition: "의식수준이 낮거나 구역반사가 없는 경우",
      sourceRef: "p.259",
      pediatricDetail:
        "의식저하·구역반사 소실 시 정맥로 확보 후 의료지도에 따라 10세 미만은 10% 포도당 5mL/kg, 10세 이상은 50% 포도당 50mL을 투여한다.",
    },
    {
      id: "glucose-check",
      severity: "urgent",
      title: "휴대용 혈당계로 혈당 측정",
      detail: "70mg/dL 미만이면서 의식저하·식은땀·경련 등이 있으면 급성 저혈당 의증.",
      sourceRef: "p.259",
      pediatricDetail: "60mg/dL 미만이면서 의식저하·식은땀·경련 등이 있으면 급성 저혈당 의증.",
    },
    {
      id: "oral-glucose",
      severity: "urgent",
      title: "경구 포도당 투여",
      detail: "의식 명료하고 구역반사가 있으면 50% 포도당 용액 50g(100mL)을 마시게 한다.",
      condition: "의식이 명료한 경우",
      sourceRef: "p.259",
      pediatricDetail:
        "의식 명료하고 구역반사가 있으면 50% 포도당 용액을 마시게 한다(10세 미만 25g/50mL, 10세 이상 50g/100mL).",
    },
    {
      id: "maintenance-drip",
      severity: "important",
      title: "유지 수액 점적",
      detail: "최초 포도당 투여 후 10% 포도당 용액을 정맥으로 점적 주사해 혈당을 유지한다.",
      sourceRef: "p.259",
    },
    {
      id: "recheck-glucose",
      severity: "important",
      title: "혈당 반복 측정",
      detail: "병원 도착 또는 인계 시까지 30~60분 간격으로 혈당을 재측정한다.",
      sourceRef: "p.260",
    },
  ],
};

export default hypoglycemia;
