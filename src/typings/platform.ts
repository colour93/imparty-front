type PlatformVisible = "public" | "invite-only" | "private";

export interface PlatformInfo {
  id: string;
  name?: string | null;
  visible: PlatformVisible;
  createdAt: string;
}

export type PlatformBaseInfo = Omit<PlatformInfo, 'visible'>


