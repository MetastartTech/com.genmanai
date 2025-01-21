"use client";
import { useCallback } from "react";
import useRazorpay from "react-razorpay";
import { createOrder } from "@/api/razorpay/createOrder";
import { RazorpayOptions } from "react-razorpay";
import { Button } from "@/components/ui/button";
import useUser from "@/provider/userContext/useUserContext";
import { RAZORPAY_API } from "@/constants/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface IRazorPayButtonProps {
  priceId: string;
  amount: number;
  name: string;
}
export const RazorPayButton: React.FC<IRazorPayButtonProps> = ({
  priceId,
  amount,
  name,
}) => {
  const [Razorpay] = useRazorpay();
  const router = useRouter();

  const createQueryString = (name: string, value: any) => {
    const params = new URLSearchParams();
    params.set(name, value);

    return params.toString();
  };
  const { idToken, user } = useUser();

  const handlePayment = useCallback(async () => {
    toast.promise(
      createOrder(idToken ?? "", {
        amount: Number(amount) * 100,
        currency: "USD",
        notes: {
          name: user?.fullName,
          email: user?.email,
        },
        receipt: "",
      }),
      {
        loading: `Processing order:`,
        success: (order) => {
          const options: RazorpayOptions = {
            key:
              process.env.NEXT_PUBLIC_RAZORPAY_ID,
            amount: order?.amount,
            currency: order?.currency,
            name: "Genman AI",
            description:
              "The ultimate prompt testing tool for developers and prompt engineers",
            image:
              "https://firebasestorage.googleapis.com/v0/b/genmanai.appspot.com/o/favicon-32x32.png?alt=media&token=c63d2105-e572-474e-8114-8a02a6421141",
            order_id: order.id,
            handler: async (response) => {
              const {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
              } = response;

              try {
                const verificationResponse = await fetch(
                  RAZORPAY_API.VERIFY_PAYMENT,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                      razorpay_payment_id,
                      razorpay_order_id,
                      razorpay_signature,
                      priceId: priceId ?? "",
                    }),
                  }
                );

                if (!verificationResponse.ok) {
                  throw new Error("Payment verification failed");
                }

                const verificationData = await verificationResponse.json();
                router.push(
                  "/payment/success" +
                    "?" +
                    createQueryString("orderId", order.id) +
                    "&" +
                    createQueryString("plan", name) +
                    "&" +
                    createQueryString("amount", amount) +
                    "&" +
                    createQueryString("currency", order.currency)
                );
              } catch (error) {
                window.location.href =
                  "/payment/failure" +
                  "?" +
                  createQueryString("orderId", order.id) +
                  "&" +
                  createQueryString("plan", name) +
                  "&" +
                  createQueryString("amount", amount) +
                  "&" +
                  createQueryString("currency", order.currency);
              }
            },
            prefill: {
              name: user?.fullName,
              email: user?.email,
            },
            notes: {
              address: "Metastart Corporate Office",
            },
            theme: {
              color: "#3399cc",
            },
          };

          const rzpay = new Razorpay(options);

          rzpay.on("payment.failed", function (response: any) {
            window.location.href =
              "/payment/failure" +
              "?" +
              createQueryString("orderId", order.id) +
              "&" +
              createQueryString("plan", name) +
              "&" +
              createQueryString("amount", amount) +
              "&" +
              createQueryString("currency", order.currency);
          });

          rzpay.open();
          return `Order successful!`;
        },
        error: () => {
          return `Failed to create order!`;
        },
      },
    );
  }, [Razorpay]);

  return (
    <Button className="w-full" disabled={false} onClick={handlePayment}>
      Buy
    </Button>
  );
};
