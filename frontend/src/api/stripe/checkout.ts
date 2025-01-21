import { STRIPE_API } from "@/constants/api";

const checkout = async (idToken: string, plan: string) => {
  const response = await fetch(STRIPE_API.CHECKOUT + `/?planId=${plan}`, {
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

export default checkout;
