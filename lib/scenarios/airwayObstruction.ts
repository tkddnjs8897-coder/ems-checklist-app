import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본) - 성인 p.216~217, 소아 기도 이물 p.305~307
const airwayObstruction: Scenario = {
  id: "airway-obstruction",
  title: "기도폐쇄(이물)",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "back-blows",
      severity: "critical",
      title: "등 두드리기 5회",
      condition: "완전기도폐쇄로 효과적 기침이 불가능한 경우",
      sourceRef: "p.216",
      pediatricDetail:
        "1세 미만: 아이를 팔뚝에 엎드려 지지, 머리를 낮춘 자세로 양쪽 어깨뼈 사이를 손바닥으로 5회. 1세 이상: 성인과 동일하게 등 두드리기 5회 후 효과 없으면 복부밀어내기로 전환.",
      pediatricSourceRef: "p.311~312",
    },
    {
      id: "abdominal-thrust",
      severity: "critical",
      title: "복부밀어내기(하임리히법) 5회",
      detail: "등 두드리기 5회로 효과 없으면 시행. 기도폐쇄 해소 또는 의식소실 전까지 5회씩 반복.",
      sourceRef: "p.216",
      pediatricCondition: "1세 이상만 해당 (1세 미만은 시행 금지)",
      pediatricDetail:
        "1세 미만 영아는 내부장기 손상 위험이 높아 복부밀어내기를 시행하지 않는다 — 등 두드리기 5회·가슴압박(양쪽 젖꼭지 연결선 바로 아래 두 손가락으로 5회)을 이물이 나오거나 의식을 잃을 때까지 번갈아 반복.",
      pediatricSourceRef: "p.312",
    },
    {
      id: "unconscious-cpr",
      severity: "critical",
      title: "의식소실 시 심폐소생술 시작",
      detail: "가슴압박 후 인공호흡마다 입안 이물질 확인, 보이면 손가락으로 제거.",
      sourceRef: "p.217",
      pediatricDetail: "바닥에 눕히고 심폐소생술을 시작한다. 가슴압박 후 인공호흡마다 입안 이물질이 보이면 손가락으로 제거.",
      pediatricSourceRef: "p.312",
    },
    {
      id: "partial-obstruction",
      severity: "urgent",
      title: "부분기도폐쇄 시 기침 격려",
      condition: "의식 있고 기침·발성 가능한 경우",
      detail: "환자 상태를 관찰하며 자발적 기침과 호흡 노력을 방해하지 않고 계속 기침하도록 격려한다.",
      sourceRef: "p.216",
      pediatricDetail: "지시에 협조 가능한 나이면 계속 기침하도록 격려한다.",
      pediatricSourceRef: "p.311",
    },
    {
      id: "chest-thrust-special",
      severity: "urgent",
      title: "가슴밀어내기",
      condition: "임산부 · 고도비만자에서 등 두드리기로 이물 제거 안 될 때",
      sourceRef: "p.216",
      adultOnly: true,
    },
    {
      id: "blow-by-oxygen",
      severity: "urgent",
      title: "산소 투여하며 즉시 이송",
      detail: "비강캐뉼러 또는 안면마스크로 산소 10L/min을 코·입 주위에 대주며(blow-by) 가까운 응급센터로 즉시 이송.",
      condition: "부분기도폐쇄 상태",
      sourceRef: "p.312",
      pediatricOnly: true,
    },
    {
      id: "instrument-removal",
      severity: "urgent",
      title: "기구를 이용한 이물 제거",
      detail: "필요시 후두경이나 마질겸자로 이물질을 제거한다.",
      sourceRef: "p.217",
      pediatricDetail:
        "의식 있는 환자에서 제거술 2회 실패 시 마질겸자 사용. Broselow tape 등으로 체구에 맞는 후두경날을 선택.",
      pediatricSourceRef: "p.312~313",
    },
    {
      id: "no-blind-sweep",
      severity: "important",
      title: "맹목적 손가락 훑기 금지",
      detail: "의식 있는 환자, 이물질이 보이지 않거나 고형이 아닌 경우 손가락으로 훑어내지 않는다.",
      sourceRef: "p.217",
    },
  ],
};

export default airwayObstruction;
