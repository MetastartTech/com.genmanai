import { LLM_REQUEST_API } from "@/constants/api";

const requests = async (idToken: string) => {
  const response = await fetch(LLM_REQUEST_API.REQUESTS_API, {
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

export default requests;
