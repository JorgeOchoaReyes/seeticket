import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { TicketGroup, Workspace } from "~/types";

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

export const ticketGroupRefSchema = ticketGroupSchema.pick({
  id: true,
  name: true,
  description: true
});

export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  ownerId: z.string(),
  ownerName: z.string(),
  ticketGroups: z.array(ticketGroupSchema).optional(),
  ticketGroupsRef: z.array(ticketGroupRefSchema).optional()
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

      const ticketGroups = workspace.ticketGroupsRef ?? []; 

      await db.collection("users").doc(user?.uid).collection("workspaces").doc(workspace.id).set({
        ...workspace,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ownerId: user?.uid,
        ownerName: user?.displayName,
      });
      
      await Promise.all(
        ticketGroups.map(async (ticketGroup) => {
          await db.collection("users").doc(user?.uid).collection("workspaces").doc(workspace.id).collection("ticketGroups").doc(ticketGroup.id).set({
            ...ticketGroup,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        })
      );

      return workspace;
 
    }),
  getWorkspaces: protectedProcedure
    .query(async ({ ctx }) => {
      const db = ctx.db;
      const user = ctx.session.user;

      if (!user) {
        throw new Error("User not found");
      }

      const workspaces = await db
        .collection("users")
        .doc(user?.uid)
        .collection("workspaces")
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();

      return workspaces.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as z.infer<typeof workspaceSchema>[];
    }),
  getMoreWorkspaces: protectedProcedure
    .input(z.object({ limit: z.number(), offset: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db;
      const user = ctx.session.user;

      if (!user) {
        throw new Error("User not found");
      }

      const workspaces = await db
        .collection("users")
        .doc(user?.uid)
        .collection("workspaces")
        .limit(input.limit)
        .offset(input.offset)
        .get();

      return workspaces.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as z.infer<typeof workspaceSchema>[];
    }),
  findWorkspaceById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db;
      const user = ctx.session.user;

      if (!user) {
        throw new Error("User not found");
      }

      const workspaceFetch = await db
        .collection("users")
        .doc(user?.uid)
        .collection("workspaces")
        .doc(input.id)
        .get();
      const ticketGroupsFetch = await db
        .collection("users")
        .doc(user?.uid)
        .collection("workspaces")
        .doc(input.id)
        .collection("ticketGroups")
        .get();
      
      
      const workspace = workspaceFetch.data() as Workspace; 
      const ticketGroups = ticketGroupsFetch.docs.map((doc) => {
        return doc.data() as TicketGroup;
      }); 

      return {
        ...workspace,
        ticketGroups: ticketGroups,
      } as Workspace;
      
    }),
});
