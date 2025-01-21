import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const TabMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-secondary/90 focus:outline-none">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Close Selected Tab
            <DropdownMenuShortcut>⌘W</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Close All but Selected Tab</DropdownMenuItem>
          <DropdownMenuItem>Close All Tabs</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TabMenu;
