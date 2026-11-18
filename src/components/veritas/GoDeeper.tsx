"use client";

import { useRouter } from "next/navigation";
import { setPendingQuestion } from "@/lib/veritas/ask-handoff";

interface GoDeeperProps {
  question: string;
  className?: string;
  label?: string;
}

export default function GoDeeper({ question, className, label = "Go deeper in Ask Aquinas →" }: GoDeeperProps) {
  const router = useRouter();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setPendingQuestion(question);
        router.push("/veritas/ask");
      }}
      className={
        className ??
        "text-[11px] font-medium text-amber-600 transition-colors hover:text-amber-400"
      }
    >
      {label}
    </button>
  );
}
