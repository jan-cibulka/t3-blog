import { createRouter } from "../createRouter";

export const userRouter = createRouter().mutation("registerUser", {
  async resolve({ ctx }) {
    ctx.prisma;
  },
});
