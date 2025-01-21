import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IPlan } from "@/types/schema";
import { CheckCircle2 } from "lucide-react";
import { RazorPayButton } from "../razorpay/button";
import { Button } from "@/components/ui/button";

interface IPricingCard {
  plan: IPlan;
  key: number;
}
export const PricingCard = ({ plan, key }: IPricingCard) => {
  return (
    <Card key={key} className="max-w-xs flex flex-col h-full">
      <div className="grow">
        <CardHeader>
          <CardTitle className="text-center">{plan.name}</CardTitle>
          <CardDescription className="text-center">
            {plan.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <h2 className="text-3xl font-bold text-center">{plan.price}</h2>
          <div className="grid grid-cols-[25px_1fr] items-start">
            <CheckCircle2 className="h-4 w-4" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {plan?.credits?.llm ? plan?.credits?.llm : "Unlimited"} LLM
                request and{" "}
                {plan?.credits?.image ? plan?.credits?.image : "Unlimited"}{" "}
                Image requests
              </p>
            </div>
          </div>
          <div>
            {plan?.features?.map((feature, index) => (
              <div
                key={index}
                className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
              >
                <CheckCircle2 className="h-4 w-4" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {typeof plan.priceId === "string" ? (
          <RazorPayButton
            priceId={plan?.priceId}
            amount={plan.amount ?? ""}
            name={plan?.name}
          />
        ) : (
          <Button
            className="w-full"
            onClick={() =>
              window.open(
                "mailto:hi@genmanai.com?subject=Hi%20Genman&body=I%20am%20interested%20to%20know%20about%20genman",
              )
            }
          >
            Contact Us
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
