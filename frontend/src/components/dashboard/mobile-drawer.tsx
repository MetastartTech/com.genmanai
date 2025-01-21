import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LLMRequests from "../llm/llm-requests";
import ImageRequests from "../image/image-requests";
import UserMenu from "../common/user-menu";
import ThemeToggle from "../common/theme-toggle";
import ModeToggle from "../common/mode-toggle";
import { Separator } from "../ui/separator";
import UsageModal from "./usage-modal";

interface IMobileDrawer {
  type: "history" | "llm" | "image";
}

const MobileDrawer: React.FC<IMobileDrawer> = ({ type }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Menu size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col justify-between">
        <div className="flex-grow overflow-y-auto">
          {type !== "history" ? (
            type === "llm" ? (
              <LLMRequests />
            ) : (
              <ImageRequests />
            )
          ) : null}
        </div>
        <Separator />
        <SheetFooter>
          <div className="flex items-center gap-4">
            <UserMenu />
            <ThemeToggle />
            <ModeToggle />
            <UsageModal />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileDrawer;
