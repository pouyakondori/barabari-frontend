"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useVote } from "@/hooks/useVote";
import { useTranslation } from "@/locale";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

interface VoteButtonsProps {
  clauseId: string;
  agreeCount: number;
  disagreeCount: number;
}

export function VoteButtons({
  clauseId,
  agreeCount,
  disagreeCount,
}: VoteButtonsProps) {
  const { myVote, vote, removeVote, isAuthenticated } = useVote(clauseId);
  const { t, locale } = useTranslation();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
          <ThumbsUp className="h-4 w-4" />
          <span className="text-sm">{formatNumber(agreeCount, locale)}</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
          <ThumbsDown className="h-4 w-4" />
          <span className="text-sm">{formatNumber(disagreeCount, locale)}</span>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="text-xs text-[var(--color-primary)] hover:underline"
        >
          {t("clause.login_to_vote")}
        </Link>
      </div>
    );
  }

  const handleVote = async (type: "agree" | "disagree") => {
    if (myVote?.type === type) {
      await removeVote();
    } else {
      await vote(type);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleVote("agree")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
          myVote?.type === "agree"
            ? "bg-green-100 text-green-700 font-medium"
            : "text-[var(--color-muted-foreground)] hover:bg-green-50 hover:text-green-600"
        )}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{formatNumber(agreeCount, locale)}</span>
      </button>
      <button
        onClick={() => handleVote("disagree")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
          myVote?.type === "disagree"
            ? "bg-red-100 text-red-700 font-medium"
            : "text-[var(--color-muted-foreground)] hover:bg-red-50 hover:text-red-600"
        )}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{formatNumber(disagreeCount, locale)}</span>
      </button>
    </div>
  );
}
