import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const ticketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  duetime: z.number(),
  completedAt: z.number().nullable(),
  priority: z.union([z.literal("low"), z.literal("medium"), z.literal("high")]),
  weeklySchedule: z.array(z.string())
});

export const ticketGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  tickets: z.array(ticketSchema)
});

export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  ownerId: z.string(),
  ticketGroups: z.array(ticketGroupSchema).optional()
});

export const workspaceRouter = createTRPCRouter({
  createWorkspace: protectedProcedure
    .input(z.object({ workspace: workspaceSchema }))
    .mutation( async ({ input, ctx}) => {  
      const { workspace } = input;
      
      const db = ctx.db; 
      const user = ctx.session.user; 

      if(!user) {
        throw new Error("User not found");
      }

      await db.collection("users").doc(user?.uid).collection("workspaces").doc(workspace.id).set({
        ...workspace,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ownerId: user?.uid,
      });

      return workspace;
 
    }),
});
