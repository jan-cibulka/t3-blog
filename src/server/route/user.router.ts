import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { serialize } from "cookie";

import {
  createUserOutputSchema,
  createUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from "../../schema/user.schema";
import { decode, encode } from "../../utils/base64";
import { url } from "../../utils/constants";
import { signJwt } from "../../utils/jwt";
import { sendLoginEmail } from "../../utils/mailer";
import { createRouter } from "../createRouter";

export const userRouter = createRouter()
  .mutation("register-user", {
    input: createUserSchema,
    async resolve({ ctx, input }) {
      const { name, email } = input;
      try {
        const user = await ctx.prisma.user.create({ data: { email, name } });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    },
  })
  .mutation("request-otp", {
    input: requestOtpSchema,
    async resolve({ ctx, input }) {
      const { email, redirect } = input;
      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const otp = await ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: { connect: { id: user.id } },
        },
      });

      //send email to user
      await sendLoginEmail(email, url, encode(`${otp.id}:${user.email}`));
      return true;
    },
  })
  .query("verify-otp", {
    input: verifyOtpSchema,
    async resolve({ ctx, input }) {
      const { hash } = input;
      const [id, email] = decode(hash).split(":");
      const token = await ctx.prisma.loginToken.findFirst({
        where: { id, user: { email } },
        include: { user: true },
      });

      if (!token) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Invalid OTP",
        });
      }

      const jwt = signJwt({
        email: token.user.email,
        id: token.user.id,
      });

      ctx.res.setHeader(
        "Set-Cookie",
        serialize("jwt", jwt, {
          path: "/",
        })
      );
      return { redirect: token.redirect };
    },
  })
  .query("me", {
    resolve: ({ ctx }) => {
      return ctx.user;
    },
  });
