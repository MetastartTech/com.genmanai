import { LLM_REQUEST_API } from "@/constants/api";

const compare = async (idToken: string, input1: any, input2: any) => {
  const response = await fetch(LLM_REQUEST_API.COMPARE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input1, input2 }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

export default compare;
