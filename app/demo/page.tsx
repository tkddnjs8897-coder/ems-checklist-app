"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BackHeader } from "@/components/BackHeader";
import { severityStyles } from "@/lib/severity";
import type { AgeGroup, Scenario } from "@/lib/types";

import trafficAccident from "@/lib/scenarios/trafficAccident";
import dizziness from "@/lib/scenarios/dizziness";
import alteredMentalStatus from "@/lib/scenarios/alteredMentalStatus";
import dyspnea from "@/lib/scenarios/dyspnea";
import fallFromHeight from "@/lib/scenarios/fallFromHeight";
import seizure from "@/lib/scenarios/seizure";
import chestPain from "@/lib/scenarios/chestPain";
import stroke from "@/lib/scenarios/stroke";
import cardiacArrest from "@/lib/scenarios/cardiacArrest";

import {
  Search,
  ChevronDown,
  ChevronLeft,
  ShieldCheck,
  Settings2,
  Calculator,
  BookOpen,
  FlaskConical,
  AlertTriangle,
  Eye,
} from "lucide-react";

/**
 * 프로토타입 예시 화면 (v3).
 * 장수소방서 담당자가 제시한 "A안 — 한 화면으로 합침" 레퍼런스를 참고해 다시 구성함.
 * - 전체 순서를 나열하지 않고 "놓치기 쉬운 것"을 먼저 보여줌 (원본 스텝 중 condition이 있는
 *   항목을 자동 추출 — 교통사고는 스텝 사이 관계를 반영해 수기로 정리)
 * - 규칙 기반 위험도 체크박스(교통사고 한정)는 예시 기준선이며, 실배포 전 출처 페이지·자문의사
 *   검토가 필요함을 하단에 명시함 (표준지침에 없는 내용을 사실인 것처럼 제시하지 않기 위함)
 * - 검증 배지는 "AI가 재구성한 부분"(놓치기 쉬운 것 요약)에만 붙임. 원문 스텝 목록 자체는
 *   가공되지 않은 출처 원본이라 별도 검증 표시가 필요 없다는 원칙으로 설계함
 * - 실제 AI/서버 연동 없음. 계산기(/tools)·개별 시나리오(/scenarios/[slug]) 링크는 기존 앱
 *   라우트를 그대로 재사용하는 실제 링크임
 */

type Role = "구급대" | "펌뷸런스";
type Qualification = "1급" | "2급";

const QUICK_CHIPS: { label: string; scenario: Scenario }[] = [
  { label: "어지러움", scenario: dizziness },
  { label: "의식저하", scenario: alteredMentalStatus },
  { label: "호흡곤란", scenario: dyspnea },
  { label: "추락외상", scenario: fallFromHeight },
  { label: "교통사고", scenario: trafficAccident },
  { label: "경련", scenario: seizure },
];

const SEARCH_POOL: { scenario: Scenario; keywords: string[] }[] = [
  ...QUICK_CHIPS.map((c) => ({ scenario: c.scenario, keywords: [c.label] })),
  { scenario: chestPain, keywords: ["가슴", "흉통", "흉부"] },
  { scenario: stroke, keywords: ["뇌졸중", "편측", "발음", "마비"] },
  { scenario: cardiacArrest, keywords: ["심정지", "무맥", "쓰러짐"] },
];

const RARE_HIGH_RISK: { label: string; href: string }[] = [
  { label: "응급분만", href: "/scenarios/childbirth" },
  { label: "감전", href: "/scenarios/electrical-injury" },
  { label: "중독(농약 등)", href: "/scenarios/poisoning" },
];

// 교통사고: 여러 소스 시나리오(교통사고·척추손상·머리손상)에 흩어진 "조건부·예외" 항목을
// 한 화면에서 놓치지 않도록 정리. 각 줄은 실제 lib/scenarios 원문에 있는 문구를 그대로 재구성함.
const TRAFFIC_ACCIDENT_NOTES: { text: string; sourceRef: string }[] = [
  { text: "두개골 기저부 골절 의심 시 코인두기도기 금지 — 도수조작만 시행", sourceRef: "p.322~323" },
  { text: "경추고정은 도수조작 → 경추고정기구 → 몸통·머리·팔다리 순서 유지", sourceRef: "p.334" },
  { text: "척추손상 배제에는 영상검사가 필수 — 현장에서 고정을 제거하지 않음", sourceRef: "p.335" },
  { text: "뇌탈출 징후(호흡이상·동공반사이상) 있으면 두부만 30도 거상", sourceRef: "p.331" },
];

function matchScenario(text: string): Scenario | null {
  const hit = SEARCH_POOL.find((c) => c.keywords.some((kw) => text.includes(kw)));
  return hit?.scenario ?? null;
}

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const MOI_ITEMS = [
  "차량 대 차량 충돌",
  "측면 충돌",
  "차 밖으로 튕겨나감",
  "안전벨트 미착용",
  "에어백 전개",
  "실내 계기판 함몰",
  "동승자 사망",
  "사고 직후 의식소실(LOC)",
];

export default function DemoPage() {
  const [phase, setPhase] = useState<"entry" | "running" | "notfound">("entry");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [role, setRole] = useState<Role>("구급대");
  const [qualification, setQualification] = useState<Qualification>("1급");
  const [showSettings, setShowSettings] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const [query, setQuery] = useState("");
  const [matched, setMatched] = useState<Scenario | null>(null);
  const [expandedFull, setExpandedFull] = useState(false);
  const [fieldMode, setFieldMode] = useState(false);
  const [moiChecked, setMoiChecked] = useState<boolean[]>(() => MOI_ITEMS.map(() => false));
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  function open(scenario: Scenario) {
    setMatched(scenario);
    setElapsed(0);
    setExpandedFull(false);
    setMoiChecked(MOI_ITEMS.map(() => false));
    setPhase("running");
  }

  function startSearch(text: string) {
    const found = matchScenario(text);
    if (!found) {
      setPhase("notfound");
      return;
    }
    open(found);
  }

  function reset() {
    setPhase("entry");
    setQuery("");
    setMatched(null);
  }

  const steps = useMemo(() => {
    if (!matched) return [];
    return matched.steps.filter((s) => (ageGroup === "pediatric" ? !s.adultOnly : !s.pediatricOnly));
  }, [matched, ageGroup]);

  const notes = useMemo(() => {
    if (!matched) return [];
    if (matched.id === "traffic-accident") return TRAFFIC_ACCIDENT_NOTES;
    return steps
      .filter((s) => s.condition)
      .slice(0, 5)
      .map((s) => ({ text: `${s.title} — ${s.condition}`, sourceRef: s.sourceRef }));
  }, [matched, steps]);

  const moiCount = moiChecked.filter(Boolean).length;
  const statusLine = `${ageGroup === "pediatric" ? "15세 미만" : "15세 이상"} · ${qualification} · ${role}`;

  // ── 진입 화면 ──────────────────────────────────────────────
  if (phase !== "running") {
    return (
      <div className="flex-1 max-w-md w-full mx-auto flex flex-col pb-6">
        <BackHeader title="AI 질의 · 빠른 진입 (예시)" href="/" />

        <div className="mx-4 mb-4 flex items-start gap-2 rounded-xl border border-violet-500/50 bg-violet-950/40 p-3 text-xs text-violet-200">
          <FlaskConical size={16} className="mt-0.5 shrink-0" />
          <p>정적 예시 화면입니다. 실제 AI 연동은 없으며, 계산기·개별 시나리오 링크는 실제 앱 화면으로 이동합니다.</p>
        </div>

        <div className="px-4 flex flex-col gap-3">
          <div className="flex gap-2">
            {(
              [
                { v: "adult", label: "15세 이상" },
                { v: "pediatric", label: "15세 미만" },
              ] as { v: AgeGroup; label: string }[]
            ).map((o) => (
              <button
                key={o.v}
                onClick={() => setAgeGroup(o.v)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${
                  ageGroup === o.v
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              startSearch(query);
            }}
            className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-slate-700 bg-slate-800/60 focus-within:border-slate-500"
          >
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="지령 문구 · 증상 · 용어 검색"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </form>

          <div>
            <p className="text-[11px] text-slate-500 mb-1.5">출동 유형</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((c) => (
                <button
                  key={c.scenario.id}
                  onClick={() => open(c.scenario)}
                  className="px-3.5 py-2 rounded-full border border-slate-700 bg-slate-800/60 text-sm text-slate-100 active:bg-slate-800"
                >
                  {c.label}
                </button>
              ))}
              <Link
                href={`/menu?age=${ageGroup}`}
                className="px-3.5 py-2 rounded-full border border-slate-700 text-sm text-slate-400 active:bg-slate-800"
              >
                전체 보기
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/50 bg-amber-950/30 p-3">
            <p className="flex items-center gap-1.5 text-sm font-medium text-amber-200 mb-1">
              <AlertTriangle size={15} /> 저빈도 고위험
            </p>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {RARE_HIGH_RISK.map((r) => (
                <Link
                  key={r.href}
                  href={`${r.href}?age=${ageGroup}`}
                  className="px-3 py-1.5 rounded-lg border border-amber-600/60 bg-amber-900/30 text-xs text-amber-100 active:bg-amber-900/60"
                >
                  {r.label}
                </Link>
              ))}
            </div>
            <p className="text-[10px] text-amber-300/70 mt-2">
              자주 만나지 않아 기억이 흐릿해지기 쉬운 상황 — 탭하면 기존 체크리스트 화면으로 이동
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowSource((v) => !v)}
              className="flex items-center gap-2 justify-center py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-sm text-slate-100 active:bg-slate-800"
            >
              <BookOpen size={16} /> 지침 · 법령
            </button>
            <Link
              href="/tools"
              className="flex items-center gap-2 justify-center py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-sm text-slate-100 active:bg-slate-800"
            >
              <Calculator size={16} /> 계산기
            </Link>
          </div>
          {showSource && (
            <p className="text-[11px] text-slate-400 px-1">
              출처: 119구급대원 현장응급처치 표준지침(2023년 개정본, 소방청)
            </p>
          )}

          {phase === "notfound" && (
            <div className="rounded-xl border border-slate-600 bg-slate-800/60 p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100 mb-1">자료에 없음</p>
              <p>등록된 시나리오를 찾지 못했습니다. 근거 없이 임의 처치를 만들지 않고 보완 대상으로 기록합니다.</p>
            </div>
          )}

          <button
            onClick={() => setShowSettings((v) => !v)}
            className="mt-2 flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-400"
          >
            {statusLine}
            <Settings2 size={14} />
          </button>
          {showSettings && (
            <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3 flex flex-col gap-2">
              <div className="flex gap-2">
                {(["1급", "2급"] as Qualification[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQualification(q)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border ${
                      qualification === q
                        ? "bg-slate-600 border-slate-400 text-white"
                        : "border-slate-700 text-slate-400"
                    }`}
                  >
                    {q} 응급구조사
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {(["구급대", "펌뷸런스"] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border ${
                      role === r
                        ? "bg-slate-600 border-slate-400 text-white"
                        : "border-slate-700 text-slate-400"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 정리한 카드 화면 ──────────────────────────────────────────
  const isTrafficAccident = matched?.id === "traffic-accident";

  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col pb-8">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <button
          onClick={reset}
          aria-label="다시 검색"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-700 text-slate-300 active:bg-slate-800 shrink-0"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-base font-medium truncate flex-1">
          {matched?.title} <span className="text-slate-500 font-normal text-sm">{ageGroup === "pediatric" ? "15세 미만" : "15세 이상"}</span>
        </h1>
        <span className="text-xs text-slate-500 shrink-0">{formatElapsed(elapsed)}</span>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {notes.length > 0 && (
          <section className="rounded-xl border border-amber-500/50 bg-amber-950/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className={`flex items-center gap-1.5 font-semibold text-amber-200 ${fieldMode ? "text-base" : "text-sm"}`}>
                <Eye size={14} /> 놓치기 쉬운 것
              </p>
              {!fieldMode && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <ShieldCheck size={11} /> AI 재정리 · 원문 대조
                </span>
              )}
            </div>
            <ul className="flex flex-col gap-2">
              {notes.map((n, i) => (
                <li key={i} className={`text-amber-50 leading-snug ${fieldMode ? "text-base" : "text-sm"}`}>
                  · {n.text}
                  {!fieldMode && <span className="text-[10px] text-amber-300/60 ml-1">({n.sourceRef})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {isTrafficAccident && (
          <section>
            <p className="text-sm font-semibold text-slate-200 mb-2">현장 떠나기 전 확인</p>
            <div className="grid grid-cols-2 gap-2">
              {MOI_ITEMS.map((item, i) => (
                <label
                  key={item}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-xs text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={moiChecked[i]}
                    onChange={() =>
                      setMoiChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                    }
                    className="shrink-0"
                  />
                  {item}
                </label>
              ))}
            </div>
            {moiCount > 0 && (
              <Link
                href="/scenarios/multi-trauma"
                className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium border ${
                  moiCount >= 3
                    ? "bg-red-950/50 border-red-600 text-red-200"
                    : "bg-amber-950/40 border-amber-600 text-amber-200"
                }`}
              >
                <AlertTriangle size={14} className="shrink-0" />
                {moiCount}개 해당 {moiCount >= 3 ? "— 외상 중증도 재평가 권고 (다발성·중증손상 기준 보기)" : ""}
              </Link>
            )}
            <p className="text-[10px] text-slate-500 mt-1.5">
              예시 기준선입니다. 실배포 전 표준지침 페이지·자문의사 검토가 필요합니다.
            </p>
          </section>
        )}

        {!fieldMode && (
          <section>
            <button
              onClick={() => setExpandedFull((v) => !v)}
              className="flex items-center justify-between w-full text-sm font-medium text-slate-300 py-1"
            >
              처치 순서 {steps.length}단계
              <ChevronDown size={16} className={`transition-transform ${expandedFull ? "rotate-180" : ""}`} />
            </button>
            {expandedFull && (
              <div className="flex flex-col gap-2 mt-2">
                {steps.map((s) => {
                  const style = severityStyles[s.severity];
                  const title = ageGroup === "pediatric" ? (s.pediatricTitle ?? s.title) : s.title;
                  const detail = ageGroup === "pediatric" ? (s.pediatricDetail ?? s.detail) : s.detail;
                  return (
                    <div key={s.id} className={`rounded-lg border px-3 py-2.5 ${style.card}`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                        <span className={`text-sm font-medium ${style.text}`}>{title}</span>
                      </div>
                      {detail && <p className="text-xs text-slate-300 leading-relaxed">{detail}</p>}
                      <p className="text-[10px] text-slate-500 mt-1">{s.sourceRef}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        <button
          onClick={() => setFieldMode((v) => !v)}
          className={`w-full py-3 rounded-xl text-sm font-medium border ${
            fieldMode ? "bg-blue-600 border-blue-500 text-white" : "border-slate-700 text-slate-300"
          }`}
        >
          {fieldMode ? "현장 모드 끄기" : "현장 모드 (핵심만 크게)"}
        </button>

        {!fieldMode && (
          <p className="text-[10px] text-slate-500 text-center">
            표준지침 · 확인일 2026-08-11 · {statusLine}
          </p>
        )}
      </div>
    </div>
  );
}
