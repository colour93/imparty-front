import { RoomInfo } from "./room";
import { UserBaseInfo } from "./user";

export type PlatformVisible = "public" | "invite-only" | "private";

export interface PlatformInfo {
  id: string;
  name?: string | null;
  visible: PlatformVisible;
  createdAt: string;
  rooms: RoomInfo[];
  users: UserBaseInfo[];
}

export type PlatformBaseInfo = Omit<PlatformInfo, "visible">;

type PlatformVisibleMapper = Record<
  PlatformVisible,
  { color: "primary" | "secondary" | "default"; label: string }
>;
export const VISIBLE_MAPPER: PlatformVisibleMapper = {
  public: {
    color: "primary",
    label: "公开",
  },
  "invite-only": {
    color: "secondary",
    label: "仅邀请",
  },
  private: {
    color: "default",
    label: "私人",
  },
};
