import { BackHeader } from "@/components/BackHeader";
import { VitalsReferenceTable } from "@/components/VitalsReferenceTable";
import { parseAge } from "@/lib/age";

export default async function VitalsToolPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);
  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col">
      <BackHeader title="정상 활력징후" href={`/tools?age=${age}`} />
      <VitalsReferenceTable />
    </div>
  );
}
