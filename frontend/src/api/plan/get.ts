import { PLAN_API } from "@/constants/api";

const get = async (idToken: string) => {
  const response = await fetch(PLAN_API.GET, {
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

export const getById = async (idToken: string, priceId: string) => {
  const response = await fetch(PLAN_API.GET + `/${priceId}`, {
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
