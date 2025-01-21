import { Request, Response } from "express";

import Stripe from "stripe";
import stripe from "../config/stripe";

import { UserModel } from "../model/user/user.schema";
import Plan from "../model/plan/plan.schema";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;
  try {
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET ?? ""
      ) as Stripe.Event;
    } catch (err: any) {
      console.log(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session) {
        const customer = await stripe.customers.retrieve(
          session.customer as string
        );

        const castedCustomer = customer as any;
        const email = castedCustomer.email ? castedCustomer.email : null;

        const user = await UserModel.findOne({ email });

        if (!user) {
          res.status(404).send(`User not found ${email}`);
        }

        const planId = session.metadata?.planId;
        const plan = await Plan.findById(planId);

        const { llm, image } = user?.creditsWallet!;
        const { llm: purchasedLlm, image: purchasedImage } = plan?.credits!;

        user!.creditsWallet.llm = Math.max(0, llm + purchasedLlm);
        user!.creditsWallet.image = Math.max(0, image + purchasedImage);

        user?.purchaseHistory.push({
          plan: plan,
          invoice: session!.invoice?.toString() ?? "",
        });

        await user!.save();
      }
    }
    res.json({ received: true });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.json({ received: true });
  }
};
