"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
const PricingSection = () => {
  return (
    <div
      id="pricing"
      className="pricing lg:h-[780px] md:mt-16 p-10 flex flex-col items-center w-full"
    >
      <div className="font-semibold text-center tracking-[0.69em] mb-10 lg:mb-0">
        P R I C I N G
      </div>
      <div className="flex flex-col lg:flex-row justify-center gap-8   w-full items-center lg:h-[700px]">
        <Card className="mb-10 rounded-3xl lg:mb-0 h-[250px] w-4/5 md:w-1/2 md:h-[400px] lg:w-[392px] lg:h-[489px] flex flex-col items-center justify-between cursor-pointer dark:bg-black dark:text-white box-shadow-custom border-2 border-solid border-gray-300 shadow-2xl">
          <CardHeader>
            <h2 className="font-bold text-3xl lg:text-[46px] pt-5">Basic</h2>
          </CardHeader>
          <CardFooter className="flex flex-col mb-10">
            <h2 className="font-bold text-4xl lg:text-6xl -tracking-[0.07em]">
              $10
            </h2>
            <h2 className="font-normal text-sm lg:text-xl">per month</h2>
          </CardFooter>
        </Card>
        <Card className="mb-10 rounded-3xl lg:mb-0 h-[300px] w-4/5 md:w-1/2 md:h-[470px] lg:w-[392px] lg:h-[591px] flex flex-col items-center justify-between cursor-pointer bg-[url('/images/team.svg')] dark:bg-[url('/images/enterprise.svg')] text-white bg-black dark:bg-black dark:text-black box-shadow-custom-2 shadow-2xl">
          <CardHeader>
            <h2 className="font-bold text-3xl lg:text-[46px] pt-5">Standard</h2>
          </CardHeader>
          <CardFooter className="flex flex-col mb-10">
            <h2 className="font-bold text-4xl lg:text-6xl -tracking-[0.07em]">
              $20
            </h2>
            <h2 className="font-normal text-sm lg:text-xl">per month</h2>
          </CardFooter>
        </Card>
        <Card className="md:mb-10 rounded-3xl h-[250px] w-4/5 md:w-1/2 md:h-[400px] lg:w-[392px] lg:h-[489px] flex flex-col items-center justify-between cursor-pointer bg-[url('/images/enterprise.svg')] dark:bg-[url('/images/team.svg')] dark:text-white box-shadow-custom border-2 border-solid border-gray-300 shadow-2xl">
          <CardHeader>
            <h2 className="font-bold text-3xl lg:text-[46px] pt-5">
              Enterprise
            </h2>
          </CardHeader>
          <CardFooter className="flex flex-col mb-10 w-full">
            <button
              className="bg-black p-3 rounded-md w-2/3 text-white dark:bg-white dark:text-black"
              onClick={() =>
                window.open(
                  "mailto:hi@genmanai.com?subject=Hi%20Genman&body=I%20am%20interested%20to%20know%20about%20genman",
                )
              }
            >
              <h2 className="">Contact Us</h2>
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingSection;
