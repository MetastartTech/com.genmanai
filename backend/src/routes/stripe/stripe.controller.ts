import { Request, Response } from "express";
import stripe from "../../config/stripe";
import getStripeCustomer from "../../stripe/customers";
import Plan from "../../model/plan/plan.schema";

const httpCreateCheckoutSession = async (req: Request, res: Response) => {
  const { planId } = req.query;
  const user = req.user;
  try {
    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const customer = await getStripeCustomer(user.email ?? "");

    if (!customer) {
      res.status(500).json({ error: "Customer not found" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      line_items: [
        {
          price: plan.priceId ?? "",
          quantity: 1,
        },
      ],
      invoice_creation: { enabled: true },
      mode: "payment",
      success_url: `${req.headers.origin}/dashboard/llm?plan=${plan.name}`,
      cancel_url: `${req.headers.origin}/subscribe`,
      metadata: {
        userId: user._id.toString(),
        planId: plan._id.toString(),
      },
    });

    res.status(200).json({ session: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

const httpCreateManageSession = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const customer = await getStripeCustomer(user.email ?? "");
    if (!customer) {
      res.status(500).json({ error: "Customer not found" });
      return;
    }
    const manageSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
    });
    res.status(200).json({ session: manageSession.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

export { httpCreateCheckoutSession, httpCreateManageSession };
