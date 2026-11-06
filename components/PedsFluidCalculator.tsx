"use client";

import { useMemo, useState } from "react";

const DROP_FACTORS = [10, 15, 20, 60] as const;

export function PedsFluidCalculator() {
  const [weightInput, setWeightInput] = useState("");
  const [volumeInput, setVolumeInput] = useState("");
  const [timeInput, setTimeInput] = useState("20");
  const [dropFactor, setDropFactor] = useState<number>(60);

  const weight = parseFloat(weightInput);
  const suggestedVolume = Number.isFinite(weight) && weight > 0 ? Math.round(weight * 5) : null;

  const volume = volumeInput ? parseFloat(volumeInput) : suggestedVolume;
  const time = parseFloat(timeInput);

  const drip = useMemo(() => {
    if (!volume || volume <= 0 || !time || time <= 0) return null;
    const gttPerMin = (volume * dropFactor) / time;
    const secPerDrop = 60 / gttPerMin;
    return { gttPerMin, secPerDrop };
  }, [volume, time, dropFactor]);

  return (
    <div className="px-4 pb-8 flex flex-col gap-6">
      <div>
        <div className="text-base font-bold text-slate-100 mb-2">체중 (kg)</div>
        <input
          type="text"
          inputMode="decimal"
          placeholder="예: 18"
          value={weightInput}
          onChange={(e) => setWeightInput(e.target.value)}
          className="w-full px-3.5 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-100 text-base outline-none focus:border-blue-500"
        />
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-4 mt-3">
          <div className="text-xs text-slate-400 mb-1">화상·전기손상 기준 (5mL/kg) 생리식염수 초기 투여량</div>
          <div className="text-2xl font-semibold text-slate-50 tabular-nums">
            {suggestedVolume ?? "-"}
            <span className="text-base font-normal text-slate-400"> mL</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 break-keep">
            쇼크 지속 시 최대 200mL까지 · 표준지침 p.323
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6">
        <div className="text-base font-bold text-slate-100 mb-1">방울수 계산 (프로토타입)</div>
        <p className="text-xs text-slate-500 break-keep mb-3">
          수액 펌프 없이 수동으로 떨어뜨릴 때 참고용입니다. 총 투여량은 위 계산값을 기본으로 쓰고, 직접 바꿀 수도 있습니다.
        </p>

        <div className="flex flex-col gap-3">
          <div>
            <div className="text-sm font-medium text-slate-300 mb-1.5">총 투여량 (mL)</div>
            <input
              type="text"
              inputMode="decimal"
              placeholder={suggestedVolume ? `기본값 ${suggestedVolume}` : "예: 100"}
              value={volumeInput}
              onChange={(e) => setVolumeInput(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-100 text-base outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="text-sm font-medium text-slate-300 mb-1.5">투여 시간 (분)</div>
            <input
              type="text"
              inputMode="decimal"
              placeholder="예: 20"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-100 text-base outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="text-sm font-medium text-slate-300 mb-1.5">수액세트 적정계수 (gtt/mL)</div>
            <div className="flex gap-2">
              {DROP_FACTORS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setDropFactor(f)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium tabular-nums ${
                    dropFactor === f
                      ? "border-blue-500 bg-blue-950/60 text-slate-100"
                      : "border-slate-700 bg-slate-800/50 text-slate-300 active:bg-slate-800"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1.5 break-keep">
              60gtt/mL(미세적정)이 소아에서 흔히 쓰입니다 — 실제 사용 중인 세트 규격을 확인하세요.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-700 bg-blue-950/40 p-5 mt-4 text-center">
          <div className="text-xs text-slate-400 mb-1">약 몇 초에 한 방울</div>
          <div className="text-4xl font-semibold text-slate-50 tabular-nums">
            {drip ? drip.secPerDrop.toFixed(1) : "-"}
            <span className="text-base font-normal text-slate-400"> 초/방울</span>
          </div>
          <div className="text-sm text-slate-400 mt-1 tabular-nums">
            {drip ? Math.round(drip.gttPerMin) : "-"} gtt/분
          </div>
        </div>
      </div>
    </div>
  );
}
