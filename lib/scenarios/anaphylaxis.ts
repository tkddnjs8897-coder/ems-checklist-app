import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const anaphylaxis: Scenario = {
  id: "anaphylaxis",
  title: "알레르기·아나필락시스",
  status: "ready",
  quickJumps: [{ label: "발열·패혈증쇼크", href: "/scenarios/fever-sepsis" }],
  steps: [
    {
      id: "epinephrine",
      severity: "critical",
      title: "에피네프린 자동주사 근육주사",
      detail: "대퇴부 전외측에 90도로 찔러 클릭음 후 10초 유지. 30kg 이상 성인용, 미만은 소아용. 5~15분 간격으로 반복 가능.",
      condition: "아나필락시스로 판단되는 경우",
      sourceRef: "p.267",
    },
    {
      id: "oxygen-airway",
      severity: "critical",
      title: "고농도 산소 · 전문기도유지술",
      detail: "저장백 안면마스크로 100% 산소 투여. 산소포화도 유지 안 되면 기관삽관 등 전문기도유지술 시행(1급 응급구조사 등).",
      sourceRef: "p.266",
    },
    {
      id: "airway-obstruction-warning",
      severity: "critical",
      title: "상기도 부종 조기 대응",
      detail: "그렁거리는 호흡음과 입술 부종이 심하면 기도폐쇄 임박으로 판단, 조기에 전문기도유지술을 고려한다.",
      sourceRef: "p.267",
      condition: "상기도 폐쇄 징후",
    },
    {
      id: "iv-fluid",
      severity: "critical",
      title: "다리 거상 · 정맥로 확보 후 수액",
      detail: "수축기혈압<90mmHg 시 다리를 올리고 생리식염수·젖산링거액 300mL, 쇼크 지속 시 1L까지 투여.",
      sourceRef: "p.266",
      pediatricDetail: "수축기혈압<90mmHg 시 다리를 올리고 생리식염수·젖산링거액 5mL/kg, 쇼크 지속 시 10mL/kg까지 투여.",
    },
    {
      id: "remove-allergen",
      severity: "urgent",
      title: "원인 알레르기 물질 제거",
      detail: "환자가 알고 있는 원인 물질이 있으면 즉시 제거한다.",
      sourceRef: "p.266",
    },
    {
      id: "mild-allergy",
      severity: "important",
      title: "경증 알레르기 대증처치",
      detail: "가려움증으로 인한 과도한 긁기를 방지한다.",
      condition: "경증 알레르기(호흡곤란·저혈압 없음)",
      sourceRef: "p.266",
    },
  ],
};

export default anaphylaxis;
