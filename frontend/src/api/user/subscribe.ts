import { USER_API } from "@/constants/api";

const subscribe = async (idToken: string) => {
  const response = await fetch(USER_API.TRIAL, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const data = await response.json();
  if (response.status !== 200) {
    throw Error(data);
  }
  return data;
};

export default subscribe;
