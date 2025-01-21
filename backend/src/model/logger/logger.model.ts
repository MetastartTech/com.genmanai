import UserActivityLog from "./logger.schema";
import { IUserActivityLog } from "../../types/schema";

const createLog = async (
  log: Partial<IUserActivityLog>
): Promise<IUserActivityLog> => {
  return await UserActivityLog.create(log);
};

const getLogsByUser = async (user: string): Promise<IUserActivityLog[]> => {
  return await UserActivityLog.find({ user });
};

const getLogsByType = async (
  user: string,
  type: string
): Promise<IUserActivityLog[]> => {
  return await UserActivityLog.find({ user, type });
};

const getLogsByEntity = async (
  user: string,
  entityId: string
): Promise<IUserActivityLog[]> => {
  return await UserActivityLog.find({ user, entityId });
};

export { createLog, getLogsByUser, getLogsByType, getLogsByEntity };
