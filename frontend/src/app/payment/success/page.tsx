"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const PaymentSuccess: React.FC = () => {
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
          className="text-green-500 w-20 h-20 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M7 13l3 3 7-7" />
        </svg>

        <h1 className="text-3xl text-center font-semibold mb-4">
          Payment Successful
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Thank you for subscribing to GenMan.
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

const PaymentSuccessPage: React.FC = () => {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
};

export default PaymentSuccessPage;
