"use client";

import { useState } from "react";
import { BackHeader } from "@/components/BackHeader";
import { severityStyles } from "@/lib/severity";
import type { ChecklistStep, Scenario } from "@/lib/types";
import chestPain from "@/lib/scenarios/chestPain";
import stroke from "@/lib/scenarios/stroke";
import cardiacArrest from "@/lib/scenarios/cardiacArrest";
import { ShieldCheck, ShieldAlert, FlaskConical, Siren } from "lucide-react";

/**
 * 프로토타입 예시 화면.
 * 전북대 산학협력 제안서([A]신뢰성 검증 [C]현장기능)에서 논의된 개념을
 * 실제 AI/서버 연동 없이 정적 목업으로 보여주기 위한 데모입니다.
 * 처치 내용 자체는 기존 lib/scenarios의 표준지침 출처 데이터를 그대로 재사용하고,
 * 검증 배지·Pre-KTAS 추정·인계 스크립트는 예시를 위한 임의 로직입니다.
 */

type Role = "구급대" | "펌뷸런스";
type AVPU = "A" | "V" | "P" | "U";

// 1급 응급구조사 범위 처치로 간주해 데모에서 자격별 표시 예시에 쓰는 키워드
const ADVANCED_KEYWORDS = ["니트로글리세린", "정맥로", "에피네프린", "전문기도유지술", "포도당"];

function isAdvancedStep(step: ChecklistStep) {
  return ADVANCED_KEYWORDS.some((kw) => step.title.includes(kw));
}

// 데모용 매칭: 실제로는 [C]⑪ "AI 질의 연계"가 담당할 부분을 키워드 매칭으로 단순화
const CANDIDATES: { scenario: Scenario; keywords: string[] }[] = [
  { scenario: chestPain, keywords: ["가슴", "흉통", "흉부"] },
  { scenario: stroke, keywords: ["마비", "뇌졸중", "편측", "발음", "어지럼"] },
  { scenario: cardiacArrest, keywords: ["심정지", "무맥", "의식없", "쓰러짐"] },
];

function matchScenario(chiefComplaint: string): Scenario | null {
  const hit = CANDIDATES.find((c) => c.keywords.some((kw) => chiefComplaint.includes(kw)));
  return hit?.scenario ?? null;
}

// 데모용 Pre-KTAS 추정: 실제 Pre-KTAS 알고리즘이 아니라 GCS·주증상 기반 단순 예시 규칙
function estimateKtas(gcs: number | null, matched: boolean): { grade: number; label: string } {
  if (gcs !== null && gcs <= 8) return { grade: 1, label: "소생(1등급) 추정" };
  if (gcs !== null && gcs <= 12) return { grade: 2, label: "긴급(2등급) 추정" };
  if (matched) return { grade: 2, label: "긴급(2등급) 추정" };
  return { grade: 3, label: "응급(3등급) 추정" };
}

export default function DemoPage() {
  const [age, setAge] = useState("65");
  const [sex, setSex] = useState("남");
  const [role, setRole] = useState<Role>("구급대");
  const [chiefComplaint, setChiefComplaint] = useState("가슴통증, 30분 전 발생");
  const [vitals, setVitals] = useState("130/80, HR88, SpO2 96%");
  const [avpu, setAvpu] = useState<AVPU>("A");
  const [gcsInput, setGcsInput] = useState("");
  const [history, setHistory] = useState("없음");
  const [submitted, setSubmitted] = useState(false);

  const gcs = gcsInput.trim() ? Number(gcsInput) : null;
  const matched = submitted ? matchScenario(chiefComplaint) : null;
  const ktas = submitted ? estimateKtas(gcs, matched !== null) : null;

  function handSummary() {
    if (!matched) return "";
    const topSteps = matched.steps.slice(0, 3).map((s) => s.title).join(" / ");
    return `${age}세 ${sex}, 주증상: ${chiefComplaint}. 활력징후 ${vitals}. 의식상태 ${avpu}${
      gcs !== null ? `(GCS ${gcs})` : ""
    }. 과거력: ${history || "없음"}. 매칭 프로토콜: [${matched.title}]. 주요 처치: ${topSteps}.`;
  }

  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col pb-10">
      <BackHeader title="통합 플랫폼 프로토타입 예시" href="/" />

      <div className="mx-4 mb-4 flex items-start gap-2 rounded-xl border border-violet-500/50 bg-violet-950/40 p-3 text-xs text-violet-200">
        <FlaskConical size={16} className="mt-0.5 shrink-0" />
        <p>
          이 화면은 <b>전북대 산학협력 제안서</b>에서 논의된 개념(신뢰성 검증 배지 · 자격별 표시 ·
          Pre-KTAS 추정 · 인계 스크립트)을 보여주기 위한 <b>정적 예시</b>입니다. 실제 AI 서버 연동은
          없으며, 처치 내용은 기존 표준지침 출처 데이터를 그대로 사용합니다.
        </p>
      </div>

      <div className="px-4 flex flex-col gap-3">
        <div className="flex gap-2">
          {(["구급대", "펌뷸런스"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                role === r
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              {r} 모드
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-slate-400">
            나이
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
          </label>
          <label className="text-xs text-slate-400">
            성별
            <input
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
          </label>
        </div>

        <label className="text-xs text-slate-400">
          주증상 · 기전
          <input
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="예: 흉통, 30분 전 발생"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </label>

        <label className="text-xs text-slate-400">
          활력징후 (BP/HR/SpO2 등)
          <input
            value={vitals}
            onChange={(e) => setVitals(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </label>

        <div>
          <span className="text-xs text-slate-400">의식상태 (AVPU)</span>
          <div className="mt-1 grid grid-cols-4 gap-2">
            {(["A", "V", "P", "U"] as AVPU[]).map((v) => (
              <button
                key={v}
                onClick={() => setAvpu(v)}
                className={`py-2 rounded-lg text-xs font-medium border ${
                  avpu === v ? "bg-blue-600 border-blue-500 text-white" : "border-slate-700 text-slate-400"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <label className="text-xs text-slate-400">
          GCS 직접입력 (선택, Pre-KTAS 추정에 사용)
          <input
            value={gcsInput}
            onChange={(e) => setGcsInput(e.target.value)}
            placeholder="예: 11"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </label>

        <label className="text-xs text-slate-400">
          과거력
          <input
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </label>

        <button
          onClick={() => setSubmitted(true)}
          className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium active:opacity-80"
        >
          분석 요청 (예시)
        </button>
      </div>

      {submitted && (
        <div className="px-4 mt-6 flex flex-col gap-5">
          {!matched ? (
            <div className="rounded-xl border border-slate-600 bg-slate-800/60 p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100 mb-1">자료에 없음</p>
              <p>
                입력하신 주증상과 일치하는 등록된 시나리오를 찾지 못했습니다. (데모에서는 흉통 ·
                뇌졸중 · 심정지 키워드만 인식합니다.) 제안서 [C]⑪ 원칙대로, 근거 없이 임의 처치를
                생성하지 않고 &ldquo;보완 대상&rdquo;으로만 표시합니다.
              </p>
            </div>
          ) : (
            <>
              {/* A) 응급처치 */}
              <section>
                <h2 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1">
                  <Siren size={15} /> A) 응급처치 — {matched.title}
                </h2>
                <div className="flex flex-col gap-2">
                  {matched.steps.map((step, idx) => {
                    const advanced = isAdvancedStep(step);
                    const restrictedForRole = role === "펌뷸런스" && advanced;
                    // 데모용 검증 배지: 마지막 항목만 "확인 필요"로 표시해 개념을 예시함
                    const flagged = idx === matched.steps.length - 1;
                    const style = severityStyles[step.severity];
                    return (
                      <div
                        key={step.id}
                        className={`rounded-xl border p-3 ${style.card} ${
                          restrictedForRole ? "opacity-70" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${style.text}`}>{step.title}</p>
                          {flagged ? (
                            <span className="flex items-center gap-1 shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              <ShieldAlert size={11} /> 확인 필요(예시)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <ShieldCheck size={11} /> 자료 일치
                            </span>
                          )}
                        </div>
                        {step.detail && (
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.detail}</p>
                        )}
                        {restrictedForRole && (
                          <p className="text-[11px] text-amber-300 mt-1">
                            ⚠ 참고 항목 — 펌뷸런스 단독 시행 범위 아님. 구급대 도착 후 시행 또는
                            의료지도 필요
                          </p>
                        )}
                        <p className="text-[10px] text-slate-500 mt-1">출처: {step.sourceRef}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* B) Pre-KTAS */}
              <section>
                <h2 className="text-sm font-semibold text-slate-200 mb-2">B) Pre-KTAS (예시 추정)</h2>
                <div className="rounded-xl border border-blue-500/50 bg-blue-950/40 p-3">
                  <p className="text-sm text-blue-200 font-medium">{ktas?.label}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    GCS·주증상 기반 단순 규칙 예시이며, 실제 Pre-KTAS 알고리즘이 아닙니다. 세부 경로는
                    현장 판단으로 확인이 필요합니다.
                  </p>
                </div>
              </section>

              {/* C) 인계 */}
              <section>
                <h2 className="text-sm font-semibold text-slate-200 mb-2">
                  C) 인계 스크립트 (병원 수용 문의용)
                </h2>
                <div className="rounded-xl border border-slate-600 bg-slate-800/60 p-3">
                  <p className="text-sm text-slate-200 leading-relaxed">{handSummary()}</p>
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
