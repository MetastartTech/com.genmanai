import { STRIPE_API } from "@/constants/api";

const manage = async (idToken: string) => {
  const response = await fetch(STRIPE_API.MANAGE, {
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

export default manage;
