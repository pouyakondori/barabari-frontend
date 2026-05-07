"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useComments } from "@/hooks/useComments";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import type { Comment } from "@/lib/types";

interface CommentThreadProps {
  clauseId: string;
}

export function CommentThread({ clauseId }: CommentThreadProps) {
  const {
    comments,
    loading,
    createComment,
    deleteComment,
    isAuthenticated,
    currentUserId,
  } = useComments(clauseId);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await createComment(newComment.trim());
      setNewComment("");
    } finally {
      setSubmitting(false);
    }
  };

  const topLevelComments = comments.filter(
    (c: Comment) => !c.parentId && !c.isDeleted
  );

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 font-semibold text-[var(--color-foreground)]">
        <MessageCircle className="h-5 w-5" />
        نظرات ({topLevelComments.length})
      </h3>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر خود را بنویسید..."
            className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            disabled={submitting}
          />
          <Button
            type="submit"
            size="sm"
            disabled={submitting || !newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <p className="text-sm text-[var(--color-muted-foreground)]">
          <Link
            href={ROUTES.LOGIN}
            className="text-[var(--color-primary)] hover:underline"
          >
            وارد شوید
          </Link>{" "}
          تا نظر بدهید.
        </p>
      )}

      {/* Comments list */}
      {loading ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">
          در حال بارگذاری...
        </p>
      ) : topLevelComments.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">
          هنوز نظری ثبت نشده است.
        </p>
      ) : (
        <div className="space-y-3">
          {topLevelComments.map((comment: Comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-foreground)]">
                    {comment.userName}
                  </span>
                  <span className="text-xs text-[var(--color-muted-foreground)]">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {comment.status === "pending" &&
                    comment.userId === currentUserId && (
                      <Badge variant="warning">در انتظار تأیید</Badge>
                    )}
                  {comment.userId === currentUserId && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-xs text-[var(--color-destructive)] hover:underline"
                    >
                      حذف
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-[var(--color-foreground)]">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
