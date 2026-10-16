import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본) - 응급 분만
const childbirth: Scenario = {
  id: "childbirth",
  title: "응급분만",
  status: "ready",
  quickJumps: [
    { label: "질출혈", href: "/scenarios/vaginal-bleeding" },
    { label: "자간증", href: "/scenarios/eclampsia" },
  ],
  steps: [
    {
      id: "perineum-support",
      severity: "critical",
      title: "머리 지지 및 회음부 보호",
      detail: "한 손은 태아 머리를 지탱하고 다른 손은 멸균거즈로 회음부 아래쪽을 지탱해 열상을 최소화한다.",
      sourceRef: "p.284",
    },
    {
      id: "suction-newborn",
      severity: "critical",
      title: "입·코 순서로 닦고 흡인",
      detail: "머리가 나오면 입에서 코 순서로 닦고, bulb syringe로 입→코 순으로 이물질을 흡인한다.",
      sourceRef: "p.284",
    },
    {
      id: "cord-around-neck",
      severity: "critical",
      title: "탯줄이 목을 감은 경우",
      condition: "탯줄이 태아 목을 감고 있을 때",
      detail: "머리 위로 조심스럽게 벗겨낸다. 너무 단단히 조이면 직접의료지도를 요청한다.",
      sourceRef: "p.284",
    },
    {
      id: "newborn-resuscitation",
      severity: "critical",
      title: "신생아 소생 처치",
      detail: "무호흡·헐떡호흡이거나 심박수 100회 미만이면 양압환기. 양압환기에도 심박수 60회 미만이면 심폐소생술 시행.",
      sourceRef: "p.284",
    },
    {
      id: "cord-clamp-cut",
      severity: "urgent",
      title: "탯줄 결찰 및 절단",
      detail: "배꼽에서 10cm 지점을 켈리로 결찰, 그 아래 5cm 지점을 두 번째 결찰 후 사이를 멸균가위로 절단하고 클로르헥시딘으로 소독한다.",
      sourceRef: "p.284",
    },
    {
      id: "maternal-hemorrhage",
      severity: "urgent",
      title: "산모 출혈 처치",
      detail: "출혈이 많거나 수축기혈압 90mmHg 미만이면 정맥로 확보 후 생리식염수 300mL 투여, 쇼크 지속 시 1L까지 투여.",
      sourceRef: "p.284",
    },
    {
      id: "apgar-score",
      severity: "important",
      title: "아프가 점수 측정",
      detail: "출생 후 1분·5분에 측정하고 병원 도착 전까지 1·5·10분 간격으로 반복. 4점 이하면 즉시 심폐소생술.",
      sourceRef: "p.284~285",
    },
    {
      id: "placenta-care",
      severity: "important",
      title: "태반 만출 대기 및 보관",
      detail: "태반이 나오면 깨끗한 용기에 담아 환자와 함께 이송. 질 쪽으로 거즈 packing은 금기.",
      sourceRef: "p.285",
    },
  ],
};

export default childbirth;
