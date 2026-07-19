import { BackHeader } from "@/components/BackHeader";
import { CpcSelector } from "@/components/CpcSelector";
import { parseAge } from "@/lib/age";

export default async function CpcToolPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);
  return (
    <div className="flex-1 max-w-md w-full mx-auto flex flex-col">
      <BackHeader title="CPC 등급" href={`/tools?age=${age}`} />
      <CpcSelector />
    </div>
  );
}
