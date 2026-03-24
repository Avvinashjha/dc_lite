import type { User } from 'firebase/auth';

interface DCStoreAPI {
  init(): Promise<void>;
  get(tool: string, id: string): Promise<Record<string, unknown> | null>;
  getAll(tool: string): Promise<Record<string, unknown>[]>;
  set(tool: string, id: string, data: Record<string, unknown>): Promise<unknown>;
  remove(tool: string, id: string): Promise<unknown>;
}

interface DCSyncServiceAPI {
  init(uid: string, url: string): void;
  stop(): void;
  isActive(): boolean;
  isSyncedTool(tool: string): boolean;
  push(tool: string, id: string, data: Record<string, unknown>): void;
  flush(): void;
  pullAndMerge(): Promise<void>;
  pushEnrollment(courseSlug: string, data: Record<string, unknown>): Promise<void>;
  pullEnrollments(): Promise<Record<string, unknown>[]>;
  _getScriptUrl(): string | null;
}

declare global {
  interface Window {
    __dcAuthUser: User | null;
    __dcSyncScriptUrl: string;
    __dcOpenLoginModal: (reason?: string) => void;
    __dcCloseLoginModal: () => void;
    requireAuth: (reason: string, callback: (user: User) => void) => void;
    isUserSignedIn: () => boolean;
    getCurrentUser: () => User | null;
    getFirebaseIdToken: () => Promise<string | null>;
    DCStore: DCStoreAPI;
    DCSyncService: DCSyncServiceAPI;
  }
}

export {};
