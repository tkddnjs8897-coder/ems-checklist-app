import { BackHeader } from "@/components/BackHeader";
import { CategoryGrid } from "@/components/CategoryGrid";
import { diseaseTiles } from "@/lib/categories";
import { parseAge } from "@/lib/age";

export default async function DiseasePage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);
  return (
    <div className="flex-1 max-w-md w-full mx-auto">
      <BackHeader title="질병" href={`/menu?age=${age}`} />
      <CategoryGrid tiles={diseaseTiles} age={age} />
    </div>
  );
}
