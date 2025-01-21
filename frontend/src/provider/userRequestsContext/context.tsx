import { IUserRequestsContext } from "@/types/context";
import { createContext } from "react";
import { IFolder, ITabRequest } from "@/types/schema";

const defaultContext: IUserRequestsContext = {
  folders: [],
  userRequests: [],
  tabRequests: [],
  sidebarLoading: false,
  tabsLoading: false,
  activeTab: "0",
  activeTabName: "",
  handleTabRequestAdd: (req: ITabRequest) => {
    return;
  },
  handleAddNewRequest: (req: ITabRequest, folderId: string = "") => {
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
  handleEditRequestName: (req: ITabRequest) => {
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

const UserRequestsContext = createContext<IUserRequestsContext>(defaultContext);

export default UserRequestsContext;
