import Link from "next/link";
import { Activity, Baby, Brain, Flame, Gauge } from "lucide-react";
import { BackHeader } from "@/components/BackHeader";
import { parseAge } from "@/lib/age";
import { tools } from "@/lib/tools";

const TOOL_ICONS: Record<string, typeof Brain> = {
  gcs: Brain,
  apgar: Baby,
  burn: Flame,
  cpc: Activity,
  vitals: Gauge,
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);

  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col">
      <BackHeader title="계산기" href={`/menu?age=${age}`} />
      <div className="px-4 pb-6 flex flex-col gap-3">
        {tools.map((tool) => {
          const Icon = TOOL_ICONS[tool.slug];
          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}?age=${age}`}
              className="flex items-center gap-4 p-4 rounded-2xl border border-slate-700 bg-slate-800/60 active:bg-slate-800"
            >
              <div className="w-11 h-11 rounded-full bg-slate-700/60 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-slate-200" />
              </div>
              <div className="text-left">
                <div className="text-base font-medium text-slate-100">{tool.label}</div>
                <div className="text-xs text-slate-400 break-keep">{tool.description}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
