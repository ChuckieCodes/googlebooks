const typeDefs = `
  type User {
    _id: ID
    username: String
    password: String
    email: String
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    bookId: ID!
    title: String!
    description: String
    authors: [String]
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me(username: String!): User
    books: [Book]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(userId: ID!, bookId: ID!, title: String!, description: String, authors: [String], image: String, link: String): User
    removeBook(userId: ID!, bookId: ID!): User
  }
`;

module.exports = typeDefs;
