export interface ToolEntry {
  slug: string;
  label: string;
  description: string;
}

export const tools: ToolEntry[] = [
  { slug: "gcs", label: "GCS 점수", description: "눈뜨기·언어반응·운동반응으로 의식수준 점수 계산" },
  { slug: "apgar", label: "아프가 점수", description: "신생아 상태 평가 (외관·맥박·반사·근긴장·호흡)" },
  { slug: "burn", label: "화상 체표면적", description: "화상 부위를 선택해 체표면적(%) 계산" },
  { slug: "cpc", label: "CPC 등급", description: "신경학적 기능 수준 확인" },
  { slug: "vitals", label: "정상 활력징후", description: "나이대별 맥박·호흡수·체온·혈압 참고표" },
];

export function findTool(slug: string): ToolEntry | undefined {
  return tools.find((t) => t.slug === slug);
}
