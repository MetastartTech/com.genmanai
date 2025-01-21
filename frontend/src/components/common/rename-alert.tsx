import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { Button } from "../ui/button";

interface IRenameAlert {
  title: string;
  subtitle: string;
  oldName: string;
  renameRequest: (name: string) => void;
}

const RenameAlert: React.FC<IRenameAlert> = ({
  title,
  subtitle,
  oldName,
  renameRequest,
}) => {
  const [newName, setNewName] = useState<string>(oldName);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Rename
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <Input
          id="name"
          placeholder="Request Name"
          className="w-[200px]"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={newName === "" || newName === oldName}
            asChild
          >
            <Button variant="default" onClick={() => renameRequest(newName)}>
              Rename
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RenameAlert;
