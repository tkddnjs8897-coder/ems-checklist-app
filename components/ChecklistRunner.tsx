"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, PartyPopper } from "lucide-react";
import type { AgeGroup, Scenario } from "@/lib/types";
import { severityStyles } from "@/lib/severity";
import { withAge } from "@/lib/age";

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function ChecklistRunner({ scenario, age }: { scenario: Scenario; age: AgeGroup }) {
  const [current, setCurrent] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);

  const steps = useMemo(
    () =>
      scenario.steps.filter((s) =>
        age === "pediatric" ? !s.adultOnly : !s.pediatricOnly
      ),
    [scenario.steps, age]
  );

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const total = steps.length;
  const overTarget = elapsed >= 600;
  const ageLabel = age === "pediatric" ? "소아 (15세 미만)" : "성인 (15세 이상)";

  if (finished) {
    return (
      <div className="px-4 pb-8 flex-1 flex flex-col items-center justify-center text-center gap-3 min-h-[60vh]">
        <PartyPopper size={32} className="text-green-500" />
        <p className="text-base font-medium text-slate-100">전체 항목을 완료했습니다</p>
        <p className="text-xs text-slate-500">현장경과 {formatElapsed(elapsed)}</p>
        <button
          type="button"
          onClick={() => {
            setFinished(false);
            setCurrent(total - 1);
          }}
          className="mt-4 text-sm text-slate-400 underline"
        >
          마지막 항목 다시 보기
        </button>
      </div>
    );
  }

  const step = steps[current];
  const style = severityStyles[step.severity];
  const title = age === "pediatric" ? (step.pediatricTitle ?? step.title) : step.title;
  const detail = age === "pediatric" ? (step.pediatricDetail ?? step.detail) : step.detail;
  const condition =
    age === "pediatric" ? (step.pediatricCondition ?? step.condition) : step.condition;
  const sourceRef =
    age === "pediatric" ? (step.pediatricSourceRef ?? step.sourceRef) : step.sourceRef;

  return (
    <div className="px-4 pb-8">
      <div
        className={`text-[11px] font-medium mb-3 inline-block px-2 py-1 rounded-full ${
          age === "pediatric"
            ? "bg-teal-950/60 text-teal-300 border border-teal-700"
            : "bg-blue-950/60 text-blue-300 border border-blue-700"
        }`}
      >
        {ageLabel}
      </div>

      {scenario.quickJumps && scenario.quickJumps.length > 0 && (
        <div className="flex gap-2 mb-4">
          {scenario.quickJumps.map((q) => (
            <Link
              key={q.href}
              href={withAge(q.href, age)}
              className="flex-1 text-center text-xs font-medium py-2 rounded-lg border border-red-700 bg-red-950/50 text-red-200 active:bg-red-900"
            >
              {q.label}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
        <span>
          {current + 1} / {total}
        </span>
        <span className={overTarget ? "text-red-400 font-medium" : ""}>
          현장경과 {formatElapsed(elapsed)}
        </span>
      </div>
      <div className="h-1 rounded-full bg-slate-800 overflow-hidden mb-4">
        <div
          className="h-full bg-red-500 transition-all"
          style={{ width: `${Math.round((current / total) * 100)}%` }}
        />
      </div>

      <div className={`rounded-2xl border p-5 ${style.card}`}>
        <div className={`text-xs font-medium mb-1.5 ${style.text}`}>
          {style.label} · {sourceRef}
        </div>
        <div className="text-xl font-medium leading-snug mb-2 text-slate-50">{title}</div>
        {condition && (
          <div className={`text-xs mb-2 ${style.text}`}>조건: {condition}</div>
        )}
        {detail && (
          <div className="text-sm leading-relaxed mb-4 text-slate-200">{detail}</div>
        )}
        <button
          type="button"
          onClick={() => {
            if (current < total - 1) setCurrent(current + 1);
            else setFinished(true);
          }}
          className={`w-full py-3.5 rounded-xl text-base font-medium flex items-center justify-center gap-2 ${style.button}`}
        >
          <Check size={18} />
          완료 · 다음 항목
        </button>
      </div>

      {current > 0 && (
        <button
          type="button"
          onClick={() => setCurrent(current - 1)}
          className="mt-4 flex items-center gap-1 text-xs text-slate-500 active:text-slate-300"
        >
          <ChevronLeft size={14} />
          이전 항목
        </button>
      )}
    </div>
  );
}
