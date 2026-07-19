import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const nonTraumaShock: Scenario = {
  id: "non-trauma-shock",
  title: "비외상성 쇼크",
  status: "ready",
  quickJumps: [
    { label: "심정지 발생", href: "/scenarios/cardiac-arrest" },
    { label: "알레르기·아나필락시스", href: "/scenarios/anaphylaxis" },
  ],
  steps: [
    {
      id: "oxygen-by-consciousness",
      severity: "critical",
      title: "의식수준별 산소투여",
      detail: "명료 시 비재호흡마스크 15L/min, 'V'이하·호흡 10회 미만은 백밸브마스크 보조환기, 'U'는 입인두기도기 삽입 후 백밸브마스크.",
      sourceRef: "p.214",
    },
    {
      id: "anaphylaxis-shock",
      severity: "critical",
      title: "아나필락시스 쇼크 처치",
      condition: "알레르기 반응 의심 시",
      detail:
        "알레르기·아나필락시스 지침 적용: 에피네프린 자동주사(대퇴부 전외측 근육주사, 5~15분 간격 반복 가능), 고농도 산소 투여, 수축기혈압<90mmHg 시 다리 거상 후 수액(생리식염수·하트만용액), 원인 알레르기 물질 제거. 자세한 항목은 위 '알레르기·아나필락시스' 바로가기 참고.",
      sourceRef: "p.214, p.266~267",
    },
    {
      id: "iv-fluid-hypovolemic",
      severity: "urgent",
      title: "정맥로 확보 · 수액 투여",
      condition: "저혈량성 · 신경성 · 패혈성 쇼크",
      detail: "생리식염수 또는 하트만용액 300mL를 5~10분마다 투여, 최대 1L까지 지속.",
      sourceRef: "p.214",
      pediatricDetail: "생리식염수 또는 하트만용액 5mL/kg를 5~10분마다 투여, 최대 10mL/kg까지 지속.",
    },
    {
      id: "cardiogenic-fluid",
      severity: "urgent",
      title: "심장성 쇼크 처치",
      detail: "부정맥·흉통 동반 시 흉통지침 적용. 폐부종 없으면 생리식염수 250mL 투여.",
      sourceRef: "p.214",
    },
    {
      id: "positioning",
      severity: "important",
      title: "환자 자세 조정",
      detail: "저혈압 시 다리 상승, 호흡곤란 시 머리 상승.",
      sourceRef: "p.214",
    },
    {
      id: "warmth",
      severity: "important",
      title: "체온 유지",
      detail: "모포를 덮어 적정 체온을 유지한다.",
      sourceRef: "p.215",
    },
  ],
};

export default nonTraumaShock;
