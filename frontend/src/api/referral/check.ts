import { REFERRAL_API } from "@/constants/api";

const checkReferral = async (code: String, deviceFingerprint: number) => {
  const response = await fetch(REFERRAL_API.CHECK, {
    method: "POST",
    headers: {
      //   Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, deviceFingerprint }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    // console.log("Error", data);

    throw Error(data.error);
  }
  return data;
};

export default checkReferral;
