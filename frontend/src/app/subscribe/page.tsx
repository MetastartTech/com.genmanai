"use client";

import { get } from "@/api/plan";
import Header from "@/components/common/header";
import { PricingCard } from "@/components/common/pricing-card";
import useUser from "@/provider/userContext/useUserContext";
import { IPlan } from "@/types/schema";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const Subscribe = () => {
  const { idToken } = useUser();
  const [plans, setPlans] = useState<IPlan[]>([]);

  // Example useCallback usage
  const fetchPlans = useCallback(() => {
    if (idToken) {
      get(idToken)
        .then((data) => {
          setPlans(data);
        })
        .catch(() => {
          toast.error("Failed to fetch plans");
          setPlans([]);
        });
    }
  }, [idToken]); // Dependency array ensures this callback is memoized until idToken changes

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]); // Here, fetchPlans is a dependency of useEffect

  return (
    <>
      <Header />
      <div className="min-h-screen py-10 px-5 flex flex-col justify-center items-center">
        <div className="flex flex-col text-center mb-10">
          <h1 className="text-3xl font-semibold">
            Designed for business teams like yours
          </h1>
          <p className="mt-2 font-light max-w-xl">
            Here at GenMan we focus on markets where technology, innovation, and
            capital can unlock long-term value and drive economic growth.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 justify-center items-center">
          {plans &&
            plans?.map((plan, index) => (
              <PricingCard plan={plan} key={index} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Subscribe;
