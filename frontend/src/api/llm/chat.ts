import { LLM_REQUEST_API } from "@/constants/api";

const chat = async (idToken: string, name: string, input: any) => {
  const response = await fetch(LLM_REQUEST_API.CHAT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, input }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

const modifyChat = async (idToken: string, requestId: string, input: any) => {
  const response = await fetch(LLM_REQUEST_API.CHAT + `/${requestId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

const editRequestName = async (
  idToken: string,
  requestId: string,
  name: string,
) => {
  const response = await fetch(LLM_REQUEST_API.CHAT + `/${requestId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

const deleteRequest = async (idToken: string, requestId: string) => {
  const response = await fetch(LLM_REQUEST_API.CHAT + `/${requestId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 204) {
    throw Error("Failed to delete data");
  }
  return; 
};

export default chat;
export { modifyChat, editRequestName, deleteRequest };
