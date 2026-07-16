import { BackHeader } from "@/components/BackHeader";
import { ChecklistRunner } from "@/components/ChecklistRunner";
import { getScenario } from "@/lib/scenarios";
import { parseAge } from "@/lib/age";
import { Construction } from "lucide-react";

export default async function ScenarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ age?: string }>;
}) {
  const { slug } = await params;
  const age = parseAge((await searchParams).age);
  const scenario = getScenario(slug);

  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col">
      <BackHeader title={scenario.title} href={`/menu?age=${age}`} />
      {scenario.status === "ready" ? (
        <ChecklistRunner scenario={scenario} age={age} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center pb-16">
          <Construction size={32} className="text-slate-600" />
          <p className="text-sm text-slate-400">
            &ldquo;{scenario.title}&rdquo; 체크리스트는 아직 준비 중입니다.
          </p>
        </div>
      )}
    </div>
  );
}
