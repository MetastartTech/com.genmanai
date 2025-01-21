import { FEEDBACK_API } from "@/constants/api";

const addFeedback = async (
  idToken: string,
  email: string,
  feedback: string
) => {
  const response = await fetch(FEEDBACK_API.ADD, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, feedback }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

export { addFeedback };
