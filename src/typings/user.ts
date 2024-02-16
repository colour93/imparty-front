export interface UserInfo {
  id: string;
  name?: string;
  createdAt: string;
}

export type UserBaseInfo = Pick<UserInfo, "id" | "name">;
