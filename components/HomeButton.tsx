import Link from "next/link";
import { Home } from "lucide-react";

export function HomeButton() {
  return (
    <Link
      href="/"
      aria-label="처음으로"
      className="w-10 h-10 rounded-full border border-slate-600 bg-slate-800/95 text-slate-300 shadow-lg flex items-center justify-center active:scale-95 active:bg-slate-700 transition-colors"
    >
      <Home size={18} />
    </Link>
  );
}
