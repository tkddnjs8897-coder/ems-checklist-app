import Link from "next/link";
import { HeartPulse, Stethoscope, Ambulance, Baby } from "lucide-react";
import { parseAge, withAge } from "@/lib/age";
import { ScenarioSearch } from "@/components/ScenarioSearch";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);
  const ageLabel = age === "pediatric" ? "15세 미만" : "15세 이상";

  return (
    <div className="flex-1 flex flex-col px-4 pt-6 pb-8 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-0.5">
        <h1 className="text-lg font-medium">119 현장 체크리스트</h1>
        <Link
          href="/"
          className="text-xs px-2.5 py-1 rounded-full border border-slate-700 text-slate-400 active:bg-slate-800"
        >
          {ageLabel}
        </Link>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        119구급대원 현장응급처치 표준지침(2023년 개정본) 기반
      </p>

      <ScenarioSearch age={age} />

      <Link
        href={withAge("/scenarios/cardiac-arrest", age)}
        className="flex items-center gap-3 w-full p-5 rounded-2xl bg-red-600 active:bg-red-700 mb-3"
      >
        <HeartPulse size={30} className="text-white shrink-0" />
        <div className="text-left">
          <div className="text-lg font-medium text-white">심정지</div>
          <div className="text-xs text-red-100/90">발견 즉시 · 원인 불문 최우선</div>
        </div>
      </Link>

      <div className={`grid gap-3 ${age === "pediatric" ? "grid-cols-2" : "grid-cols-3"}`}>
        <Link
          href={withAge("/disease", age)}
          className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border border-blue-500 bg-blue-950/50 active:bg-blue-900/50"
        >
          <Stethoscope size={24} className="text-blue-300" />
          <span className="text-[13px] font-medium text-blue-100">질병</span>
        </Link>
        <Link
          href={withAge("/trauma", age)}
          className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border border-amber-500 bg-amber-950/50 active:bg-amber-900/50"
        >
          <Ambulance size={24} className="text-amber-300" />
          <span className="text-[13px] font-medium text-amber-100">질병외</span>
        </Link>
        {age !== "pediatric" && (
          <Link
            href={withAge("/childbirth", age)}
            className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border border-pink-500 bg-pink-950/50 active:bg-pink-900/50"
          >
            <Baby size={24} className="text-pink-300" />
            <span className="text-[13px] font-medium text-pink-100">출산</span>
          </Link>
        )}
      </div>

      <p className="mt-auto pt-8 text-xs leading-relaxed text-slate-500 break-keep">
        개인 참고용 요약 자료이며 업무 지침이 아닙니다. 실제 처치는 소속 기관의 표준지침과 의료지도를 따르세요.
      </p>
    </div>
  );
}
