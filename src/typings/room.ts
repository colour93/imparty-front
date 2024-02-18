import { UserBaseInfo } from "./user";

export interface RoomInfo {
  id: string;
  game: string;
  startAt: Date;
  endAt: Date;
  name: string;
  total: number;
  users: UserBaseInfo[];
}
