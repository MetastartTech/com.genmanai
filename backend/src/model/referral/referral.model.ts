import Referral from "./referral.schema";
import randomatic from "randomatic";

const getUniqueCode = async () => {
  let referral,
    code = "";
  do {
    code = randomatic("A0", 8);
    referral = await Referral.findOne({ code }).exec();
  } while (referral != null);
  return code;
};

export const createNewReferral = async (
  userId: string,
  deviceFingerprint: number,
) => {
  const uniqueCode = await getUniqueCode();
  const referral = await Referral.create({
    code: uniqueCode,
    user: userId,
    usedFingerprints: [deviceFingerprint],
  });
  //   console.log(referral, "createNewReferral");
  return referral;
};

export const getReferralByCode = async (code: string) => {
  return await Referral.findOne({ code }).exec();
};

export const getReferralByUser = async (userId: string) => {
  return await Referral.findOne({ user: userId }).exec();
};

export const deleteReferralByUser = async (userId: string) => {
  await Referral.findOneAndDelete({ user: userId }).exec();
};

export const updateReferralAfterUse = async (
  referralId: string,
  deviceFingerprint: number,
) => {
  let updatedReferral = await Referral.findOneAndUpdate(
    { _id: referralId },
    { $inc: { timesUsed: 1 }, $push: { usedFingerprints: deviceFingerprint } },
    { new: true },
  ).exec();
  return updatedReferral;
};
