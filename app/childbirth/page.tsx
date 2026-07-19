import { redirect } from "next/navigation";
import { BackHeader } from "@/components/BackHeader";
import { CategoryGrid } from "@/components/CategoryGrid";
import { childbirthTiles } from "@/lib/categories";
import { parseAge } from "@/lib/age";

export default async function ChildbirthPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const age = parseAge((await searchParams).age);
  if (age === "pediatric") {
    redirect(`/menu?age=${age}`);
  }
  return (
    <div className="flex-1 max-w-md w-full mx-auto">
      <BackHeader title="출산" href={`/menu?age=${age}`} />
      <CategoryGrid tiles={childbirthTiles} age={age} accent="pink" />
    </div>
  );
}
