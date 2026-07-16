import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본) - 성인 p.219~221, 소아 호흡곤란 p.309~311
const dyspnea: Scenario = {
  id: "dyspnea",
  title: "호흡곤란",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "oxygen-low-flow",
      severity: "critical",
      title: "저산소증 교정 산소투여",
      condition: "산소포화도 94% 미만",
      detail: "비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min 투여.",
      sourceRef: "p.220",
      pediatricCondition: "SpO2 94% 미만, 또는 94% 이상이어도 의식·호흡양상 이상 시",
      pediatricDetail: "안면마스크로 10L/min을 입 주위에 대준다(blow-by).",
      pediatricSourceRef: "p.316",
    },
    {
      id: "oxygen-high-flow",
      severity: "critical",
      title: "고농도 산소투여 고려",
      condition: "심혈관·호흡기·신경계 기왕력 환자가 산소투여 후에도 SpO2 95% 미만인 경우",
      sourceRef: "p.220",
      adultOnly: true,
    },
    {
      id: "bvm-ventilation",
      severity: "critical",
      title: "양압환기(백밸브마스크)",
      condition: "산소투여로 산소포화도 호전 없는 경우",
      detail: "저장낭 갖춘 백밸브마스크 15L/min으로 양압환기 실시.",
      sourceRef: "p.220",
      pediatricCondition: "기도유지 어려움(의식저하) · 심한 호흡부전 · 충분한 산소공급에도 SpO2 90% 미만 지속",
      pediatricDetail: "백밸브마스크를 이용한 양압환기로 보조호흡 시행.",
      pediatricSourceRef: "p.316",
    },
    {
      id: "advanced-airway",
      severity: "critical",
      title: "전문기도유지술",
      condition: "산소투여 후 무반응 또는 청색증 심화, 심정지 확인 시",
      detail: "심정지 확인 시 심정지 지침 적용. 미숙련자는 성문상기도기, 숙련자는 기관내삽관.",
      sourceRef: "p.220",
      pediatricDetail:
        "소아 전문기도 훈련된 1급 대원이 2인 이상일 때만 시도, 그 외에는 백밸브마스크로 유지.",
      pediatricSourceRef: "p.301",
    },
    {
      id: "bronchodilator",
      severity: "important",
      title: "기관지 확장제 투여",
      condition: "호흡기계 질환자, 환자가 해당 약물을 휴대한 경우",
      detail: "산소투여 이후 흡입용 기관지확장제를 투여한다.",
      sourceRef: "p.221",
      pediatricDetail: "네뷸라이저·MDI를 통한 호흡분무치료는 직접의료지도 요청 후 시행.",
      pediatricSourceRef: "p.316",
    },
    {
      id: "sitting-position",
      severity: "important",
      title: "앉은 자세 취하기",
      condition: "심혈관계 기왕력 환자",
      sourceRef: "p.221",
      adultOnly: true,
    },
  ],
};

export default dyspnea;
