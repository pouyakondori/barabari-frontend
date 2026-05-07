import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetComments($clauseId: String!, $limit: Int, $offset: Int) {
    comments(clauseId: $clauseId, limit: $limit, offset: $offset) {
      id
      clauseId
      userId
      userName
      content
      parentId
      status
      isDeleted
      createdAt
      updatedAt
    }
  }
`;
