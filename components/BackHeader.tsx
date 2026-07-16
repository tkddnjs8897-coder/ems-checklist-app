import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BackHeader({ title, href = "/" }: { title: string; href?: string }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-4 pb-3">
      <Link
        href={href}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-700 text-slate-300 active:bg-slate-800 shrink-0"
        aria-label="뒤로"
      >
        <ChevronLeft size={20} />
      </Link>
      <h1 className="text-base font-medium truncate">{title}</h1>
    </div>
  );
}
