import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import type { Ticket, TicketGroup, TicketRef, Workspace } from "~/types"; 
import { firestore } from "firebase-admin"; 

export const ticketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  duetime: z.string().optional(),
  dueDate: z.number().optional().nullable(),
  weeklySchedule: z.array(z.string()).optional(),
  repeatingTask: z.boolean(),
  completedAt: z.number().nullable(),
  priority: z.union([z.literal("low"), z.literal("medium"), z.literal("high")])
});

export const ticketRefSchema = ticketSchema.pick({
  id: true,
  title: true,
  description: true
});

export const ticketGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  tickets: z.array(ticketSchema).optional(),
  ticketsRef: z.array(ticketRefSchema).optional()
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

      await db.collection("workspaces").doc(workspace.id).set({
        ...workspace,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ownerId: user?.uid,
        ownerName: user?.displayName,
      });
      
      await Promise.all(
        ticketGroups.map(async (ticketGroup) => {
          await db.collection("workspaces").doc(workspace.id).collection("ticketGroups").doc(ticketGroup.id).set({
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
        .collection("workspaces")
        .where("ownerId", "==", user?.uid)
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
        .collection("workspaces")
        .where("ownerId", "==", user?.uid)
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
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      const user = ctx.session.user;

      if (!user) {
        throw new Error("User not found");
      }

      const workspaceFetch = await db 
        .collection("workspaces")
        .doc(input.id)
        .get();

      if (!workspaceFetch.exists) {
        throw new Error("Workspace not found");
      }

      const ticketGroupsFetch = await db 
        .collection("workspaces")
        .doc(input.id)
        .collection("ticketGroups")
        .get();

      const workspace = workspaceFetch.data() as Workspace; 
      
      if(workspace?.ownerId !== user?.uid) {
        throw new Error("You are not the owner of this workspace");
      }
      
      const ticketGroups = ticketGroupsFetch.docs.map((doc) => {
        return doc.data() as TicketGroup;
      }); 

      return {
        ...workspace,
        ticketGroups: ticketGroups,
      } as Workspace;
      
    }),
  addTicketGroup: protectedProcedure
    .input(z.object({ workspaceId: z.string(), ticketGroupRef: z.array(ticketGroupRefSchema) }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      const user = ctx.session.user;

      if (!user) {
        throw new Error("User not found");
      }
      
      const existinsgWorksapaceTicketGroups = await db 
        .collection("workspaces")
        .doc(input.workspaceId)
        .get();
      const workspace = existinsgWorksapaceTicketGroups.data() as Workspace;

      if (!workspace) {
        throw new Error("Workspace not found");
      }
      if (workspace?.ownerId !== user?.uid) {
        throw new Error("You are not the owner of this workspace");
      }

      await db 
        .collection("workspaces")
        .doc(input.workspaceId)
        .set({
          ...workspace,
          ticketGroupsRef: [...(workspace.ticketGroupsRef ?? []), ...input.ticketGroupRef],
          updatedAt: Date.now(),
        }, { merge: true });

      await Promise.all(
        input.ticketGroupRef.map(async (ticketGroupr) => {
          await db 
            .collection("workspaces")
            .doc(input.workspaceId)
            .collection("ticketGroups")
            .doc(ticketGroupr.id)
            .set({
              ...ticketGroupr,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
        })
      ); 

      return true; 
    }),
  findTicketGroupBId: publicProcedure
    .input(z.object({ workspaceId: z.string(), ticketGroupId: z.string() }))  
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      const ticketGroups = await db 
        .collection("workspaces")
        .doc(input.workspaceId)
        .collection("ticketGroups")
        .doc(input.ticketGroupId)
        .get();
 
      return ticketGroups.data() as TicketGroup;
    }),
  addTicket: protectedProcedure
    .input(z.object({ workspaceId: z.string(), ticketGroupId: z.string(), ticket: ticketSchema }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      const user = ctx.session.user;

      if (!user) {
        throw new Error("User not found");
      }

      const ticketRef: TicketRef = {
        id: input.ticket.id,
        title: input.ticket.title,
        description: input.ticket.description,
      };

      const existingWorkspace = await db 
        .collection("workspaces")
        .doc(input.workspaceId)
        .get();
      const workspace = existingWorkspace.data() as Workspace;
      if (!workspace) {
        throw new Error("Workspace not found");
      }
      if (workspace?.ownerId !== user?.uid) {
        throw new Error("You are not the owner of this workspace");
      }

      await db 
        .collection("workspaces")
        .doc(input.workspaceId)
        .collection("ticketGroups")
        .doc(input.ticketGroupId)
        .set({ 
          ticketsRef: firestore.FieldValue.arrayUnion(ticketRef),
          updatedAt: Date.now(),
        }, { merge: true });

      await db 
        .collection("workspaces")
        .doc(input.workspaceId)
        .collection("ticketGroups")
        .doc(input.ticketGroupId)
        .collection("tickets")
        .doc(input.ticket.id)
        .set({
          ...input.ticket,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

      return true;
    }),
  getTickets: protectedProcedure
    .input(z.object({ workspaceId: z.string(), ticketGroupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      const user = ctx.session.user;

      if (!user) {
        throw new Error("User not found");
      }

      const existingWorkspace = await db 
        .collection("workspaces")
        .doc(input.workspaceId)
        .get();
      const workspace = existingWorkspace.data() as Workspace;
      if (!workspace) {
        throw new Error("Workspace not found");
      }
      if (workspace?.ownerId !== user?.uid) {
        throw new Error("You are not the owner of this workspace");
      }

      const tickets = await db 
        .collection("workspaces")
        .doc(input.workspaceId)
        .collection("ticketGroups")
        .doc(input.ticketGroupId)
        .collection("tickets")
        .get();

      return tickets.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
    }),  
  getCompletedTickets: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      ticketGroupId: z.string()
    }))
    .query(async ({ ctx, input}) => {
      const db = ctx.db;
      const user = ctx.session.user;

      if (!user) {
        throw new Error("User not found");
      }

      if(!input.workspaceId || !input.ticketGroupId || input.workspaceId === "" || input.ticketGroupId === "") {
        throw new Error("Workspace or ticket group id missing.");
      }

      const existingWorkspace = await db 
        .collection("workspaces")
        .doc(input.workspaceId)
        .get();
      const workspace = existingWorkspace.data() as Workspace;
      if (!workspace) {
        throw new Error("Workspace not found");
      }
      if (workspace?.ownerId !== user?.uid) {
        throw new Error("You are not the owner of this workspace");
      }

      const tickets = await db 
        .collection("workspaces")
        .doc(input.workspaceId)
        .collection("ticketGroups")
        .doc(input.ticketGroupId)
        .collection("ticketHistory")
        .get();

      return tickets.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
    })
});
