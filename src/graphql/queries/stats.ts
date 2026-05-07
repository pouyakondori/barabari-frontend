import { gql } from "@apollo/client";

export const GET_PLATFORM_STATS = gql`
  query GetPlatformStats {
    platformStats {
      totalCountries
      totalClauses
      totalVotes
      totalComments
    }
  }
`;
