import type { Severity } from "./types";

interface SeverityStyle {
  label: string;
  card: string;
  text: string;
  button: string;
  dot: string;
}

export const severityStyles: Record<Severity, SeverityStyle> = {
  critical: {
    label: "즉시 처치",
    card: "bg-red-950/50 border-red-600",
    text: "text-red-200",
    button: "bg-red-600 text-white active:bg-red-700",
    dot: "bg-red-500",
  },
  urgent: {
    label: "긴급",
    card: "bg-amber-950/50 border-amber-500",
    text: "text-amber-200",
    button: "bg-amber-500 text-black active:bg-amber-600",
    dot: "bg-amber-400",
  },
  important: {
    label: "중요",
    card: "bg-blue-950/50 border-blue-500",
    text: "text-blue-200",
    button: "bg-blue-500 text-white active:bg-blue-600",
    dot: "bg-blue-400",
  },
  info: {
    label: "확인",
    card: "bg-neutral-800/60 border-neutral-600",
    text: "text-neutral-200",
    button: "bg-neutral-500 text-white active:bg-neutral-600",
    dot: "bg-neutral-400",
  },
};
