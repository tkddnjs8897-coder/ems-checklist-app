"use client";

import { useMemo, useState } from "react";
import type { AgeGroup } from "@/lib/types";

interface Region {
  key: string;
  label: string;
  pct: number;
}

// 성인 Rule of Nines: 머리·목 9, 팔 각 9, 몸통 앞/뒤 각 18, 다리 각 18, 회음부 1 (합 100)
const ADULT_REGIONS: Region[] = [
  { key: "head", label: "머리·목", pct: 9 },
  { key: "armL", label: "왼팔", pct: 9 },
  { key: "armR", label: "오른팔", pct: 9 },
  { key: "trunkFront", label: "몸통 앞면", pct: 18 },
  { key: "trunkBack", label: "몸통 뒷면", pct: 18 },
  { key: "legL", label: "왼다리", pct: 18 },
  { key: "legR", label: "오른다리", pct: 18 },
  { key: "groin", label: "회음부", pct: 1 },
];

// 소아 Rule of Nines: 머리 비중이 크고 다리 비중이 작다 (합 100)
const PEDIATRIC_REGIONS: Region[] = [
  { key: "head", label: "머리·목", pct: 18 },
  { key: "armL", label: "왼팔", pct: 9 },
  { key: "armR", label: "오른팔", pct: 9 },
  { key: "trunkFront", label: "몸통 앞면", pct: 18 },
  { key: "trunkBack", label: "몸통 뒷면", pct: 18 },
  { key: "legL", label: "왼다리", pct: 13.5 },
  { key: "legR", label: "오른다리", pct: 13.5 },
  { key: "groin", label: "회음부", pct: 1 },
];

export function BurnBsaCalculator({ age }: { age: AgeGroup }) {
  const regions = age === "pediatric" ? PEDIATRIC_REGIONS : ADULT_REGIONS;
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const total = useMemo(
    () => regions.filter((r) => selected.has(r.key)).reduce((sum, r) => sum + r.pct, 0),
    [regions, selected]
  );

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="px-4 pb-8 flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-5 text-center">
        <div className="text-xs text-slate-400 mb-1">
          {age === "pediatric" ? "소아" : "성인"} 화상 체표면적
        </div>
        <div className="text-4xl font-semibold text-slate-50 tabular-nums">
          {total}
          <span className="text-base font-normal text-slate-400">%</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 break-keep -mt-3">
        2도 이상 화상 부위만 선택하세요. 발적만 있는 1도 화상은 포함하지 않습니다.
      </p>

      <div className="flex flex-col gap-2">
        {regions.map((r) => {
          const on = selected.has(r.key);
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => toggle(r.key)}
              className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl border ${
                on ? "border-red-600 bg-red-950/50" : "border-slate-700 bg-slate-800/50 active:bg-slate-800"
              }`}
            >
              <span className="text-sm font-medium text-slate-100">{r.label}</span>
              <span className={`text-sm tabular-nums ${on ? "text-red-300" : "text-slate-400"}`}>
                {r.pct}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
