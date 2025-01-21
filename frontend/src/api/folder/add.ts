import { FOLDER_API } from "@/constants/api";

const add = async (
  idToken: string,
  name: string,
  type: "llm" | "image" = "llm"
) => {
  const response = await fetch(FOLDER_API.ADD, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, type }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

export default add;
