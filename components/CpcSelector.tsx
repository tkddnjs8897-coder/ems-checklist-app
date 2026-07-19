"use client";

import { useState } from "react";

interface CpcLevel {
  level: number;
  label: string;
  detail: string;
  tone: "critical" | "urgent" | "important";
}

const CPC_LEVELS: CpcLevel[] = [
  {
    level: 1,
    label: "CPC 1 — 정상 또는 경도 장애",
    detail: "정상 생활 가능. 경미한 장애가 있어도 무방.",
    tone: "important",
  },
  {
    level: 2,
    label: "CPC 2 — 중등도 장애",
    detail: "장애는 있지만 혼자 일상생활 가능.",
    tone: "important",
  },
  {
    level: 3,
    label: "CPC 3 — 중증 장애",
    detail: "의식은 있으나 일상생활에 타인 도움 필요.",
    tone: "urgent",
  },
  {
    level: 4,
    label: "CPC 4 — 혼수·식물인간 상태",
    detail: "무의식 상태, 주변을 인지하지 못함.",
    tone: "critical",
  },
  {
    level: 5,
    label: "CPC 5 — 사망",
    detail: "뇌사 또는 사망 확인.",
    tone: "critical",
  },
];

const TONE_STYLE: Record<CpcLevel["tone"], { card: string; text: string }> = {
  important: { card: "border-blue-500 bg-blue-950/60", text: "text-blue-200" },
  urgent: { card: "border-amber-500 bg-amber-950/60", text: "text-amber-200" },
  critical: { card: "border-red-600 bg-red-950/60", text: "text-red-200" },
};

export function CpcSelector() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="px-4 pb-8 flex flex-col gap-3">
      <p className="text-xs text-slate-500 break-keep mb-1">
        환자의 전반적인 신경학적·기능적 수준을 참고하는 5단계 척도입니다. 해당하는 단계를 눌러 확인하세요.
      </p>
      {CPC_LEVELS.map((cpc) => {
        const isSelected = selected === cpc.level;
        const style = TONE_STYLE[cpc.tone];
        return (
          <button
            key={cpc.level}
            type="button"
            onClick={() => setSelected(cpc.level)}
            className={`w-full text-left p-4 rounded-2xl border ${
              isSelected ? style.card : "border-slate-700 bg-slate-800/50 active:bg-slate-800"
            }`}
          >
            <div className={`text-sm font-semibold ${isSelected ? style.text : "text-slate-100"}`}>
              {cpc.label}
            </div>
            {isSelected && (
              <div className="text-sm leading-relaxed text-slate-200 mt-2 break-keep">
                {cpc.detail}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
