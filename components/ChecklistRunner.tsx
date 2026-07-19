"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, ChevronLeft, PartyPopper } from "lucide-react";
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

function progressKey(scenarioId: string, age: AgeGroup) {
  return `ems-progress:${scenarioId}:${age}`;
}

// 탭 안에서 딱 한 번, "진짜 새로고침"으로 열린 첫 화면에서만 이어보기를 허용한다.
// 이 값을 모듈 스코프에 두면 클라이언트 라우팅(메뉴 갔다가 다시 들어오기 등)으로는
// 리셋되지 않고, 실제 페이지가 다시 로드될 때만(=새 새로고침) 다시 true가 된다.
let canResumeThisLoad = true;

function isHardReload(): boolean {
  if (typeof performance === "undefined") return false;
  const [entry] = performance.getEntriesByType("navigation");
  return (entry as PerformanceNavigationTiming | undefined)?.type === "reload";
}

export function ChecklistRunner({ scenario, age }: { scenario: Scenario; age: AgeGroup }) {
  const storageKey = progressKey(scenario.id, age);
  const [current, setCurrent] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const steps = useMemo(
    () =>
      scenario.steps.filter((s) =>
        age === "pediatric" ? !s.adultOnly : !s.pediatricOnly
      ),
    [scenario.steps, age]
  );

  // 화면이 실제로 새로고침된 경우에만 진행 중이던 항목·경과시간을 이어본다.
  // 목록으로 나갔다가 같은 시나리오로 다시 들어오는 건(같은 탭 안 이동) 새 처치로 보고 1번부터 시작한다.
  useEffect(() => {
    const shouldResume = canResumeThisLoad && isHardReload();
    canResumeThisLoad = false;
    if (shouldResume) {
      try {
        const raw = sessionStorage.getItem(storageKey);
        if (raw) {
          const saved = JSON.parse(raw) as { current?: number; elapsed?: number };
          if (typeof saved.current === "number") setCurrent(saved.current);
          if (typeof saved.elapsed === "number") setElapsed(saved.elapsed);
        }
      } catch {
        // 세션 저장소를 못 쓰는 환경이면 그냥 처음부터 시작한다.
      }
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ current, elapsed }));
    } catch {
      // no-op
    }
  }, [storageKey, current, elapsed, hydrated]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const total = steps.length;
  useEffect(() => {
    if (hydrated && current > total - 1) setCurrent(Math.max(total - 1, 0));
  }, [hydrated, current, total]);

  const overTarget = elapsed >= 600;
  const ageLabel = age === "pediatric" ? "소아 (15세 미만)" : "성인 (15세 이상)";

  const finish = () => {
    setFinished(true);
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // no-op
    }
  };

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

  const step = steps[Math.min(current, total - 1)];
  const style = severityStyles[step.severity];
  const title = age === "pediatric" ? (step.pediatricTitle ?? step.title) : step.title;
  const detail = age === "pediatric" ? (step.pediatricDetail ?? step.detail) : step.detail;
  const condition =
    age === "pediatric" ? (step.pediatricCondition ?? step.condition) : step.condition;

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
        <div className="mb-4">
          <div className="text-[11px] font-medium text-red-300/90 mb-1.5">
            아래 항목 의심되면 즉시 이동
          </div>
          <div className="flex flex-col gap-2">
            {scenario.quickJumps.map((q) => (
              <Link
                key={q.href}
                href={withAge(q.href, age)}
                className="flex items-center justify-center gap-2 text-center text-base font-semibold py-3.5 rounded-xl border-2 border-red-600 bg-red-950/60 text-red-100 active:bg-red-900"
              >
                <AlertTriangle size={18} className="text-red-300 shrink-0" />
                {q.label}
              </Link>
            ))}
          </div>
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
        <div className={`text-xs font-medium mb-1.5 ${style.text}`}>{style.label}</div>
        <div className="text-xl font-medium leading-snug mb-2 text-slate-50">{title}</div>
        {condition && (
          <div className={`text-xs mb-2 ${style.text}`}>조건: {condition}</div>
        )}
        {detail && (
          <div className="text-sm leading-relaxed mb-4 text-slate-200">{detail}</div>
        )}
        <div className="flex gap-2">
          {current > 0 && (
            <button
              type="button"
              onClick={() => setCurrent(current - 1)}
              aria-label="이전 항목"
              className="w-14 shrink-0 rounded-xl border border-slate-500/60 bg-slate-900/40 text-slate-200 active:bg-slate-800 flex items-center justify-center"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (current < total - 1) setCurrent(current + 1);
              else finish();
            }}
            className={`flex-1 py-3.5 rounded-xl text-base font-medium flex items-center justify-center gap-2 ${style.button}`}
          >
            <Check size={18} />
            완료 · 다음 항목
          </button>
        </div>
      </div>
    </div>
  );
}
