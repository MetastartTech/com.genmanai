import { USER_API } from "@/constants/api";

const signin = async (idToken: string) => {
  const response = await fetch(USER_API.SIGNIN, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const data = await response.json();
  if (response.status !== 200) {
    throw Error(data);
  }
  return data;
};

export default signin;
