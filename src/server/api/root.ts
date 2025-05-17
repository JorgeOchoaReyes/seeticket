import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { stripeRouter } from "./routers/stripe"; 
import { chatRouter } from "./routers/chat";
import { workspaceRouter } from "./routers/workspace";

export const appRouter = createTRPCRouter({
  user: userRouter,
  stripe: stripeRouter, 
  chat: chatRouter,
  workspace: workspaceRouter
});
 
export type AppRouter = typeof appRouter; 
export const createCaller = createCallerFactory(appRouter);
