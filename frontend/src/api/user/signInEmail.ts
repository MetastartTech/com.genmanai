import { USER_API } from "@/constants/api";

export const signInEmail = async (
  idToken: string,
  //   fingerPrint: string,
) => {
  const response = await fetch(USER_API.SIGNIN_EMAIL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data.error);
  }
  return data;
};
