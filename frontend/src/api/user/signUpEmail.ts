import { USER_API } from "@/constants/api";

export const signUpEmail = async (
  idToken: string,
  fullName: string,
  joinedBy: string,
  referredBy: string,
  deviceFingerprint: number,
) => {
  const response = await fetch(USER_API.SIGNUP_EMAIL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ fullName, joinedBy, referredBy, deviceFingerprint }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};
