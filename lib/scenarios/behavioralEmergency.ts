import type { Scenario } from "../types";

// 출처: 119구급대원 현장응급처치 표준지침(2023년 개정본)
const behavioralEmergency: Scenario = {
  id: "behavioral-emergency",
  title: "행동이상·자살",
  status: "ready",
  quickJumps: [{ label: "저혈당 의증", href: "/scenarios/hypoglycemia" }],
  steps: [
    {
      id: "keep-distance",
      severity: "critical",
      title: "안전거리 유지 · 경찰 협조 요청",
      detail: "위험한 현장, 흉기 등 위험물 소지, 난폭행동이 있으면 경찰에 통보하고 협조를 요청한 뒤에만 접근한다.",
      sourceRef: "p.270",
    },
    {
      id: "iv-glucose",
      severity: "critical",
      title: "정맥로 확보 후 포도당 투여",
      detail: "의식이 없거나 경구 섭취가 불가능하면 50% 포도당 50mL 정주 후 5~10% 포도당 용액을 지속 주입한다.",
      condition: "의식 없음 또는 경구 섭취 불가",
      sourceRef: "p.270",
    },
    {
      id: "verbal-deescalation",
      severity: "urgent",
      title: "구두로 환자 안정화",
      detail: "현장 안전이 확보되면 일차적으로 구두로 진정시켜 응급처치에 협력하도록 유도한다.",
      sourceRef: "p.270",
    },
    {
      id: "vitals-glucose",
      severity: "urgent",
      title: "생체징후 · 혈당 측정",
      detail: "환자가 안정화되면 생체징후를 측정하고 휴대용 혈당계로 말초혈당을 확인한다.",
      sourceRef: "p.270",
    },
    {
      id: "injury-poisoning-assess",
      severity: "urgent",
      title: "동반 손상 처치 · 중독물질 확보",
      detail: "손상은 응급처치하고, 중독은 복용 물질의 종류·양·시간을 확인한다. 종류를 모르면 물질을 응급실로 가져가 전달한다.",
      sourceRef: "p.270",
    },
    {
      id: "escort-transport",
      severity: "urgent",
      title: "경찰 동승 하 이송",
      detail: "이송 거부, 위험물 소지, 난폭행동 등의 경우 경찰(2인 이상)과 구급대원(2인 이상)이 함께 안전하게 이송한다.",
      condition: "이송 거부 또는 자·타해 위험이 있는 경우",
      sourceRef: "p.271, p.277",
    },
    {
      id: "crisis-service-link",
      severity: "important",
      title: "정신건강 위기개입 서비스 연계",
      detail: "구급대 출동과 동시에 관할 정신건강복지센터(위기상담 1577-0199)에 협조를 요청한다.",
      sourceRef: "p.277",
    },
    {
      id: "refusal-medical-direction",
      severity: "important",
      title: "이송 거부 시 의료지도",
      detail: "안정화·위기개입 등 모든 수단을 동원해도 이송이 불가능하면 직접의료지도 하에 이송 거부를 결정하고 이송거부확인서에 기록한다.",
      condition: "이송이 불가능한 경우",
      sourceRef: "p.278",
    },
  ],
};

export default behavioralEmergency;
