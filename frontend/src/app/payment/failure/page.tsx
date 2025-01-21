// pages/paymentFailure.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";

const PaymentFailure: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");
  const plan = searchParams.get("plan");
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency");

  const redirectToHome = () => {
    router.replace("/");
  };

  const redirectToDashboard = () => {
    router.replace("/dashboard/llm");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Card className="p-8 max-w-md w-full bg-white">
        <svg
          className="text-red-500 w-20 h-20 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12" y2="16" />
        </svg>
        <h1 className="text-3xl text-center font-semibold mb-4">
          Payment Failed
        </h1>
        <p className="text-gray-600 text-center mb-6">
          We were unable to process your payment.
        </p>
        <div className="mb-6">
          {orderId && (
            <p className="text-gray-600 mb-2">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <p className="text-gray-600 mb-2">
            Plan: <span className="font-semibold">{plan}</span>
          </p>
          <p className="text-gray-600 mb-2">
            Price:{" "}
            <span className="font-semibold">
              {currency} {amount}
            </span>
          </p>
        </div>
        <div className="flex justify-end gap-2 items-center">
          <Button onClick={redirectToHome}>Home</Button>
          <Button onClick={redirectToDashboard} variant={"secondary"}>
            Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

const PaymentFailurePage: React.FC = () => {
  return (
    <Suspense>
      <PaymentFailure />
    </Suspense>
  );
};

export default PaymentFailurePage;
