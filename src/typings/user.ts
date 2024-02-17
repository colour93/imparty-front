import { PlatformInfo } from "./platform";

export interface UserInfo {
  id: string;
  name?: string;
  createdAt: string;
  platforms: PlatformInfo[];
}

export type UserBaseInfo = Pick<UserInfo, "id" | "name">;
