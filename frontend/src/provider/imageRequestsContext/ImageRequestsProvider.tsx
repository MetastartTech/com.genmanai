"use client";

import { ReactNode, useEffect, useState } from "react";
import UserRequestsContext from "./context";
import { IImageRequestsContext } from "@/types/context";
import { IFolder, IImageTabRequest } from "@/types/schema";

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

import { requestById } from "@/api/image/requests";
import useUser from "../userContext/useUserContext";
import { deleteRequest, editRequestName } from "@/api/image";
import { toast } from "sonner";
import {
  add,
  addRequest,
  delFolder,
  get,
  removeRequest,
  renameFolder,
} from "@/api/folder";

interface IImageRequestsProvider {
  children: ReactNode;
}

const ImageRequestsProvider: React.FC<IImageRequestsProvider> = ({
  children,
}) => {
  const { idToken, user } = useUser();
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [tabRequests, setTabRequests] = useState<IImageTabRequest[]>([]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState<boolean>(false);
  const [tabsLoading, setTabsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("0");
  const [activeTabName, setActiveTabName] = useState<string>("");

  const handleTabRequestAdd = (req: IImageTabRequest) => {
    addTabRequest(user?.email ?? "", "image", req);
    let tabs = getTabRequests(user?.email ?? "", "image");
    setTabRequests(tabs);
    let [activeId, activeName] = getActiveTabRequest(
      user?.email ?? "",
      "image"
    );
    setActiveTab(activeId);
    setActiveTabName(activeName);
  };

  const handleAddNewRequest = async (
    req: IImageTabRequest,
    folderId: string
  ) => {
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
    deleteTabRequest(user?.email ?? "", "image", id);
    let tabs = getTabRequests(user?.email ?? "", "image");
    setTabRequests(tabs);
    let [activeId, activeName] = getActiveTabRequest(
      user?.email ?? "",
      "image"
    );
    setActiveTab(activeId);
    setActiveTabName(activeName);
  };

  const makeRequestTabActive = (id: string, tabName: string) => {
    setActiveTabRequest(user?.email ?? "", "image", id, tabName);
    let [activeId, activeName] = getActiveTabRequest(
      user?.email ?? "",
      "image"
    );
    setActiveTab(activeId);
    setActiveTabName(activeName);
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      let req = await requestById(idToken ?? "", id);
      let deletingName = req.name;
      let deletingId = req._id;
      toast.promise(deleteRequest(idToken ?? "", id), {
        loading: `Deleting Request: ${deletingName}`,
        success: () => {
          if (req.folder == null) {
            let updatedRequests = userRequests.filter((r) => r._id != id);

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

          deleteTabRequest(user?.email ?? "", "image", id);
          let tabs = getTabRequests(user?.email ?? "", "image");
          setTabRequests(tabs);
          let [activeId, activeName] = getActiveTabRequest(
            user?.email ?? "",
            "image"
          );
          setActiveTab(activeId);
          setActiveTabName(activeName);
          setSidebarLoading(false);
          setTabsLoading(false);
          return `Request: deleted`;
        },
        error: () => {
          return `Failed to delete request!`;
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const closeAllTabs = async () => {
    closeAllTabRequests(user?.email ?? "", "image");
    setTabRequests([]);
    setActiveTab("0");
    setActiveTabName("");
  };

  const closeAllButSelectedTab = async (id: string) => {
    closeAllExceptOneTabRequest(user?.email ?? "", "image", id);
    let tabs = getTabRequests(user?.email ?? "", "image");
    setTabRequests(tabs);
  };

  const addFolder = async (name: string) => {
    toast.promise(add(idToken ?? "", name, "image"), {
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
          let data = await get(idToken ?? "", "image");
          setFolders(data.folders);
          setUserRequests(data.requestsWithoutFolders);
          closeAllFollowingTabs(user?.email ?? "", "image", reqIds ?? []);
          let tabs = getTabRequests(user?.email ?? "", "image");
          setTabRequests(tabs);
          let [activeId, activeName] = getActiveTabRequest(
            user?.email ?? "",
            "image"
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

  const handleEditRequestName = async (req: IImageTabRequest) => {
    toast.promise(
      editRequestName(idToken ?? "", req._id ?? "", req.name ?? ""),
      {
        loading: `Renaming Request`,
        success: (request) => {
          editTabRequestName(user?.email ?? "", "image", req._id, req.name);
          let tabs = getTabRequests(user?.email ?? "", "image");
          setTabRequests(tabs);
          let [activeId, activeName] = getActiveTabRequest(
            user?.email ?? "",
            "image"
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

  const handleInitialLoad = async (idToken: string) => {
    setSidebarLoading(true);
    setTabsLoading(true);

    await get(idToken, "image").then((data) => {
      setFolders(data.folders);
      setUserRequests(data.requestsWithoutFolders);
    });

    let tabs = getTabRequests(user?.email ?? "", "image");
    setTabRequests(tabs);

    let [activeId, activeName] = getActiveTabRequest(
      user?.email ?? "",
      "image"
    );
    setActiveTab(activeId);
    setActiveTabName(activeName);

    setSidebarLoading(false);
    setTabsLoading(false);
  };

  useEffect(() => {
    handleInitialLoad(idToken ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idToken]);

  const values: IImageRequestsContext = {
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

export default ImageRequestsProvider;
