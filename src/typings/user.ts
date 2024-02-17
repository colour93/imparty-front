import { PlatformInfo } from "./platform";
import { RoomInfo } from "./room";

export interface UserInfo {
  id: string;
  name?: string;
  createdAt: string;
  platforms: PlatformInfo[];
  rooms: RoomInfo[];
}

export type UserBaseInfo = Pick<UserInfo, "id" | "name">;
