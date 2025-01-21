import { IImageRequestsContext } from "@/types/context";
import { createContext } from "react";
import { IImageTabRequest } from "@/types/schema";

const defaultContext: IImageRequestsContext = {
  folders: [],
  userRequests: [],
  tabRequests: [],
  sidebarLoading: false,
  tabsLoading: false,
  activeTab: "0",
  activeTabName: "",
  handleTabRequestAdd: (req: IImageTabRequest) => {
    return;
  },
  handleAddNewRequest: (req: IImageTabRequest, folderId: string = "") => {
    return;
  },
  addFolder: (name: string) => {
    return;
  },
  addRequestToFolder: (idToken: string, folderId: string, request: any) => {
    return new Promise((resolve, reject) => {});
  },
  addRequestOutsideFolder: (idToken: string, request: any) => {
    return new Promise((resolve, reject) => {});
  },
  handleRemoveTabRequest: (id: string) => {
    return;
  },
  makeRequestTabActive: (id: string, tabName: string) => {
    return;
  },
  handleEditRequestName: (req: IImageTabRequest) => {
    return;
  },
  handleDeleteRequest: (id: string, folderId: string) => {
    return;
  },
  closeAllTabs: () => {
    return;
  },
  closeAllButSelectedTab: (id: string) => {
    return;
  },
  deleteFolder: (folderId: string) => {
    return;
  },
  handleRenameFolder: (folderId: string, newName: string) => {
    return;
  },
};

const ImageRequestsContext =
  createContext<IImageRequestsContext>(defaultContext);

export default ImageRequestsContext;
