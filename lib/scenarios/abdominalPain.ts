import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 복통은 표준지침에 전용 처치 챕터가 없다(구급활동일지 환자증상 체크박스 항목). 아래는 노인환자
// 특수상황(p.429)·비외상성 쇼크(p.213, p.219)·복부손상 체위(p.343) 등에 흩어진 일반 원칙을 묶은 것이다.
const abdominalPain: Scenario = {
  id: "abdominal-pain",
  title: "복통",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "shock-fluid",
      severity: "critical",
      title: "쇼크 징후 시 정맥로 확보 · 수액 투여",
      condition: "수축기혈압 90mmHg 미만 등 쇼크 징후 동반 시",
      detail: "생리식염수 또는 하트만용액 300mL 투여, 필요시 최대 1L까지.",
      pediatricDetail: "생리식염수 또는 하트만용액 5mL/kg 투여, 필요시 최대 10mL/kg까지.",
      sourceRef: "p.213",
    },
    {
      id: "red-flags",
      severity: "urgent",
      title: "위험신호 확인",
      detail: "심한 통증·압통, 혈변·토혈 동반, 실신·저혈압 동반 시 치명적 질환 가능성으로 보고 이송을 우선한다.",
      sourceRef: "p.429",
    },
    {
      id: "vitals-monitor",
      severity: "urgent",
      title: "활력징후 측정 및 지속 감시",
      detail: "혈압·맥박·호흡·산소포화도를 측정하고 이송 중에도 지속 감시한다.",
      sourceRef: "p.451",
    },
    {
      id: "position-npo",
      severity: "important",
      title: "편안한 자세 · 금식 유지",
      detail: "무릎을 구부린 자세가 복부 근육 긴장을 완화한다. 경구 음식·음료는 주지 않는다.",
      sourceRef: "p.343",
    },
  ],
};

export default abdominalPain;
