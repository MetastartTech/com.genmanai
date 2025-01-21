/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ReactNode, useEffect, useState } from "react";
import UserRequestsContext from "./context";
import { IUserRequestsContext } from "@/types/context";
import { IFolder, ITabRequest } from "@/types/schema";

import {
  addRequest as addTabRequest,
  getRequests as getTabRequests,
  deleteRequest as deleteTabRequest,
  getActiveTab as getActiveTabRequest,
  setActiveTab as setActiveTabRequest,
  editTabRequestName,
  closeAllRequests as closeAllTabRequests,
  closeAllExceptOneRequest as closeAllExceptOneTabRequest,
  closeAllFollowingTabs,
} from "@/actions/activeRequests";

import getRequests, { requestById } from "@/api/llm/requests";
import useUser from "../userContext/useUserContext";
import { chat, deleteRequest, editRequestName } from "@/api/llm";
import { toast } from "sonner";
import {
  add,
  addRequest,
  delFolder,
  get,
  getByFolderId,
  removeRequest,
  renameFolder,
} from "@/api/folder";

interface IRequestsProvider {
  children: ReactNode;
}

const RequestsProvider: React.FC<IRequestsProvider> = ({ children }) => {
  const { idToken, user } = useUser();
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [tabRequests, setTabRequests] = useState<ITabRequest[]>([]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState<boolean>(false);
  const [tabsLoading, setTabsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("0");
  const [activeTabName, setActiveTabName] = useState<string>("");

  const handleTabRequestAdd = (req: ITabRequest) => {
    addTabRequest(user?.email ?? "", "llm", req);
    let tabs = getTabRequests(user?.email ?? "", "llm");
    setTabRequests(tabs);
    let [activeId, activeName] = getActiveTabRequest(user?.email ?? "", "llm");
    setActiveTab(activeId);
    setActiveTabName(activeName);
  };

  const handleAddNewRequest = async (req: ITabRequest, folderId: string) => {
    try {
      if (folderId && folderId != "") {
        await addRequest(idToken ?? "", folderId, req._id).then((data) => {
          setFolders((prevFolders) => {
            return prevFolders.map((folder) => {
              if (folder._id == folderId) {
                return {
                  ...folder,
                  requests: [...folder.requests, req],
                };
              }
              return folder;
            });
          });
        });
      } else {
        setUserRequests([...userRequests, req]);
      }
      handleTabRequestAdd(req);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveTabRequest = (id: string) => {
    deleteTabRequest(user?.email ?? "", "llm", id);
    let tabs = getTabRequests(user?.email ?? "", "llm");
    setTabRequests(tabs);
    let [activeId, activeName] = getActiveTabRequest(user?.email ?? "", "llm");
    setActiveTab(activeId);
    setActiveTabName(activeName);
  };

  const makeRequestTabActive = (id: string, tabName: string) => {
    setActiveTabRequest(user?.email ?? "", "llm", id, tabName);
    let [activeId, activeName] = getActiveTabRequest(user?.email ?? "", "llm");
    setActiveTab(activeId);
    setActiveTabName(activeName);
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      let req = await requestById(idToken ?? "", id);
      let deletingName = req.name;
      let deletingId = req._id;
      toast.promise(deleteRequest(idToken ?? "", id), {
        loading: `Deleting Request`,
        success: () => {
          if (req.folder == null) {
            let updatedRequests = userRequests?.filter((r) => r._id != id);
            setUserRequests(updatedRequests);
          } else {
            setFolders((prevFolders) => {
              return prevFolders.map((folder) => {
                if (folder._id == req.folder) {
                  return {
                    ...folder,
                    requests: folder.requests.filter(
                      (r) => r._id != deletingId
                    ),
                  };
                }
                return folder;
              });
            });
          }

          deleteTabRequest(user?.email ?? "", "llm", id);
          let tabs = getTabRequests(user?.email ?? "", "llm");
          setTabRequests(tabs);
          let [activeId, activeName] = getActiveTabRequest(
            user?.email ?? "",
            "llm"
          );
          setActiveTab(activeId);
          setActiveTabName(activeName);
          setSidebarLoading(false);
          setTabsLoading(false);
          return `Request: deleted`;
        },
        error: (e) => {
          return `Failed to delete request!`;
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const closeAllTabs = async () => {
    closeAllTabRequests(user?.email ?? "", "llm");
    setTabRequests([]);
    setActiveTab("0");
    setActiveTabName("");
  };

  const closeAllButSelectedTab = async (id: string) => {
    closeAllExceptOneTabRequest(user?.email ?? "", "llm", id);
    let tabs = getTabRequests(user?.email ?? "", "llm");
    setTabRequests(tabs);
  };

  const addFolder = async (name: string) => {
    toast.promise(add(idToken ?? "", name), {
      loading: `Creating Folder`,
      success: (data) => {
        setFolders([...folders, data]);
        return `Folder: ${name} Created`;
      },
      error: () => {
        return `Failed to create Folder ${name}`;
      },
    });
  };

  const addRequestToFolder = async (
    idToken: string,
    folderId: string,
    request: any
  ) => {
    const requestCheck = folders
      .find((folder) => folder._id === folderId)
      ?.requests.some((req) => req._id === request._id);
    if (!requestCheck) {
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder._id === folderId
            ? {
                ...folder,
                requests: [...folder.requests, request],
              }
            : {
                ...folder,
                requests: folder.requests.filter(
                  (req) => req._id !== request._id
                ),
              }
        )
      );
      setUserRequests((prevRequests: any[]) =>
        prevRequests.filter((req) => req._id !== request._id)
      );
      await addRequest(idToken, folderId, request._id);
    }
  };

  const addRequestOutsideFolder = async (idToken: string, request: any) => {
    const requestCheck = userRequests.some((req) => req._id === request._id);
    if (!requestCheck) {
      setFolders((prevFolders) =>
        prevFolders.map((folder) => ({
          ...folder,
          requests: folder.requests.filter((req) => req._id !== request._id),
        }))
      );
      setUserRequests((prevRequests: any[]) => [...prevRequests, request]);
      await removeRequest(idToken, request._id);
    }
  };

  const deleteFolder = async (folderId: string) => {
    const folder = folders.find((folder) => folder._id === folderId);
    let reqIds = folder?.requests.map((r: any) => r._id);
    try {
      toast.promise(delFolder(idToken ?? "", folderId), {
        loading: `Deleting Folder`,
        success: async () => {
          let data = await get(idToken ?? "", "llm");
          setFolders(data.folders);
          setUserRequests(data.requestsWithoutFolders);
          closeAllFollowingTabs(user?.email ?? "", "llm", reqIds ?? []);
          let tabs = getTabRequests(user?.email ?? "", "llm");
          setTabRequests(tabs);
          let [activeId, activeName] = getActiveTabRequest(
            user?.email ?? "",
            "llm"
          );
          setActiveTab(activeId);
          setActiveTabName(activeName);
          return "Folder deleted successfully.";
        },
        error: () => {
          return `Failed to delete folder!`;
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditRequestName = async (req: ITabRequest) => {
    toast.promise(
      editRequestName(idToken ?? "", req._id ?? "", req.name ?? ""),
      {
        loading: `Renaming Request`,
        success: (request) => {
          editTabRequestName(user?.email ?? "", "llm", req._id, req.name);
          let tabs = getTabRequests(user?.email ?? "", "llm");
          setTabRequests(tabs);
          let [activeId, activeName] = getActiveTabRequest(
            user?.email ?? "",
            "llm"
          );
          setActiveTab(activeId);
          setActiveTabName(activeName);
          if (!request.folder || request.folder == "0") {
            let prev = [...userRequests];
            let index = prev.findIndex((item) => item._id == req._id);
            if (index != -1) {
              prev[index] = {
                ...prev[index],
                name: req.name,
              };
              setUserRequests(prev);
            }
          } else {
            setFolders((prevFolders) => {
              return prevFolders.map((folder) => {
                // Check if the folder contains the request with the specified ID
                const requestIndex = folder.requests.findIndex(
                  (req) => req._id === request._id
                );

                // If the request is found in the folder
                if (requestIndex !== -1) {
                  // Create a new array of requests with the updated name
                  const updatedRequests = [...folder.requests];
                  updatedRequests[requestIndex] = {
                    ...updatedRequests[requestIndex],
                    name: req.name, // Replace 'name' with the property you want to update
                  };

                  // Return a new folder object with the updated requests
                  return {
                    ...folder,
                    requests: updatedRequests,
                  };
                }

                // If the request is not found in the folder, return the folder unchanged
                return folder;
              });
            });
          }
          return `Request Renamed to ${req.name}`;
        },
        error: () => {
          return `Failed to rename request!`;
        },
      }
    );
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    try {
      toast.promise(renameFolder(idToken ?? "", folderId, newName), {
        loading: `Renaming Folder`,
        success: (data) => {
          setFolders((prevFolders) => {
            return prevFolders.map((folder) => {
              // Check if the folder contains the request with the specified ID
              if (folder._id == folderId) {
                return {
                  ...folder,
                  name: newName,
                };
              }

              // If the request is not found in the folder, return the folder unchanged
              return folder;
            });
          });
          return `Folder Renamed to ${newName} successfully`;
        },
        error: () => {
          return "Folder renaming failed";
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleInitialLoad = async () => {
    setSidebarLoading(true);
    setTabsLoading(true);

    await get(idToken ?? "", "llm").then((data) => {
      setFolders(data.folders);
      setUserRequests(data.requestsWithoutFolders);
    });

    let tabs = getTabRequests(user?.email ?? "", "llm");
    setTabRequests(tabs);

    let [activeId, activeName] = getActiveTabRequest(user?.email ?? "", "llm");
    setActiveTab(activeId);
    setActiveTabName(activeName);

    setSidebarLoading(false);
    setTabsLoading(false);
  };

  useEffect(() => {
    handleInitialLoad();
  }, [idToken]);

  const values: IUserRequestsContext = {
    userRequests,
    folders,
    tabRequests,
    tabsLoading,
    sidebarLoading,
    activeTab,
    activeTabName,
    handleTabRequestAdd,
    handleAddNewRequest,
    handleRemoveTabRequest,
    makeRequestTabActive,
    handleDeleteRequest,
    handleEditRequestName,
    closeAllTabs,
    closeAllButSelectedTab,
    addRequestToFolder,
    addRequestOutsideFolder,
    deleteFolder,
    addFolder,
    handleRenameFolder,
  };

  return (
    <UserRequestsContext.Provider value={values}>
      {children}
    </UserRequestsContext.Provider>
  );
};

export default RequestsProvider;
