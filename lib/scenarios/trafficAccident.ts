import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
// 구급활동일지 "환자발생유형-질병 외-교통사고"에 대응하는 별도 챕터가 없어
// '다발성/중증손상' 일반 지침(p.321~326) 중 고위험 교통사고 기준과
// 외상 평가·처치 절차를 적용하여 구성함.
const trafficAccident: Scenario = {
  id: "traffic-accident",
  title: "교통사고",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "airway",
      severity: "critical",
      title: "기도(A) 확보",
      detail:
        "의식 P 이하면 입인두기도기 삽입, 구역반사 시 코인두기도기로 대체. 두개골 기저부 골절 의심 시 코인두기도기 금지, 도수조작(머리기울임 제외)만 시행.",
      sourceRef: "p.322~323",
    },
    {
      id: "c-collar",
      severity: "critical",
      title: "경추(목뼈) 고정",
      sourceRef: "p.323",
    },
    {
      id: "breathing",
      severity: "critical",
      title: "호흡(B) · 산소포화도",
      detail: "산소포화도 96~98% 유지. 양압환기 필요 시 백밸브마스크 사용.",
      sourceRef: "p.323",
    },
    {
      id: "hemorrhage-circulation",
      severity: "critical",
      title: "외부출혈 지혈 · 순환(C)",
      detail:
        "멸균 소독거즈로 압박지혈, 필요 시 지혈대 사용 고려. 수축기혈압<90mmHg 시 18G 이상 정맥로 확보 후 생리식염수 300mL 투여, 쇼크 지속 시 1L까지.",
      sourceRef: "p.323",
      pediatricDetail:
        "멸균 소독거즈로 압박지혈, 필요 시 지혈대 사용 고려. 수축기혈압이 연령별 기준 미만 시 18G 이상 정맥로 확보 후 생리식염수 5mL/kg 투여, 쇼크 지속 시 10mL/kg까지.",
    },
    {
      id: "pain-control",
      severity: "important",
      title: "통증 조절",
      condition: "통증점수 10점 만점에 8점 이상, 활력징후 안정 시",
      detail: "지도의사 지시에 따라 정맥로 확보 후 아세트아미노펜(프리믹스) 1bag을 15분간 투여, 투여 5분 후 재평가.",
      sourceRef: "p.323~324",
      adultOnly: true,
    },
  ],
};

export default trafficAccident;
