"use client";

import { useMemo, useState } from "react";

interface Row {
  label: string;
  hr: string;
  rr: string;
  temp: string;
  bp: string | null;
  minMonths: number;
  maxMonths: number | null; // null이면 상한 없음
}

const ROWS: Row[] = [
  { label: "신생아(~1개월)", hr: "100~180", rr: "30~60", temp: "36.5~37.5", bp: null, minMonths: 0, maxMonths: 1 },
  { label: "영아(1~12개월)", hr: "100~160", rr: "30~53", temp: "36.5~37.5", bp: null, minMonths: 1, maxMonths: 12 },
  { label: "유아(1~3세)", hr: "98~140", rr: "22~37", temp: "36.5~37.5", bp: "약 86~106", minMonths: 12, maxMonths: 36 },
  { label: "학령전기(3~5세)", hr: "80~120", rr: "20~28", temp: "36.5~37.5", bp: "약 89~112", minMonths: 36, maxMonths: 72 },
  { label: "학령기(6~11세)", hr: "75~118", rr: "18~25", temp: "36.5~37.5", bp: "약 97~115", minMonths: 72, maxMonths: 144 },
  { label: "청소년(12~15세)", hr: "60~100", rr: "12~20", temp: "36.5~37.5", bp: "약 110~120", minMonths: 144, maxMonths: 180 },
  { label: "성인(15세 이상)", hr: "60~100", rr: "12~20", temp: "36.5~37.5", bp: "약 100~120", minMonths: 180, maxMonths: null },
];

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-400 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-slate-100 tabular-nums break-keep">{value}</div>
    </div>
  );
}

export function VitalsReferenceTable() {
  const [ageInput, setAgeInput] = useState("");
  const [unit, setUnit] = useState<"months" | "years">("years");

  const matchedIndex = useMemo(() => {
    const value = parseFloat(ageInput);
    if (Number.isNaN(value) || value < 0) return -1;
    const months = unit === "years" ? value * 12 : value;
    return ROWS.findIndex(
      (r) => months >= r.minMonths && (r.maxMonths === null || months < r.maxMonths)
    );
  }, [ageInput, unit]);

  return (
    <div className="px-4 pb-8 flex flex-col gap-3">
      <div className="flex gap-2 mb-1">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={ageInput}
          onChange={(e) => setAgeInput(e.target.value)}
          placeholder="나이 입력"
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500"
        />
        <div className="flex rounded-xl border border-slate-700 overflow-hidden shrink-0">
          {(["years", "months"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`px-4 text-sm font-medium ${
                unit === u ? "bg-blue-600 text-white" : "bg-slate-800/60 text-slate-400"
              }`}
            >
              {u === "years" ? "세" : "개월"}
            </button>
          ))}
        </div>
      </div>

      {matchedIndex >= 0 && (
        <button
          type="button"
          onClick={() => setAgeInput("")}
          className="self-start text-xs text-blue-300 underline"
        >
          전체 나이대 다시 보기
        </button>
      )}

      {(matchedIndex >= 0 ? [ROWS[matchedIndex]] : ROWS).map((r) => {
        const matched = matchedIndex >= 0;
        return (
          <div
            key={r.label}
            className={`rounded-2xl border p-4 ${
              matched ? "border-blue-500 bg-blue-950/60" : "border-slate-700 bg-slate-800/50"
            }`}
          >
            <div className="text-base font-bold text-slate-100 mb-3">{r.label}</div>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="맥박" value={`${r.hr} 회/분`} />
              <Metric label="호흡수" value={`${r.rr} 회/분`} />
              <Metric label="체온" value={`${r.temp} ℃`} />
              <Metric label="혈압(수축기)" value={r.bp ? `${r.bp} mmHg` : "측정 어려움"} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
