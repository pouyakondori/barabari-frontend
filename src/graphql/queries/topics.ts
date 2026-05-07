import { gql } from "@apollo/client";

export const GET_TOPICS = gql`
  query GetTopics {
    topics {
      id
      slug
      name {
        fa
        en
      }
      category
      description {
        fa
        en
      }
      order
    }
  }
`;

export const GET_TOPIC = gql`
  query GetTopic($slug: String!) {
    topic(slug: $slug) {
      id
      slug
      name {
        fa
        en
      }
      category
      description {
        fa
        en
      }
      order
    }
  }
`;
