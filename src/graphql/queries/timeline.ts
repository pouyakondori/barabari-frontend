import { gql } from "@apollo/client";

export const GET_COUNTRY_TIMELINE = gql`
  query GetCountryTimeline($countrySlug: String!) {
    countryTimeline(countrySlug: $countrySlug) {
      id
      countryId
      date
      title {
        fa
        en
      }
      description {
        fa
        en
      }
      order
    }
  }
`;
