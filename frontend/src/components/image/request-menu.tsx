import { MoreHorizontal } from "lucide-react";
import DeleteAlert from "../common/delete-alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import RenameAlert from "../common/rename-alert";

interface IRequestMenuProps {
  delRequest: () => void;
  handleRenameRequest: (name: string) => void;
  oldName: string;
}

const RequestMenu: React.FC<IRequestMenuProps> = ({
  delRequest,
  handleRenameRequest,
  oldName,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-secondary/90 focus:outline-none">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" forceMount>
        <DropdownMenuGroup onClick={(e) => e.stopPropagation()}>
          <RenameAlert
            title="Rename Request"
            subtitle="Are you sure you want to rename the request?"
            renameRequest={handleRenameRequest}
            oldName={oldName}
          />
          <DeleteAlert
            title="Request Name"
            subtitle="Are you sure you want to delete the request?"
            onDelete={delRequest}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RequestMenu;
