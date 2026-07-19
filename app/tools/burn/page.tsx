import { BackHeader } from "@/components/BackHeader";
import { BurnBsaCalculator } from "@/components/BurnBsaCalculator";
import { parseAge } from "@/lib/age";

export default async function BurnToolPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);
  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col">
      <BackHeader title="화상 체표면적" href={`/tools?age=${age}`} />
      <BurnBsaCalculator age={age} />
    </div>
  );
}
