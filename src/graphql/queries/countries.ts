import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query GetCountries($limit: Int, $offset: Int) {
    countries(limit: $limit, offset: $offset) {
      id
      slug
      name {
        fa
        en
      }
      flag
      population
      countryCode
      abstract {
        fa
        en
      }
      coordinates {
        lat
        lng
      }
    }
  }
`;

export const GET_COUNTRY = gql`
  query GetCountry($slug: String!) {
    country(slug: $slug) {
      id
      slug
      name {
        fa
        en
      }
      flag
      population
      coordinates {
        lat
        lng
      }
      abstract {
        fa
        en
      }
      authors {
        name
        bio
        imageUrl
      }
      amendments {
        year
        description {
          fa
          en
        }
      }
      podcastUrl
      videoUrl
      countryCode
    }
  }
`;

export const GET_FEATURED_COUNTRIES = gql`
  query GetFeaturedCountries {
    featuredCountries {
      id
      slug
      name {
        fa
        en
      }
      flag
      population
      countryCode
      abstract {
        fa
        en
      }
    }
  }
`;

export const SEARCH_COUNTRIES = gql`
  query SearchCountries($query: String!) {
    searchCountries(query: $query) {
      id
      slug
      name {
        fa
        en
      }
      flag
      countryCode
    }
  }
`;
