import { MoreHorizontal } from "lucide-react";
import DeleteAlert from "../common/delete-alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const RequestMenu: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-secondary/90 focus:outline-none">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DeleteAlert
            title="Delete Request"
            subtitle="Are you sure you want to delete the request?"
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RequestMenu;
