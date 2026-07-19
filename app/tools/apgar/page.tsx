import { BackHeader } from "@/components/BackHeader";
import { ApgarCalculator } from "@/components/ApgarCalculator";
import { parseAge } from "@/lib/age";

export default async function ApgarToolPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);
  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col">
      <BackHeader title="아프가 점수" href={`/tools?age=${age}`} />
      <ApgarCalculator />
    </div>
  );
}
