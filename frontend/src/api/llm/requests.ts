import { LLM_REQUEST_API } from "@/constants/api";

const requests = async (idToken: string, type: "") => {
  const response = await fetch(LLM_REQUEST_API.REQUESTS, {
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


const requestById = async (idToken: string, id: string) => {
  const response = await fetch(LLM_REQUEST_API.REQUESTS + `/${id}`, {
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
export { requestById };
