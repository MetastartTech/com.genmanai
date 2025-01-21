import { FOLDER_API } from "@/constants/api";

const get = async (idToken: string, type: "llm" | "image") => {
  const response = await fetch(FOLDER_API.ADD + `?type=${type}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const data = await response.json();
  if (response.status !== 200) {
    throw Error(data);
  }
  return data;
};

const getByFolderId = async (idToken: string, folderId: string) => {
  const response = await fetch(FOLDER_API.ADD + `/${folderId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const data = await response.json();
  if (response.status !== 200) {
    throw Error(data);
  }
  return data;
};

export default get;

export { getByFolderId };