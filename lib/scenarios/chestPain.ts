import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 이 챕터는 성인 심인성 흉통(협심증/심근경색 의심) 전제로 작성되어 NTG·정맥로확보·STEMI 알림은
// 성인 전용으로 제한한다. 소아 흉통에 대한 별도 지침은 원문에 없다.
const chestPain: Scenario = {
  id: "chest-pain",
  title: "흉통",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "ntg",
      severity: "critical",
      title: "니트로글리세린 설하 투여",
      detail: "1알(0.3~0.6mg)을 5분 간격으로 총 3회까지 설하 투여. 2급 응급구조사는 환자 소유 약물만 직접의료지도 후 투여.",
      condition: "금기(수축기혈압≤90, 서맥<50회/분, 심부전 없는 빈맥>100회/분, 24시간 내 비아그라/레비트라 또는 48시간 내 시알리스 복용, NTG 과민반응, 우심실경색 의심) 없을 때",
      sourceRef: "p.226~227",
      adultOnly: true,
    },
    {
      id: "pediatric-redirect",
      severity: "urgent",
      title: "원인에 맞는 체크리스트로 전환",
      detail: "소아 흉통은 관상동맥질환보다 호흡기·외상·불안 등이 흔한 원인이다. 이 챕터는 성인 심인성 흉통 기준이므로 의심되는 원인별 체크리스트(호흡곤란, 손상 등)를 함께 참고한다.",
      sourceRef: "p.225",
      pediatricOnly: true,
    },
    {
      id: "oxygen",
      severity: "urgent",
      title: "산소투여",
      detail: "비강캐뉼러 1~5L/min으로 산소포화도 94% 이상 유지.",
      sourceRef: "p.226",
    },
    {
      id: "ekg-12lead",
      severity: "urgent",
      title: "심전도 검사",
      detail: "3유도(있으면 12유도) 심전도를 측정하고 이송 중에도 부정맥 발생 여부를 모니터링한다.",
      sourceRef: "p.226~227",
    },
    {
      id: "iv-access",
      severity: "urgent",
      title: "정맥로 확보",
      detail: "심인성 흉통 의심 시 현장에서 정맥로를 확보한다. NTG 투여 후 수축기혈압 90mmHg 이하로 저하되면 의료지도 하 생리식염수 500mL 정주.",
      sourceRef: "p.226",
      adultOnly: true,
    },
    {
      id: "stemi-notify",
      severity: "important",
      title: "ST-분절 상승 시 이송병원 사전 연락",
      detail: "12유도 심전도에서 ST-분절 상승 확인 시 관상동맥중재술(PCI)팀 사전 활성화를 위해 이송병원에 연락한다.",
      sourceRef: "p.227",
      adultOnly: true,
    },
  ],
};

export default chestPain;
