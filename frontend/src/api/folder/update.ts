import { FOLDER_API } from "@/constants/api";

const addRequest = async (idToken: string, id: string, request: string) => {
  const response = await fetch(FOLDER_API.ADD + `/add-request/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ request }),
  });
  const data = await response.json();
  if (response.status !== 200) {
    throw Error(data);
  }
  return data;
};

const removeRequest = async (idToken: string, request: string) => {
  const response = await fetch(FOLDER_API.ADD + `/remove-request/${request}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status !== 200) {
    throw Error(data);
  }
  return data;
};

const renameFolder = async (
  idToken: string,
  folderId: string,
  name: string,
) => {
  const response = await fetch(FOLDER_API.ADD + `/${folderId}`, {
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

export default addRequest;
export { removeRequest, renameFolder };
