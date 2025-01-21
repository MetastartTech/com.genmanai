"use client";

import {
  IconCaretDown,
  IconCaretRight,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import type { KeyboardEvent, ReactElement } from "react";
import { useEffect, useState } from "react";
import { FolderClosed } from "lucide-react";

import SidebarActionButton from "../dashboard/sidebar-action-button";
import FolderMenu from "./folder-menu";
import { IFolder } from "@/types/schema";
import useImageRequests from "@/provider/imageRequestsContext/useImageRequestsContext";

export type FolderType = "chat" | "prompt";

interface Props {
  currentFolder: IFolder;
  searchTerm: string;
  children?: ReactElement[];
  isDragOver: boolean;
}

const Folder: React.FC<Props> = ({
  currentFolder,
  searchTerm,
  children,
  isDragOver,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { deleteFolder, handleRenameFolder, handleAddNewRequest } =
    useImageRequests();

  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRename();
    }
  };

  const handleRename = () => {
    handleRenameFolder(currentFolder._id, renameValue);
    setIsRenaming(false);
  };

  useEffect(() => {
    if (
      searchTerm &&
      children &&
      children.some((child) =>
        child.props.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      setIsOpen(true);
    } else if (
      children &&
      children.some((child) => child.props.active === true)
    ) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm, currentFolder, children]);

  return (
    <>
      <div className="relative flex items-center">
        {isRenaming ? (
          <div className="flex w-full items-center gap-3 bg-secondary/80 p-3">
            {isOpen ? (
              <IconCaretDown size={18} />
            ) : (
              <IconCaretRight size={18} />
            )}
            <input
              className="mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 dark:text-white outline-none focus:border-neutral-100"
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleEnterDown}
              autoFocus
            />
          </div>
        ) : (
          <button
            className={`folder flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-secondary/80 outline ${
              isDragOver ? "outline-1" : "outline-0"
            } ${isOpen ? "bg-secondary" : ""}`}
            data-folder-id={currentFolder._id}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <IconCaretDown size={18} />
            ) : (
              <IconCaretRight size={18} />
            )}
            <div className="flex items-center gap-2">
              <FolderClosed className="w-4 h-4" />
              {currentFolder.name}
            </div>
          </button>
        )}

        {isRenaming && (
          <div className="absolute right-1 z-10 flex dark:text-gray-300">
            <SidebarActionButton
              handleClick={(e) => {
                e.stopPropagation();

                if (isRenaming) {
                  handleRename();
                }

                setIsRenaming(false);
              }}
            >
              <IconCheck size={18} className="dark:text-white text-black" />
            </SidebarActionButton>
            <SidebarActionButton
              handleClick={(e) => {
                e.stopPropagation();
                setIsRenaming(false);
              }}
            >
              <IconX size={18} className="dark:text-white text-black" />
            </SidebarActionButton>
          </div>
        )}

        {!isRenaming && (
          <div className="absolute right-1 z-10">
            <FolderMenu
              setIsRenaming={() => {
                setIsRenaming(true);
                setRenameValue(currentFolder.name);
              }}
              onDelete={() => {
                deleteFolder(currentFolder._id);
              }}
              addRequest={handleAddNewRequest}
              folderId={currentFolder._id}
            />
          </div>
        )}
      </div>

      {isOpen ? children : null}
    </>
  );
};

export default Folder;
