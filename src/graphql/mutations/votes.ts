import { gql } from "@apollo/client";

export const CAST_VOTE = gql`
  mutation CastVote($input: VoteInput!) {
    castVote(input: $input) {
      id
      clauseId
      userId
      type
      createdAt
    }
  }
`;

export const REMOVE_VOTE = gql`
  mutation RemoveVote($clauseId: String!) {
    removeVote(clauseId: $clauseId)
  }
`;

export const GET_MY_VOTES = gql`
  query GetMyVotes($clauseIds: [String!]!) {
    myVotes(clauseIds: $clauseIds) {
      id
      clauseId
      userId
      type
    }
  }
`;
