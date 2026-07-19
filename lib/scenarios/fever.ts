import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본) - 성인 p.262~264, 소아 발열 p.315~320
// 패혈증·패혈증성 쇼크가 의심되면 "패혈증의심" 시나리오(sepsis-shock)를 따로 둔다.
const fever: Scenario = {
  id: "fever",
  title: "고열",
  status: "ready",
  quickJumps: [{ label: "패혈증의심 징후", href: "/scenarios/sepsis-shock" }],
  steps: [
    {
      id: "coexisting-symptom",
      severity: "urgent",
      title: "동반 증상별 처치 전환",
      condition: "발열과 함께 경련·호흡곤란 동반 시",
      detail: "경련 또는 호흡곤란 체크리스트로 전환해 해당 처치를 시행.",
      sourceRef: "p.322",
      pediatricOnly: true,
    },
    {
      id: "tepid-sponging",
      severity: "important",
      title: "미지근한 물수건으로 체온 하강",
      detail: "오한이 없다면 미지근한 물수건으로 몸을 닦아 증발로 체온을 낮춘다. 찬물은 혈관수축을 유발하므로 사용하지 않는다.",
      condition: "단순 발열, 오한 없음",
      sourceRef: "p.263",
      pediatricTitle: "옷 벗기기 · 얇게 입히기",
      pediatricDetail: "이송 중 오한이 없다면 아이의 옷을 벗기거나 얇게 입히도록 권한다.",
      pediatricSourceRef: "p.322",
    },
    {
      id: "ppe",
      severity: "important",
      title: "개인보호장구 착용",
      detail: "접촉·공기매개 감염병 가능성을 고려해 마스크·장갑 등을 착용한다. 수막구균패혈증 의심 접촉자는 예방적 항생제 대상.",
      sourceRef: "p.264",
    },
  ],
};

export default fever;
