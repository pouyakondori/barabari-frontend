import { gql } from "@apollo/client";

export const GET_PODCASTS = gql`
  query GetPodcasts($limit: Int) {
    podcasts(limit: $limit) {
      id
      title { fa en }
      description { fa en }
      audioUrl
      coverImage
      country { id name { fa en } }
      topic { id name { fa en } }
      duration
      publishedAt
    }
  }
`;

export const GET_PODCASTS_BY_COUNTRY = gql`
  query GetPodcastsByCountry($countrySlug: String!) {
    podcastsByCountry(countrySlug: $countrySlug) {
      id
      title { fa en }
      description { fa en }
      audioUrl
      coverImage
      duration
      publishedAt
    }
  }
`;
