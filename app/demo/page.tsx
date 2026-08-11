"use client";

import { useMemo, useState } from "react";
import { BackHeader } from "@/components/BackHeader";
import { severityStyles } from "@/lib/severity";
import type { AgeGroup, ChecklistStep, Scenario } from "@/lib/types";
import chestPain from "@/lib/scenarios/chestPain";
import stroke from "@/lib/scenarios/stroke";
import cardiacArrest from "@/lib/scenarios/cardiacArrest";
import {
  ShieldCheck,
  ShieldAlert,
  FlaskConical,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  Clipboard,
} from "lucide-react";

/**
 * 프로토타입 예시 화면.
 * 전북대 산학협력 제안서([A]신뢰성 검증 [C]현장기능)에서 논의된 개념(AI 질의 매칭 ·
 * 자격별 표시 · Pre-KTAS 추정 · 인계 스크립트)을, 무주 체크리스트 특유의
 * "한 화면 한 항목, 큰 탭 타겟" 진행 방식 위에 얹어서 보여주는 정적 목업입니다.
 * 실제 AI/서버 연동은 없고, 매칭·검증 로직은 예시용 키워드 규칙입니다.
 */

type Role = "구급대" | "펌뷸런스";

const ADVANCED_KEYWORDS = ["니트로글리세린", "정맥로", "에피네프린", "전문기도유지술", "포도당"];
function isAdvancedStep(step: ChecklistStep) {
  return ADVANCED_KEYWORDS.some((kw) => step.title.includes(kw));
}

const CANDIDATES: { scenario: Scenario; keywords: string[] }[] = [
  { scenario: chestPain, keywords: ["가슴", "흉통", "흉부"] },
  { scenario: stroke, keywords: ["마비", "뇌졸중", "편측", "발음", "어지럼"] },
  { scenario: cardiacArrest, keywords: ["심정지", "무맥", "의식없", "쓰러짐"] },
];

function matchScenario(text: string): Scenario | null {
  const hit = CANDIDATES.find((c) => c.keywords.some((kw) => text.includes(kw)));
  return hit?.scenario ?? null;
}

function estimateKtas(gcs: number | null, matched: boolean): string {
  if (gcs !== null && gcs <= 8) return "Pre-KTAS 1 추정";
  if (gcs !== null && gcs <= 12) return "Pre-KTAS 2 추정";
  if (matched) return "Pre-KTAS 2 추정";
  return "Pre-KTAS 3 추정";
}

export default function DemoPage() {
  const [phase, setPhase] = useState<"entry" | "running" | "notfound">("entry");
  const [role, setRole] = useState<Role>("구급대");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [query, setQuery] = useState("");
  const [gcsInput, setGcsInput] = useState("");
  const [showAdvancedInput, setShowAdvancedInput] = useState(false);

  const [matched, setMatched] = useState<Scenario | null>(null);
  const [current, setCurrent] = useState(0);
  const [showHandoff, setShowHandoff] = useState(false);

  const gcs = gcsInput.trim() ? Number(gcsInput) : null;

  const steps = useMemo(() => {
    if (!matched) return [];
    return matched.steps.filter((s) => (ageGroup === "pediatric" ? !s.adultOnly : !s.pediatricOnly));
  }, [matched, ageGroup]);

  function startWith(text: string) {
    const found = matchScenario(text);
    if (!found) {
      setPhase("notfound");
      return;
    }
    setMatched(found);
    setCurrent(0);
    setPhase("running");
  }

  function reset() {
    setPhase("entry");
    setMatched(null);
    setQuery("");
    setShowHandoff(false);
  }

  // ── 진입 화면 ──────────────────────────────────────────────
  if (phase !== "running") {
    return (
      <div className="flex-1 max-w-md w-full mx-auto flex flex-col pb-10">
        <BackHeader title="AI 질의 · 빠른 진입 (예시)" href="/" />

        <div className="mx-4 mb-4 flex items-start gap-2 rounded-xl border border-violet-500/50 bg-violet-950/40 p-3 text-xs text-violet-200">
          <FlaskConical size={16} className="mt-0.5 shrink-0" />
          <p>
            전북대 산학협력 제안서 개념을 보여주는 <b>정적 예시</b>입니다. 실제 AI 연동은 없으며,
            처치 내용은 기존 표준지침 출처 데이터를 그대로 사용합니다.
          </p>
        </div>

        <div className="px-4 flex flex-col gap-4">
          <div className="flex gap-2">
            {(["구급대", "펌뷸런스"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${
                  role === r ? "bg-blue-600 border-blue-500 text-white" : "border-slate-700 text-slate-400"
                }`}
              >
                {r} 모드
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {(
              [
                { v: "adult", label: "성인 (15세 이상)" },
                { v: "pediatric", label: "소아 (15세 미만)" },
              ] as { v: AgeGroup; label: string }[]
            ).map((o) => (
              <button
                key={o.v}
                onClick={() => setAgeGroup(o.v)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border ${
                  ageGroup === o.v
                    ? "bg-teal-600 border-teal-500 text-white"
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
              startWith(query);
            }}
            className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-slate-700 bg-slate-800/60 focus-within:border-slate-500"
          >
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="증상을 말하듯 입력 (예: 65세 남 가슴통증)"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </form>

          <div>
            <p className="text-[11px] text-slate-500 mb-1.5">빠른 진입</p>
            <div className="grid grid-cols-3 gap-2">
              {["흉통", "뇌졸중", "심정지"].map((label) => (
                <button
                  key={label}
                  onClick={() => startWith(label)}
                  className="py-4 rounded-xl border border-slate-700 bg-slate-800/50 text-sm font-medium text-slate-100 active:bg-slate-800"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedInput((v) => !v)}
            className="text-xs text-slate-400 underline text-left"
          >
            {showAdvancedInput ? "상세 입력 닫기" : "+ GCS 입력 (선택, Pre-KTAS 추정용)"}
          </button>
          {showAdvancedInput && (
            <input
              value={gcsInput}
              onChange={(e) => setGcsInput(e.target.value)}
              placeholder="GCS 예: 11"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
          )}

          {phase === "notfound" && (
            <div className="rounded-xl border border-slate-600 bg-slate-800/60 p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100 mb-1">자료에 없음</p>
              <p>
                등록된 시나리오를 찾지 못했습니다. (데모는 흉통·뇌졸중·심정지 키워드만 인식) 근거
                없이 임의 처치를 만들지 않고 &ldquo;보완 대상&rdquo;으로만 표시합니다.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 진행 화면 (무주 체크리스트와 동일한 한 화면 한 항목 방식) ──────
  const total = steps.length;
  const step = steps[Math.min(current, total - 1)];
  const style = severityStyles[step.severity];
  const title = ageGroup === "pediatric" ? (step.pediatricTitle ?? step.title) : step.title;
  const detail = ageGroup === "pediatric" ? (step.pediatricDetail ?? step.detail) : step.detail;
  const condition = ageGroup === "pediatric" ? (step.pediatricCondition ?? step.condition) : step.condition;
  const restrictedForRole = role === "펌뷸런스" && isAdvancedStep(step);
  const flagged = current === total - 1; // 데모용: 마지막 항목만 "확인 필요" 예시로 표시
  const isLast = current === total - 1;

  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col pb-10">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <button
          onClick={reset}
          aria-label="다시 검색"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-700 text-slate-300 active:bg-slate-800 shrink-0"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-base font-medium truncate">{matched?.title}</h1>
      </div>

      <div className="px-4">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-blue-950/60 text-blue-300 border border-blue-700">
            {ageGroup === "pediatric" ? "소아" : "성인"}
          </span>
          <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-600">
            {role}
          </span>
          <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-700">
            {estimateKtas(gcs, true)} (예시)
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>
            {current + 1} / {total}
          </span>
        </div>
        <div className="h-1 rounded-full bg-slate-800 overflow-hidden mb-4">
          <div
            className="h-full bg-red-500 transition-all"
            style={{ width: `${Math.round((current / total) * 100)}%` }}
          />
        </div>

        <div className={`rounded-2xl border p-5 ${style.card}`}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-xs font-medium ${style.text}`}>
              {restrictedForRole ? "참고용 · 의료지도 필요" : style.label}
            </span>
            {flagged ? (
              <span className="flex items-center gap-1 shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <ShieldAlert size={11} /> 확인 필요
              </span>
            ) : (
              <span className="flex items-center gap-1 shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck size={11} /> 자료 일치
              </span>
            )}
          </div>
          <div className="text-xl font-medium leading-snug mb-2 text-slate-50">{title}</div>
          {condition && <div className={`text-xs mb-2 ${style.text}`}>조건: {condition}</div>}
          {detail && <div className="text-sm leading-relaxed mb-3 text-slate-200">{detail}</div>}
          <div className="text-[10px] text-slate-500 mb-4">출처: {step.sourceRef}</div>

          <div className="flex gap-2">
            {current > 0 && (
              <button
                type="button"
                onClick={() => setCurrent((c) => c - 1)}
                aria-label="이전 항목"
                className="w-14 shrink-0 rounded-xl border border-slate-500/60 bg-slate-900/40 text-slate-200 active:bg-slate-800 flex items-center justify-center"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (!isLast) setCurrent((c) => c + 1);
                else setShowHandoff(true);
              }}
              className={`flex-1 py-3.5 rounded-xl text-base font-medium flex items-center justify-center gap-2 ${style.button}`}
            >
              {isLast ? <Clipboard size={18} /> : <Check size={18} />}
              {isLast ? "완료 · 인계 스크립트 보기" : "완료 · 다음 항목"}
              {!isLast && <ChevronRight size={16} />}
            </button>
          </div>
        </div>

        {showHandoff && (
          <div className="mt-4 rounded-xl border border-slate-600 bg-slate-800/60 p-4">
            <p className="text-xs font-medium text-slate-400 mb-1.5">인계 스크립트 (병원 수용 문의용)</p>
            <p className="text-sm text-slate-200 leading-relaxed">
              {ageGroup === "pediatric" ? "소아" : "성인"} 환자, 매칭 프로토콜: [{matched?.title}].
              {gcs !== null ? ` GCS ${gcs}.` : ""} 주요 처치:{" "}
              {steps.slice(0, 3).map((s) => s.title).join(" / ")}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
