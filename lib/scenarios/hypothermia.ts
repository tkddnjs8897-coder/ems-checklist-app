import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const hypothermia: Scenario = {
  id: "hypothermia",
  title: "저체온증",
  status: "ready",
  quickJumps: [{ label: "심정지 발생", href: "/scenarios/cardiac-arrest" }],
  steps: [
    {
      id: "cardiac-arrest",
      severity: "critical",
      title: "무맥·무호흡 시 CPR",
      detail:
        "저체온 심정지 프로토콜에 따라 가슴압박(5cm 이상 6cm 이하, 분당 100~120회), 기도확보, 호흡보조, 자동심장충격기 리듬 확인을 시행. 서맥 발생 가능성이 높으므로 맥박은 20초 이상 확인하여 심정지 오판을 방지한다.",
      sourceRef: "p.379~380",
    },
    {
      id: "remove-cold",
      severity: "urgent",
      title: "젖은 의복 제거 · 저온환경 이탈",
      detail: "젖은 의복을 제거하고 마른 담요로 감싼 뒤 저온환경에서 이동시킨다.",
      sourceRef: "p.379",
    },
    {
      id: "rewarming",
      severity: "urgent",
      title: "재가온 처치",
      condition: "중등도 이상 저체온증",
      detail: "구급차 히터를 최대로 가동하고, 온장고의 따뜻한 수액을 수건에 싸서 겨드랑이·사타구니에 적용(피부 직접 접촉 금지).",
      sourceRef: "p.380~381",
    },
    {
      id: "gentle-handling",
      severity: "important",
      title: "환자를 부드럽게 다루기",
      detail: "과도한 조작은 부정맥을 유발할 수 있다.",
      sourceRef: "p.381",
    },
    {
      id: "prolonged-cpr",
      severity: "important",
      title: "명백한 사망 증거 없으면 CPR 지속",
      detail: "저체온 심정지는 정상체온보다 뇌 생존가능성이 오래 유지되므로 신체분리 등 명백한 사망 징후가 없으면 무조건 소생술 시행.",
      sourceRef: "p.381",
    },
  ],
};

export default hypothermia;
