import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ITabMenuProps {
  closeAllTabs: () => void;
  closeAllButSelectedTab: () => void;
  closeSelectedTab: () => void;
}
const TabMenu: React.FC<ITabMenuProps> = ({
  closeAllTabs,
  closeAllButSelectedTab,
  closeSelectedTab,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-secondary/90 focus:outline-none">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={closeSelectedTab}>
            Close Selected Tab
          </DropdownMenuItem>
          <DropdownMenuItem onClick={closeAllButSelectedTab}>
            Close All but Selected Tab
          </DropdownMenuItem>
          <DropdownMenuItem onClick={closeAllTabs}>
            Close All Tabs
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TabMenu;
