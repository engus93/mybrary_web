import { prisma } from "./../../../../generated/prisma-client";

export default {
  Mutation: {
    writePost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { title, contents, secret, file = "" } = args;
      const { user } = request;
      try {
        const post = await prisma.createPost({
          user: { connect: { id: user.id } },
          title,
          contents,
          secret
        });
        if (file !== "") {
          await prisma.createFile({
            url: file,
            post: {
              connect: {
                id: post.id
              }
            }
          });
        }
        return prisma.post({ id: post.id });
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }
};
