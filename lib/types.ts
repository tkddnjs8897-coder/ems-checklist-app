export type Severity = "critical" | "urgent" | "important" | "info";

export type AgeGroup = "adult" | "pediatric";

export interface ChecklistStep {
  id: string;
  severity: Severity;
  title: string;
  detail?: string;
  condition?: string;
  sourceRef: string;
  /** 15세 이상에만 해당하는 항목이면 true (소아에게는 이 항목 자체를 숨김) */
  adultOnly?: boolean;
  /** 15세 미만에만 해당하는 항목이면 true (성인에게는 이 항목 자체를 숨김) */
  pediatricOnly?: boolean;
  /** 소아 기준 내용이 다를 때만 지정 (없으면 detail을 그대로 사용) */
  pediatricTitle?: string;
  pediatricDetail?: string;
  pediatricCondition?: string;
  pediatricSourceRef?: string;
}

export interface QuickJump {
  label: string;
  href: string;
}

export interface Scenario {
  id: string;
  title: string;
  status: "ready" | "planned";
  quickJumps?: QuickJump[];
  steps: ChecklistStep[];
}

export interface CategoryTileData {
  label: string;
  href: string;
  status: "ready" | "planned";
}
