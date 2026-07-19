import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const heatIllness: Scenario = {
  id: "heat-illness",
  title: "고온환경질환",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "heat-stroke-position",
      severity: "critical",
      title: "열사병 의심 시 즉시 이송·처치",
      condition: "의식저하(V 이하)",
      detail: "편평하게 눕히고 수축기혈압 90 미만이 아니면 흡인방지 위해 상체 30도 거상, 즉시 이송하며 처치 시작.",
      sourceRef: "p.384",
    },
    {
      id: "airway-oxygen",
      severity: "critical",
      title: "기도확보 · 산소투여",
      detail: "의식 P 이하면 입인두기도기. SpO2 94% 미만 시 안면마스크 6~10L/min(V), 비재호흡마스크 12~15L/min(P·U), 필요시 백밸브마스크 양압환기.",
      sourceRef: "p.384~385",
    },
    {
      id: "remove-heat",
      severity: "urgent",
      title: "고온환경 이탈 · 의복 제거",
      detail: "고온 환경에서 환자를 이동시키고 의복을 제거하여 노출을 차단한다.",
      sourceRef: "p.384",
    },
    {
      id: "iv-fluid",
      severity: "urgent",
      title: "정맥로 확보 · 수액 투여",
      detail: "경구 투여 금지, 생리식염수·하트만용액 300mL 투여, 쇼크 지속 시 1L까지.",
      sourceRef: "p.385",
      pediatricDetail: "경구 투여 금지, 생리식염수·하트만용액 5mL/kg 투여, 쇼크 지속 시 10mL/kg까지.",
    },
    {
      id: "cooling",
      severity: "urgent",
      title: "이송 중 냉각처치",
      detail: "에어컨 최대 가동, 전신에 물 분무 후 부채질로 증발 유도, 혹서기에는 겨드랑이·사타구니에 얼음주머니. 몸을 떨면 일시 중단.",
      sourceRef: "p.385",
    },
    {
      id: "conscious-normal",
      severity: "important",
      title: "의식 정상 환자 처치",
      condition: "열경련·열실신·열탈진 의심(의식 정상)",
      detail: "경구로 전해질 음료를 투여하며 활력징후를 지속 감시한다.",
      sourceRef: "p.384",
    },
    {
      id: "glucose",
      severity: "important",
      title: "혈당 측정 · 저혈당 교정",
      detail: "70mg/dL 이하면 정맥로 확보 후 50% 포도당 50mL 투여.",
      sourceRef: "p.385",
      pediatricDetail:
        "70mg/dL 이하면 정맥로 확보 후 10세 미만은 10% 포도당 5mL/kg, 10세 이상은 50% 포도당 50mL을 투여한다.",
    },
  ],
};

export default heatIllness;
