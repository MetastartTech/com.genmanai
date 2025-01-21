"use client";

import { ITabRequest, IImageTabRequest } from "@/types/schema";


export const getRequests = (email: string, requestType: "llm" | "image") => {
  let result = localStorage.getItem(email + requestType) ?? "";
  if (!result || result == "") {
    return [];
  }
  let requests = JSON.parse(result);

  let activeTab = localStorage.getItem(email + requestType + "ActiveTab") ?? "";

  if (activeTab == "" || activeTab == "0") {
    if (requests.length > 0) {
      localStorage.setItem(
        email + requestType + "ActiveTab",
        requests[requests.length - 1]._id
      );
      localStorage.setItem(
        email + requestType + "ActiveTabName",
        requests[requests.length - 1].name
      );
    } else {
      localStorage.setItem(email + requestType + "ActiveTab", "0");
      localStorage.setItem(email + requestType + "ActiveTabName", "");
    }
  }

  return requests;
};

export const deleteRequest = (
  email: string,
  requestType: "llm" | "image",
  id: string
) => {
  let result = localStorage.getItem(email + requestType) ?? "";
  if (!result || result == "") {
    return;
  }
  let requests = JSON.parse(result);

  const indexToRemove = requests.findIndex((obj: any) => obj._id === id);

  if (indexToRemove !== -1) {
    requests.splice(indexToRemove, 1);
  }

  localStorage.setItem(email + requestType, JSON.stringify(requests));

  if (localStorage.getItem(email + requestType + "ActiveTab") == id) {
    if (requests.length > 0) {
      localStorage.setItem(
        email + requestType + "ActiveTab",
        requests[requests.length - 1]._id
      );
      localStorage.setItem(
        email + requestType + "ActiveTabName",
        requests[requests.length - 1].name
      );
    } else {
      localStorage.setItem(email + requestType + "ActiveTab", "0");
      localStorage.setItem(email + requestType + "ActiveTabName", "");
    }
  }
};

export const addRequest = (
  email: string,
  requestType: "llm" | "image",
  request: ITabRequest | IImageTabRequest
) => {
  let result = localStorage.getItem(email + requestType) ?? "";

  let requests = [];

  if (!result || result == "") {
    localStorage.setItem(email + requestType, JSON.stringify([]));
  } else {
    requests = JSON.parse(result);
    let isPresent = requests.findIndex((r: any) => r._id == request._id);
    if (isPresent != -1) {
      localStorage.setItem(email + requestType + "ActiveTab", request._id);
      localStorage.setItem(email + requestType + "ActiveTabName", request.name);
      return;
    }
  }

  let updatedRequests = [
    ...requests,
    {
      _id: request._id,
      name: request.name,
      type: request.type,
    },
  ];

  localStorage.setItem(email + requestType, JSON.stringify(updatedRequests));
  localStorage.setItem(email + requestType + "ActiveTab", request._id);
  localStorage.setItem(email + requestType + "ActiveTabName", request.name);
};

export const getActiveTab = (
  email: string,
  requestType: "llm" | "image"
): [string, string] => {
  let reqId = localStorage.getItem(email + requestType + "ActiveTab") ?? "";
  if (!reqId || reqId === "") {
    reqId = "0";
  }
  let reqName =
    localStorage.getItem(email + requestType + "ActiveTabName") ?? "";
  return [reqId, reqName];
};

export const setActiveTab = (
  email: string,
  requestType: "llm" | "image",
  id: string,
  tabName: string
) => {
  localStorage.setItem(email + requestType + "ActiveTab", id);
  localStorage.setItem(email + requestType + "ActiveTabName", tabName);
};

export const editTabRequestName = (
  email: string,
  requestType: "llm" | "image",
  id: string,
  newName: string
) => {
  let result = localStorage.getItem(email + requestType) ?? "";
  if (!result || result == "") {
    return;
  }
  let requests = JSON.parse(result);

  const index = requests.findIndex((obj: any) => obj._id === id);

  if (index !== -1) {
    requests[index].name = newName;
    localStorage.setItem(email + requestType, JSON.stringify(requests));
  }

  let activeId = localStorage.getItem(email + requestType + "ActiveTab");
  if (activeId == id) {
    localStorage.setItem(email + requestType + "ActiveTabName", newName);
  }
};

export const closeAllRequests = (
  email: string,
  requestType: "llm" | "image"
) => {
  localStorage.setItem(email + requestType, JSON.stringify([]));
  localStorage.setItem(email + requestType + "ActiveTab", "0");
  localStorage.setItem(email + requestType + "ActiveTabName", "");
};

export const closeAllExceptOneRequest = (
  email: string,
  requestType: "llm" | "image",
  id: string
) => {
  let requests = getRequests(email, requestType);
  let req = requests.filter((r: any) => r._id === id);
  localStorage.setItem(email + requestType, JSON.stringify(req));
};

export const deleteEverythingOnLogout = (email: string) => {
  localStorage.removeItem(email + "llm");
  localStorage.removeItem(email + "image");
  localStorage.removeItem(email + "llmActiveTab");
  localStorage.removeItem(email + "imageActiveTab");
  localStorage.removeItem(email + "llmActiveTabName");
  localStorage.removeItem(email + "imageActiveTabName");
};

export const closeAllFollowingTabs = (
  email: string,
  requestType: "llm" | "image",
  reqIds: any[]
) => {
  if (localStorage.getItem(email + requestType)) {
    let requests = JSON.parse(localStorage.getItem(email + requestType) ?? "");
    let updatedRequests = requests.filter((r: any) => !reqIds.includes(r._id));
    localStorage.setItem(email + requestType, JSON.stringify(updatedRequests));

    let activeId =
      localStorage.getItem(email + requestType + "ActiveTab") ?? "0";
    if (reqIds.includes(activeId)) {
      if (updatedRequests.length > 0) {
        activeId = updatedRequests[updatedRequests.length - 1]._id;
        let activeName = updatedRequests[updatedRequests.length - 1].name;
        localStorage.setItem(email + requestType + "ActiveTab", activeId);
        localStorage.setItem(email + requestType + "ActiveTabName", activeName);
      } else {
        localStorage.setItem(email + requestType + "ActiveTab", "0");
        localStorage.setItem(email + requestType + "ActiveTabName", "");
      }
    }
  }
};