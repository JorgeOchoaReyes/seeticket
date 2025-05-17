import { z } from "zod";
import { type StripeDetails } from "~/types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Stripe from "stripe";

const stripeKey = process.env.NODE_ENV === "production" ? process.env.STRIPE_PROD_SECRET_KEY : process.env.STRIPE_DEV_SECRET_KEY;

const stripe = new Stripe(stripeKey!, {
  apiVersion: "2025-03-31.basil",
});

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ input, ctx }) => {  
      const priceId = input.priceId;
      const userRecord = ctx.session.user;
      const db = ctx.db; 
      if(!ctx?.session?.user?.uid) {
        throw new Error("User not authenticated");
      }
      const userDetails = ctx.session.user; 
      const userStripeDetails = await db.collection("users").doc(ctx?.session?.user?.uid).collection("stripe").doc("subscription").get(); 
      let user = userStripeDetails.data() as StripeDetails; 

      if (!user?.customerId) {
        const customer = await stripe.customers.create({
          email: userRecord?.email,
          metadata: {
            userId: ctx.session.user.uid,
          },
        });
        await db.collection("users").doc(ctx?.session?.user?.uid).collection("stripe").doc("subscription").set({
          customerId: customer.id,
        }, { merge: true });
  
        user = {
          ...user,
          customerId: customer.id,
        };
      }
 
      const successUrl = `${process.env.CLIENT_URL_DEV}/dashboard?success=true`;
      const cancelUrl = `${process.env.CLIENT_URL_DEV}/dashboard/payments?canceled=true`;
      const session = await stripe.checkout.sessions.create({
        customer: user.customerId,
        client_reference_id: userDetails.uid,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          metadata: {
            userId: ctx.session.user.uid,
          },
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
  
    }),
});
