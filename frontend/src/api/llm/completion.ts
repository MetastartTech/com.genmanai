import { LLM_REQUEST_API } from "@/constants/api";

const completion = async (idToken: string, name: string, input: any) => {
  const response = await fetch(LLM_REQUEST_API.COMPLETION, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, input }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

export default completion;
