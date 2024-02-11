import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        email
        password
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation ($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        username
        email
        password
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation (
    $userId: ID!
    $bookId: ID!
    $title: String!
    $description: String!
    $authors: [String]!
    $image: String!
    $link: String!
  ) {
    saveBook(
      userId: $userId
      bookId: $bookId
      title: $title
      description: $description
      authors: $authors
      image: $image
      link: $link
    ) {
      _id
      savedBooks {
        bookId
        title
        description
        authors
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation ($userId: ID!, $bookId: ID!) {
    removeBook(userId: $userId, bookId: $bookId) {
      _id
    }
  }
`;
