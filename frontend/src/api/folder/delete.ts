import { FOLDER_API } from "@/constants/api";

const delFolder = async (idToken: string, id: string) => {
  const response = await fetch(FOLDER_API.ADD + `/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 204) {
    throw Error("Folder Not Deleted");
  }
  return;
};

export default delFolder;
