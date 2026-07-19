"use client";

import { useState } from "react";
import { severityStyles } from "@/lib/severity";

interface Option {
  score: number;
  label: string;
}

const EYE_OPTIONS: Option[] = [
  { score: 4, label: "자발적으로 뜸" },
  { score: 3, label: "불러서(말소리에) 뜸" },
  { score: 2, label: "통증 자극에 뜸" },
  { score: 1, label: "전혀 뜨지 않음" },
];

const VERBAL_OPTIONS: Option[] = [
  { score: 5, label: "지남력 있음(정상 대화)" },
  { score: 4, label: "혼란된 대화" },
  { score: 3, label: "부적절한 단어" },
  { score: 2, label: "이해할 수 없는 소리" },
  { score: 1, label: "무반응" },
];

const MOTOR_OPTIONS: Option[] = [
  { score: 6, label: "명령에 따름" },
  { score: 5, label: "통증에 국소 반응(뿌리침)" },
  { score: 4, label: "통증에 회피 반응" },
  { score: 3, label: "이상굴곡 반응(제피질강직)" },
  { score: 2, label: "이상신전 반응(제뇌강직)" },
  { score: 1, label: "무반응" },
];

function OptionGroup({
  title,
  options,
  value,
  onChange,
  disabled,
}: {
  title: string;
  options: Option[];
  value: number | null;
  onChange: (score: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className={disabled ? "opacity-40 pointer-events-none" : ""}>
      <div className="text-base font-bold text-slate-100 mb-2">{title}</div>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt.score}
            type="button"
            onClick={() => onChange(opt.score)}
            className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-xl border text-left ${
              value === opt.score
                ? "border-blue-500 bg-blue-950/60"
                : "border-slate-700 bg-slate-800/50 active:bg-slate-800"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                value === opt.score ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"
              }`}
            >
              {opt.score}
            </span>
            <span className="text-sm text-slate-100 break-keep">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function GcsCalculator() {
  const [eye, setEye] = useState<number | null>(null);
  const [verbal, setVerbal] = useState<number | null>(null);
  const [motor, setMotor] = useState<number | null>(null);
  const [intubated, setIntubated] = useState(false);

  const verbalScore = intubated ? 1 : verbal;
  const complete = eye !== null && motor !== null && (intubated || verbal !== null);
  const total = complete ? (eye ?? 0) + (verbalScore ?? 0) + (motor ?? 0) : null;

  let bandKey: "critical" | "urgent" | "important" | null = null;
  if (total !== null) {
    if (total <= 8) bandKey = "critical";
    else if (total <= 12) bandKey = "urgent";
    else bandKey = "important";
  }
  const bandLabel =
    total === null ? "" : total <= 8 ? "중증" : total <= 12 ? "중등도" : "경도";

  return (
    <div className="px-4 pb-8 flex flex-col gap-6">
      <div
        className={`rounded-2xl border p-5 text-center ${
          bandKey ? severityStyles[bandKey].card : "border-slate-700 bg-slate-800/50"
        }`}
      >
        <div className="text-xs text-slate-400 mb-1">GCS 총점</div>
        <div className="text-4xl font-semibold text-slate-50 tabular-nums">
          {total === null ? "-" : `${total}${intubated ? "T" : ""}`}
          <span className="text-base font-normal text-slate-400"> / 15</span>
        </div>
        {total !== null && (
          <div className={`text-xs font-medium mt-1 ${severityStyles[bandKey!].text}`}>{bandLabel}</div>
        )}
        {intubated && (
          <div className="text-[11px] text-slate-500 mt-1">
            기관삽관으로 언어반응 평가 불가(T) · 눈뜨기+운동반응 기준
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIntubated((v) => !v)}
        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border text-sm font-medium ${
          intubated
            ? "border-blue-500 bg-blue-950/60 text-blue-200"
            : "border-slate-700 bg-slate-800/50 text-slate-300"
        }`}
      >
        기관삽관 등으로 언어반응 평가 불가
      </button>

      <OptionGroup title="눈뜨기 (E)" options={EYE_OPTIONS} value={eye} onChange={setEye} />
      <OptionGroup
        title="언어반응 (V)"
        options={VERBAL_OPTIONS}
        value={verbal}
        onChange={setVerbal}
        disabled={intubated}
      />
      <OptionGroup title="운동반응 (M)" options={MOTOR_OPTIONS} value={motor} onChange={setMotor} />
    </div>
  );
}
