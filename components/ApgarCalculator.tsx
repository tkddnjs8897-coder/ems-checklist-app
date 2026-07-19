"use client";

import { useState } from "react";

interface Option {
  score: number;
  label: string;
}

interface Category {
  key: string;
  label: string;
  options: Option[];
}

const CATEGORIES: Category[] = [
  {
    key: "appearance",
    label: "외관(피부색)",
    options: [
      { score: 0, label: "전신 청색·창백" },
      { score: 1, label: "몸통 분홍, 사지 청색" },
      { score: 2, label: "전신 분홍" },
    ],
  },
  {
    key: "pulse",
    label: "심박수",
    options: [
      { score: 0, label: "없음" },
      { score: 1, label: "100회 미만" },
      { score: 2, label: "100회 이상" },
    ],
  },
  {
    key: "grimace",
    label: "반사 자극 반응",
    options: [
      { score: 0, label: "무반응" },
      { score: 1, label: "찡그림" },
      { score: 2, label: "울음·기침·재채기" },
    ],
  },
  {
    key: "activity",
    label: "근긴장도",
    options: [
      { score: 0, label: "축 늘어짐" },
      { score: 1, label: "약간 굴곡" },
      { score: 2, label: "활발한 움직임" },
    ],
  },
  {
    key: "respiration",
    label: "호흡",
    options: [
      { score: 0, label: "없음" },
      { score: 1, label: "약함·불규칙" },
      { score: 2, label: "강한 울음" },
    ],
  },
];

const TIME_POINTS = ["1분", "5분", "10분"] as const;
type TimePoint = (typeof TIME_POINTS)[number];
type Scores = Partial<Record<string, number>>;

export function ApgarCalculator() {
  const [activeTime, setActiveTime] = useState<TimePoint>("1분");
  const [recorded, setRecorded] = useState<Record<TimePoint, Scores>>({
    "1분": {},
    "5분": {},
    "10분": {},
  });

  const scores = recorded[activeTime];
  const complete = CATEGORIES.every((c) => scores[c.key] !== undefined);
  const total = complete
    ? CATEGORIES.reduce((sum, c) => sum + (scores[c.key] ?? 0), 0)
    : null;

  function setScore(categoryKey: string, score: number) {
    setRecorded((prev) => ({
      ...prev,
      [activeTime]: { ...prev[activeTime], [categoryKey]: score },
    }));
  }

  function totalFor(time: TimePoint): number | null {
    const s = recorded[time];
    if (!CATEGORIES.every((c) => s[c.key] !== undefined)) return null;
    return CATEGORIES.reduce((sum, c) => sum + (s[c.key] ?? 0), 0);
  }

  return (
    <div className="px-4 pb-8 flex flex-col gap-6">
      <div className="flex gap-2">
        {TIME_POINTS.map((t) => {
          const recordedTotal = totalFor(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTime(t)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl border ${
                activeTime === t
                  ? "border-blue-500 bg-blue-950/60"
                  : "border-slate-700 bg-slate-800/50"
              }`}
            >
              <span className="text-sm font-medium text-slate-100">{t}</span>
              <span className="text-xs text-slate-400 tabular-nums">
                {recordedTotal === null ? "-" : `${recordedTotal}점`}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={`rounded-2xl border p-5 text-center ${
          total !== null && total <= 4
            ? "border-red-600 bg-red-950/50"
            : "border-slate-700 bg-slate-800/50"
        }`}
      >
        <div className="text-xs text-slate-400 mb-1">{activeTime} 아프가 점수</div>
        <div className="text-4xl font-semibold text-slate-50 tabular-nums">
          {total === null ? "-" : total}
          <span className="text-base font-normal text-slate-400"> / 10</span>
        </div>
        {total !== null && total <= 4 && (
          <div className="text-xs font-medium text-red-300 mt-1 break-keep">
            4점 이하 — 즉시 심폐소생술 고려
          </div>
        )}
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat.key}>
          <div className="text-base font-bold text-slate-100 mb-2">{cat.label}</div>
          <div className="flex flex-col gap-2">
            {cat.options.map((opt) => {
              const selected = scores[cat.key] === opt.score;
              return (
                <button
                  key={opt.score}
                  type="button"
                  onClick={() => setScore(cat.key, opt.score)}
                  className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-xl border text-left ${
                    selected
                      ? "border-blue-500 bg-blue-950/60"
                      : "border-slate-700 bg-slate-800/50 active:bg-slate-800"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      selected ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {opt.score}
                  </span>
                  <span className="text-sm text-slate-100 break-keep">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
