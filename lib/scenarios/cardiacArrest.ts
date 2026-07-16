import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본) - 성인은 심정지(비외상성) p.193~209, 소아는 영아/소아 심정지 p.301~304 중심
const cardiacArrest: Scenario = {
  id: "cardiac-arrest",
  title: "심정지",
  status: "ready",
  steps: [
    {
      id: "compressions",
      severity: "critical",
      title: "가슴압박 즉시 시작",
      detail: "흉골 아래쪽 절반을 최소 5cm(6cm 초과 금지) 깊이로 분당 100~120회 압박. 압박 후 충분히 이완.",
      sourceRef: "p.194",
      pediatricTitle: "가슴압박 즉시 시작",
      pediatricDetail:
        "가슴 전후 직경의 1/3 깊이로 분당 100~120회 압박(영아: 두 젖꼭지 연결선 바로 아래 4cm / 소아: 흉골아래 1/2 지점 4~5cm, 칼돌기·갈비뼈는 누르지 않음).",
      pediatricSourceRef: "p.303",
    },
    {
      id: "airway",
      severity: "critical",
      title: "기도확보 및 호흡보조",
      detail: "외상 증거 없으면 도수조작 후 입인두기도기 삽입. 백밸브마스크로 15L/min 산소를 가슴압박 30 : 호흡보조 2 비율로 제공.",
      sourceRef: "p.194",
      pediatricDetail:
        "전문기도 확보에 자신이 없으면 백밸브마스크 양압환기로 유지. 소아 전문기도 훈련된 1급 대원이 2인 이상일 때만 전문기도유지술 시도.",
      pediatricSourceRef: "p.301",
    },
    {
      id: "aed-rhythm",
      severity: "critical",
      title: "심장충격기 부착 및 리듬분석",
      detail: "제세동 필요 시 충전 중에도 압박 지속, 완료되면 압박 멈추고 제세동 후 즉시 재개. 5주기(2분)마다 재분석, 맥박은 10초 이상 확인하지 않는다.",
      sourceRef: "p.195, p.197",
      pediatricDetail:
        "제세동 처음 2J/kg, 이후 4J/kg 이상(최대 10J/kg 또는 성인 최대용량 이하). 2분(가슴압박 5주기)마다 리듬 재분석.",
      pediatricSourceRef: "p.303",
    },
    {
      id: "advanced-airway",
      severity: "urgent",
      title: "전문기도유지술",
      detail: "성문주위 기도기 또는 기관내삽관 시행 후 분당 10회 속도로 호흡보조. 가슴압박은 중단 없이 지속.",
      sourceRef: "p.194~195",
      pediatricDetail:
        "6초에 한 번(분당 10회) 호흡. 자발순환은 있으나 호흡이 불충분하면 3~5초에 한 번(분당 12~20회). 과환기 주의.",
      pediatricSourceRef: "p.303",
    },
    {
      id: "epinephrine",
      severity: "urgent",
      title: "에피네프린 정맥 투여",
      detail: "1mg 정맥투여 후 생리식염수 20mL bolus, 팔을 20초간 거상. ROSC 전까지 3~5분 간격 반복.",
      sourceRef: "p.195~196",
      pediatricDetail:
        "10,000:1 희석액 0.1mL/kg(0.01mg/kg) 정맥·골강내 투여. 정맥로 확보 어려우면 골강내(IO) 주사를 우선 고려.",
      pediatricSourceRef: "p.303",
    },
    {
      id: "reversible-cause",
      severity: "urgent",
      title: "가역적 원인 교정",
      condition: "외상·목맴·질식·익수로 인한 심정지 시",
      detail: "대량출혈 지혈, 긴장성기흉 감압 등 원인 교정을 압박 지속보다 우선 고려.",
      sourceRef: "p.202~203",
      pediatricCondition: "외상·질식·익수로 인한 심정지 시",
      pediatricDetail:
        "5H(저혈량증·저산소증·대사성산증·저/고칼륨혈증·저체온증)·5T(폐혈전증·심근경색·긴장성기흉·심장눌림증·약물중독) 중 교정 가능한 원인을 우선 찾아 처치.",
      pediatricSourceRef: "p.303",
    },
    {
      id: "weight-estimate",
      severity: "important",
      title: "체중 추정",
      detail: "Broselow tape 또는 연령-체중 공식(나이+4)×2로 체중을 추정해 약물·제세동 용량 계산에 사용.",
      sourceRef: "p.303",
      pediatricOnly: true,
    },
  ],
};

export default cardiacArrest;
