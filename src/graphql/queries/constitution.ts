import { gql } from "@apollo/client";

export const GET_CONSTITUTION = gql`
  query GetConstitution($countrySlug: String!) {
    constitution(countrySlug: $countrySlug) {
      id
      countryId
      fullTextUrl
      chapters {
        id
        number
        title {
          fa
          en
        }
        order
        articles {
          id
          number
          title {
            fa
            en
          }
          order
          clauses {
            id
            number
            text {
              fa
              en
            }
            topicSlugs
            agreeCount
            disagreeCount
            order
            countryId
            articleId
          }
        }
      }
    }
  }
`;

export const GET_CLAUSE = gql`
  query GetClause($id: String!) {
    clause(id: $id) {
      id
      number
      text {
        fa
        en
      }
      topicSlugs
      agreeCount
      disagreeCount
      order
      countryId
      articleId
    }
  }
`;
