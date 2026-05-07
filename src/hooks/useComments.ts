"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_COMMENTS } from "@/graphql/queries/comments";
import {
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from "@/graphql/mutations/comments";
import { useAuth } from "./useAuth";
import type { Comment } from "@/lib/types";

export function useComments(clauseId: string) {
  const { user } = useAuth();
  const { data, loading, refetch } = useQuery<{ comments: Comment[] }>(GET_COMMENTS, {
    variables: { clauseId, limit: 50, offset: 0 },
  });

  const [createCommentMutation] = useMutation(CREATE_COMMENT);
  const [updateCommentMutation] = useMutation(UPDATE_COMMENT);
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT);

  const comments = data?.comments || [];

  const createComment = async (content: string, parentId?: string) => {
    await createCommentMutation({
      variables: { input: { clauseId, content, parentId } },
    });
    await refetch();
  };

  const updateComment = async (id: string, content: string) => {
    await updateCommentMutation({ variables: { id, content } });
    await refetch();
  };

  const deleteComment = async (id: string) => {
    await deleteCommentMutation({ variables: { id } });
    await refetch();
  };

  return {
    comments,
    loading,
    createComment,
    updateComment,
    deleteComment,
    isAuthenticated: !!user,
    currentUserId: user?.id,
  };
}
