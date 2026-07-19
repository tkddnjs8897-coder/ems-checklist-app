import { BackHeader } from "@/components/BackHeader";
import { GcsCalculator } from "@/components/GcsCalculator";
import { parseAge } from "@/lib/age";

export default async function GcsToolPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);
  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col">
      <BackHeader title="GCS 점수" href={`/tools?age=${age}`} />
      <GcsCalculator />
    </div>
  );
}
