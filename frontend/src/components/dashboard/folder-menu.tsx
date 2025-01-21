import { MoreHorizontal } from "lucide-react";
import DeleteAlert from "../common/delete-alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface IFolderMenu {
  setIsRenaming: () => void;
}

const FolderMenu: React.FC<IFolderMenu> = ({ setIsRenaming }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-secondary/90 focus:outline-none">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Add Request
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={setIsRenaming}>Rename</DropdownMenuItem>
          <DeleteAlert
            title="Delete Folder"
            subtitle="Are you sure you want to delete the folder?"
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FolderMenu;
