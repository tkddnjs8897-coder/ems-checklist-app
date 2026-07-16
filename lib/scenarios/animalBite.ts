import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const animalBite: Scenario = {
  id: "animal-bite",
  title: "동물·곤충 교상",
  status: "ready",
  quickJumps: [{ label: "알레르기·아나필락시스", href: "/scenarios/anaphylaxis" }],
  steps: [
    {
      id: "snake-bite",
      severity: "critical",
      title: "뱀 교상 처치",
      detail: "건조드레싱 후 부목으로 고정, 물린 부위 근위부에 탄력붕대(동맥차단 금지, 말단 맥박 확인), 심장보다 낮게 위치, 산소 공급하며 이송. 얼음팩 금지.",
      sourceRef: "p.398",
    },
    {
      id: "wound-care",
      severity: "urgent",
      title: "조이는 물품 제거 · 상처 세척",
      detail: "조이는 의류·보석류 제거. 멸균증류수나 식염수로 세척, 출혈 시 거즈로 10분간 직접압박.",
      sourceRef: "p.397",
    },
    {
      id: "marine-sting",
      severity: "urgent",
      title: "해양동물 쏘임 처치",
      detail: "해파리·말미잘은 미지근한 생리식염수로 씻고 문지르지 않음. 독물고기는 미지근한 생리식염수 세척 후 환부를 40~50도로 따뜻하게 유지, 문지르지 않음.",
      sourceRef: "p.398",
    },
    {
      id: "iv-fluid",
      severity: "urgent",
      title: "정맥로 확보 · 수액 투여",
      condition: "수축기혈압 90mmHg 미만",
      detail: "하지 거상 후 생리식염수·젖산링거액 300mL 투여, 쇼크 지속 시 1L까지.",
      sourceRef: "p.397",
      pediatricDetail: "하지 거상 후 생리식염수·젖산링거액 20mL/kg 투여, 쇼크 지속 시 10mL/kg까지.",
    },
    {
      id: "sting-removal",
      severity: "important",
      title: "벌침 제거",
      detail: "신용카드 등을 이용해 부드럽게 긁어내듯 제거한다.",
      sourceRef: "p.398",
    },
  ],
};

export default animalBite;
