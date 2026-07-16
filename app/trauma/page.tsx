import { BackHeader } from "@/components/BackHeader";
import { CategoryGrid } from "@/components/CategoryGrid";
import { traumaTiles } from "@/lib/categories";
import { parseAge } from "@/lib/age";

export default async function TraumaPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);
  return (
    <div className="flex-1 max-w-md w-full mx-auto">
      <BackHeader title="질병외 (외상)" href={`/menu?age=${age}`} />
      <CategoryGrid tiles={traumaTiles} age={age} accent="amber" />
    </div>
  );
}
