"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

const NewFolderModal = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-md hover:bg-secondary/90"
          onClick={() => setOpen(true)}
        >
          <FolderPlus className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your requests by entering a name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="Folder Name" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              setOpen(false);
              toast({
                description: "New Folder Added",
              });
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewFolderModal;
