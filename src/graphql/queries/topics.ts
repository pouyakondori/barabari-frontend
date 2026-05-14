import { gql } from "@apollo/client";

export const GET_TOPICS = gql`
  query GetTopics {
    topics(limit: 100) {
      items {
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
      total
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
