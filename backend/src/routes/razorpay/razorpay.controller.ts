import { Request, Response } from "express";
import { razorpay } from "../../client/razorpay";
import crypto from "crypto";

import Plan from "../../model/plan/plan.schema";
import { UserModel } from "../../model/user/user.schema";

const httpCreateCreateOrder = async (req: Request, res: Response) => {
  const { amount, currency, receipt, notes } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes,
    });
    res.json({
      id: order.id,
      entity: order.entity,
      amount: order.amount,
      amount_paid: order.amount_paid,
      amount_due: order.amount_due,
      currency: order.currency,
      receipt: order.receipt,
      offer_id: order.offer_id,
      status: order.status,
      attempts: order.attempts,
      notes: order.notes,
      created_at: order.created_at,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).send("Failed to create order");
  }
};

const httpVerifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      priceId,
      email,
    } = req.body;

    const userRecord = req.user; // This assumes your middleware attaches the user object to req.user
    if (!userRecord) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const shasum = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET ?? ""
    );
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = shasum.digest("hex");

    if (!priceId) {
      return res
        .status(404)
        .json({ message: `PriceId:${priceId} missing params` });
    }

    if (expectedSignature === razorpay_signature) {
      console.log("Payment verification successful");

      let user = await UserModel.findOne(
        { email: userRecord!.email },
        { __v: 0 }
      );
      const plan = await Plan.findOne({ priceId: priceId });

      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      if (!user) {
        res.status(404).send(`User not found ${email}`);
      }

      const { llm, image } = user?.creditsWallet!;
      const { llm: purchasedLlm, image: purchasedImage } = plan?.credits!;

      user!.creditsWallet.llm = Math.max(0, llm + purchasedLlm);
      user!.creditsWallet.image = Math.max(0, image + purchasedImage);

      user?.purchaseHistory.push({
        plan: plan,
        invoice: "",
      });

      await user!.save();

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      console.warn("Payment verification failed");
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export { httpCreateCreateOrder, httpVerifyPayment };
// 64FnmkBgKXY
