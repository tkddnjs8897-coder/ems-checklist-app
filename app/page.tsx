import Link from "next/link";
import { User, Baby, ChevronRight } from "lucide-react";

export default function AgeGatePage() {
  return (
    <div className="flex-1 flex flex-col px-4 pt-10 pb-8 max-w-md w-full mx-auto">
      <h1 className="text-lg font-medium mb-1 text-center">119 현장 체크리스트</h1>
      <p className="text-xs text-slate-400 mb-8 text-center">
        환자 나이에 따라 처치 기준이 달라집니다. 먼저 나이대를 선택하세요.
      </p>

      <div className="flex flex-col gap-4">
        <Link
          href="/menu?age=adult"
          className="flex items-center gap-4 w-full p-6 rounded-2xl border border-blue-500 bg-blue-950/50 active:bg-blue-900/50"
        >
          <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
            <User size={28} className="text-blue-300" />
          </div>
          <div className="text-left flex-1">
            <div className="text-xl font-medium text-blue-100">15세 이상</div>
            <div className="text-xs text-blue-200/80">성인 기준 처치</div>
          </div>
          <ChevronRight size={22} className="text-blue-300/80 shrink-0" />
        </Link>
        <Link
          href="/menu?age=pediatric"
          className="flex items-center gap-4 w-full p-6 rounded-2xl border border-teal-500 bg-teal-950/50 active:bg-teal-900/50"
        >
          <div className="w-14 h-14 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
            <Baby size={28} className="text-teal-300" />
          </div>
          <div className="text-left flex-1">
            <div className="text-xl font-medium text-teal-100">15세 미만</div>
            <div className="text-xs text-teal-200/80">소아 기준 처치</div>
          </div>
          <ChevronRight size={22} className="text-teal-300/80 shrink-0" />
        </Link>
      </div>

      <div className="mt-auto pt-10">
        <p className="text-sm leading-relaxed text-slate-300 text-center">
          이 체크리스트는 <span className="font-medium text-slate-100">개인이 참고하는 요약 자료</span>입니다.
          <br />
          업무 지침이나 평가 기준이 아니며, 사용 여부는 전적으로 개인의 판단에 맡깁니다.
          <br />
          실제 현장 처치는 소속 기관의 표준지침과 의료지도를 따르세요.
        </p>
      </div>
    </div>
  );
}
