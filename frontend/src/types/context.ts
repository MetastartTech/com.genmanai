import {
  IUser,
  IImageTabRequest,
  ITabRequest,
  IFolder,
  ICredits,
} from "./schema";

export interface IUserContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  signIn: (code?: string) => Promise<void>;
  logOut: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  idToken: string | null;
  setIdToken: (idToken: string | null) => void;
  initializing: boolean;
  signUpWithEmailPassword: (
    email: string,
    password: string,
    fullName: string,
    code?: string
  ) => void;
  signInWithEmailPassword: (email: string, password: string) => void;
  setUserCredits: (wallet: ICredits) => void;
}

export interface IThemeContext {
  theme: "light" | "dark" | "system";
  color: string;
  setThemeAndColor: (
    newTheme: "light" | "dark" | "system",
    newColor: string
  ) => void;
  toggleLightMode: () => void;
  toggleDarkMode: () => void;
  toggleSystemMode: () => void;
  handleColorSelection: (color: string) => void;
}

export interface IRequestsContext {
  requests: ITabRequest[];
  tabRequests: ITabRequest[];
  sidebarLoading: boolean;
  tabsLoading: boolean;
  activeTab: string;
  activeTabName: string;
  handleTabRequestAdd: (req: ITabRequest) => void;
  handleAddRequest: (req: ITabRequest) => void;
  handleRemoveTabRequest: (id: string) => void;
  makeRequestTabActive: (id: string, tabName: string) => void;
  handleDeleteRequest: (id: string) => void;
  handleEditRequestName: (req: ITabRequest) => void;
  closeAllTabs: () => void;
  closeAllButSelectedTab: (id: string) => void;
}

export interface IImageRequestsContext {
  folders: IFolder[];
  userRequests: any[];
  tabRequests: any[];
  sidebarLoading: boolean;
  tabsLoading: boolean;
  activeTab: string;
  activeTabName: string;
  addFolder: (name: string) => void; //
  addRequestToFolder: (
    idToken: string,
    folderId: string,
    request: any
  ) => Promise<any>;
  deleteFolder: (folderId: string) => void;
  handleAddNewRequest: (req: IImageTabRequest, folderId: string) => void;
  addRequestOutsideFolder: (idToken: string, request: any) => Promise<any>;
  handleTabRequestAdd: (req: IImageTabRequest) => void; //
  handleRemoveTabRequest: (id: string) => void; //
  makeRequestTabActive: (id: string, tabName: string) => void; //
  handleDeleteRequest: (id: string, folderId: string) => void;
  handleEditRequestName: (req: IImageTabRequest) => void;
  closeAllTabs: () => void; //
  closeAllButSelectedTab: (id: string) => void; //
  handleRenameFolder: (folderId: string, newName: string) => void; //
}

export interface IUserRequestsContext {
  folders: IFolder[];
  userRequests: any[];
  tabRequests: any[];
  sidebarLoading: boolean;
  tabsLoading: boolean;
  activeTab: string;
  activeTabName: string;
  addFolder: (name: string) => void; //
  addRequestToFolder: (
    idToken: string,
    folderId: string,
    request: any
  ) => Promise<any>;
  deleteFolder: (folderId: string) => void;
  handleAddNewRequest: (req: ITabRequest, folderId: string) => void;
  addRequestOutsideFolder: (idToken: string, request: any) => Promise<any>;
  handleTabRequestAdd: (req: ITabRequest) => void; //
  handleRemoveTabRequest: (id: string) => void; //
  makeRequestTabActive: (id: string, tabName: string) => void; //
  handleDeleteRequest: (id: string, folderId: string) => void;
  handleEditRequestName: (req: ITabRequest) => void;
  closeAllTabs: () => void; //
  closeAllButSelectedTab: (id: string) => void; //
  handleRenameFolder: (folderId: string, newName: string) => void; //
}
