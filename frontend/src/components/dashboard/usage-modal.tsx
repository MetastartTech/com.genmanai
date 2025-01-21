import {
  CreditCard,
  GaugeCircle,
  Image as ImageIcon,
  Repeat,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import useUser from "@/provider/userContext/useUserContext";
import { useRouter } from "next/navigation";
import { manage } from "@/api/stripe";

const UsageModal = () => {
  const { idToken, user } = useUser();
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center md:gap-1">
          <GaugeCircle className="h-4" />
          <span className="hidden md:block"> Usage</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usage</DialogTitle>
          <DialogDescription>Your request balance</DialogDescription>
        </DialogHeader>
        <div className="text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Repeat className="h-4" />
            LLM Requests:{" "}
            <p
              className={`text-sm font-bold ${
                !user?.creditsWallet.llm || user.creditsWallet.llm <= 0
                  ? "text-destructive"
                  : ""
              }`}
            >
              {Math.max(user?.creditsWallet.llm ?? 0, 0)}
            </p>{" "}
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4" />
            Image Requests:{" "}
            <p
              className={`text-sm font-bold ${
                !user?.creditsWallet.image || user.creditsWallet.image <= 0
                  ? "text-destructive"
                  : ""
              }`}
            >
              {Math.max(user?.creditsWallet.image ?? 0, 0)}
            </p>{" "}
          </div>
          <Alert className="mt-2">
            <CreditCard className="h-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Every request creation or update incurs a corresponding deduction
              from your available credits
            </AlertDescription>
          </Alert>
        </div>
        {/* <Button
          className="justify-start -mb-2"
          variant="link"
          onClick={async () => {
            await manage(idToken ?? "").then((data) =>
              window.open(data.session)
            );
          }}
        >
          Billing
        </Button> */}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              onClick={() => router.push("/subscribe")}
            >
              Buy More
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsageModal;
