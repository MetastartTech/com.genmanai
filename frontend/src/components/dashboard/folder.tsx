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

import SidebarActionButton from "./sidebar-action-button";
import FolderMenu from "./folder-menu";

interface FolderInterface {
  id: string;
  name: string;
  //   type: "chat";
}

export type FolderType = "chat" | "prompt";

interface Props {
  currentFolder: FolderInterface;
  searchTerm: string;
  children?: ReactElement[];
  //   handleDrop: (e: any, folder: FolderInterface) => void;
  // folderComponent: (ReactElement | undefined)[];
}

const Folder: React.FC<Props> = ({ currentFolder, searchTerm, children }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRename();
    }
  };

  const handleRename = () => {
    setRenameValue("");
    setIsRenaming(false);
  };

  const dropHandler = (e: any) => {
    if (e.dataTransfer) {
      setIsOpen(true);

      //   handleDrop(e, currentFolder);

      e.target.style.background = "none";
    }
  };

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = "#343541";
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = "none";
  };

  useEffect(() => {
    if (searchTerm) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);

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
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-secondary/80`}
            onClick={() => setIsOpen(!isOpen)}
            onDrop={(e) => dropHandler(e)}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
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
            />
          </div>
        )}
      </div>

      {isOpen ? children : null}
    </>
  );
};

export default Folder;
