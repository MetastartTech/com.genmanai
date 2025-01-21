import { MoreHorizontal } from "lucide-react";
import DeleteAlert from "../common/delete-alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NewRequestModal from "./new-request-modal";
import { ITabRequest } from "@/types/schema";

interface IFolderMenu {
  setIsRenaming: () => void;
  onDelete: () => void;
  addRequest: (req: ITabRequest, folderId: string) => void;
  folderId: string;
}

const FolderMenu: React.FC<IFolderMenu> = ({
  setIsRenaming,
  onDelete,
  addRequest,
  folderId,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-secondary/90 focus:outline-none">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" forceMount>
        <DropdownMenuGroup>
          <NewRequestModal
            addRequest={addRequest}
            size="sm"
            text={"Add Request"}
            folderId={folderId}
          />
          <DropdownMenuItem onClick={setIsRenaming}>Rename</DropdownMenuItem>
          <DeleteAlert
            title="Delete Folder"
            subtitle="Are you sure you want to delete the folder?"
            onDelete={onDelete}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FolderMenu;
