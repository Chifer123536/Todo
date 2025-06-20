import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    twoFactorUserId?: string;
    authState?: 'pending2FA' | 'authenticated';
  }
}
