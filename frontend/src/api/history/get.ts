import { HISTORY_API } from "@/constants/api";

const get = async (idToken: string) => {
  const response = await fetch(HISTORY_API.GET, {
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
