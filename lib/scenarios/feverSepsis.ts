import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본) - 성인 발열·패혈증쇼크 p.262~264, 소아 발열 p.315~320
const feverSepsis: Scenario = {
  id: "fever-sepsis",
  title: "발열·패혈증쇼크",
  status: "ready",
  quickJumps: [{ label: "알레르기·아나필락시스", href: "/scenarios/anaphylaxis" }],
  steps: [
    {
      id: "oxygen",
      severity: "critical",
      title: "산소 투여",
      detail: "패혈증·패혈증성 쇼크 의심 시 비강캐뉼러 1~5L/min 또는 안면마스크 6~10L/min 산소 투여.",
      condition: "패혈증, 패혈증성 쇼크 의심",
      sourceRef: "p.263",
    },
    {
      id: "high-flow-oxygen",
      severity: "critical",
      title: "고농도 산소로 전환",
      detail: "산소 투여 후에도 산소포화도 95% 미만이면 비재호흡마스크로 11~15L/min 투여.",
      sourceRef: "p.263",
    },
    {
      id: "iv-fluid",
      severity: "critical",
      title: "정맥로 확보 후 수액 투여",
      detail: "생리식염수 또는 젖산링거액 300mL(소아 5mL/kg) 투여, 쇼크 지속 시 1L(소아 10mL/kg)까지 추가.",
      sourceRef: "p.263",
      pediatricDetail: "생리식염수 또는 젖산링거액 5mL/kg 투여, 쇼크 지속 시 10mL/kg까지 추가.",
    },
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

export default feverSepsis;
