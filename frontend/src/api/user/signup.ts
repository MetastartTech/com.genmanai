import { USER_API } from "@/constants/api";

const signup = async (idToken: string, email: string, fullName: string) => {
  const response = await fetch(USER_API.SIGNUP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ email, fullName }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

export default signup;
