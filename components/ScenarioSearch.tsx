"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, HelpCircle } from "lucide-react";
import type { AgeGroup } from "@/lib/types";
import { withAge } from "@/lib/age";
import { searchableScenarios } from "@/lib/searchIndex";
import { findDisambiguation } from "@/lib/disambiguation";

export function ScenarioSearch({ age }: { age: AgeGroup }) {
  const [query, setQuery] = useState("");

  const pool = useMemo(
    () => searchableScenarios.filter((s) => age !== "pediatric" || s.group !== "childbirth"),
    [age]
  );

  // 흉통↔가슴통증처럼 말만 다르고 뜻이 같은 표현도 같은 항목으로 찾히게 label과 aliases를 함께 본다.
  const matchText = (s: { label: string; aliases?: string[] }, q: string, mode: "starts" | "includes") =>
    mode === "starts"
      ? s.label.startsWith(q) || (s.aliases?.some((a) => a.startsWith(q)) ?? false)
      : s.label.includes(q) || (s.aliases?.some((a) => a.includes(q)) ?? false);

  // 질병인지 외상인지에 따라 다른 체크리스트로 가야 하는 증상(예: 흉통, 두통)은 검색 목록 대신
  // 원인을 먼저 묻는 질문을 보여준다.
  const disambiguation = useMemo(() => findDisambiguation(query), [query]);

  // 입력한 글자로 "시작하는" 항목을 우선 추천하고, 없을 때만 포함 검색으로 넓힌다.
  const results = useMemo(() => {
    const q = query.trim();
    if (!q || disambiguation) return [];
    const startsWith = pool.filter((s) => matchText(s, q, "starts"));
    if (startsWith.length > 0) return startsWith.slice(0, 8);
    return pool.filter((s) => matchText(s, q, "includes")).slice(0, 8);
  }, [pool, query, disambiguation]);

  return (
    <div className="relative mb-5">
      <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-slate-700 bg-slate-800/60 focus-within:border-slate-500">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="증상·상황 검색 (예: 심정지)"
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="검색어 지우기">
            <X size={16} className="text-slate-500" />
          </button>
        )}
      </div>

      {query && (
        <div className="absolute z-10 mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900 shadow-lg overflow-hidden">
          {disambiguation ? (
            <div className="px-3.5 py-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-100 mb-2.5">
                <HelpCircle size={15} className="text-amber-400 shrink-0" />
                {disambiguation.question}
              </div>
              <div className="flex flex-col gap-2">
                {disambiguation.options.map((opt) => (
                  <Link
                    key={opt.slug}
                    href={withAge(`/scenarios/${opt.slug}`, age)}
                    onClick={() => setQuery("")}
                    className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 active:bg-slate-800"
                  >
                    <div className="text-sm text-slate-100">{opt.label}</div>
                    <div className="text-xs text-slate-500">{opt.hint}</div>
                  </Link>
                ))}
              </div>
              {disambiguation.note && (
                <div className="text-xs text-slate-500 mt-2.5">{disambiguation.note}</div>
              )}
            </div>
          ) : results.length > 0 ? (
            results.map((s) => (
              <Link
                key={s.slug}
                href={withAge(`/scenarios/${s.slug}`, age)}
                onClick={() => setQuery("")}
                className="flex items-center justify-between px-3.5 py-3 text-sm text-slate-100 active:bg-slate-800 border-b border-slate-800 last:border-b-0"
              >
                <span>{s.label}</span>
                {s.status === "planned" && (
                  <span className="text-[10px] leading-none px-1.5 py-1 rounded-full bg-slate-700 text-slate-300">
                    준비중
                  </span>
                )}
              </Link>
            ))
          ) : (
            <div className="px-3.5 py-3 text-sm text-slate-500">검색 결과가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
