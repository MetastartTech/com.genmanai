import useUser from "@/provider/userContext/useUserContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LogoutAlert from "./logout-alert";
import FeedbackModal from "../dashboard/feedback-modal";

const UserMenu = () => {
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-1 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.displayPicture} alt={"name"} />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 md:w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal">
          <FeedbackModal />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <LogoutAlert />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
