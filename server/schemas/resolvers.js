const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      } else if (args.username) {
        return User.findOne({ username: args.username });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      const userId = context.user ? context.user._id : args.userId;
      const { bookId, title, description, authors, image, link } = args;

      return User.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: {
            savedBooks: {
              bookId: bookId,
              title: title,
              description: description,
              authors: authors,
              image: image,
              link: link,
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    },
    removeBook: async (parent, args, context) => {
      const userId = context.user ? context.user._id : args.userId;
      const { bookId } = args;

      return await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
