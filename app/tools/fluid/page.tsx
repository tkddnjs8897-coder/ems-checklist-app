import { BackHeader } from "@/components/BackHeader";
import { PedsFluidCalculator } from "@/components/PedsFluidCalculator";
import { parseAge } from "@/lib/age";

export default async function FluidToolPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);
  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col">
      <BackHeader title="소아 수액량" href={`/tools?age=${age}`} />
      <PedsFluidCalculator />
    </div>
  );
}
