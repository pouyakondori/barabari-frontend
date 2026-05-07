"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  CAST_VOTE,
  REMOVE_VOTE,
  GET_MY_VOTES,
} from "@/graphql/mutations/votes";
import { useAuth } from "./useAuth";
import type { Vote } from "@/lib/types";

export function useVote(clauseId: string) {
  const { user } = useAuth();

  const { data: votesData } = useQuery<{ myVotes: Vote[] }>(GET_MY_VOTES, {
    variables: { clauseIds: [clauseId] },
    skip: !user,
  });

  const myVote: Vote | undefined = votesData?.myVotes?.[0];

  const [castVoteMutation] = useMutation(CAST_VOTE);
  const [removeVoteMutation] = useMutation(REMOVE_VOTE);

  const vote = async (type: "agree" | "disagree") => {
    if (!user) return;
    await castVoteMutation({
      variables: { input: { clauseId, type } },
      refetchQueries: ["GetMyVotes"],
    });
  };

  const removeVote = async () => {
    if (!user) return;
    await removeVoteMutation({
      variables: { clauseId },
      refetchQueries: ["GetMyVotes"],
    });
  };

  return { myVote, vote, removeVote, isAuthenticated: !!user };
}
