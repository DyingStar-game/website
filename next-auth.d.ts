import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string;
      roles?: string[];
      isAdmin?: boolean;
      isLeader?: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    roles?: string[];
    isAdmin?: boolean;
    isLeader?: boolean;
  }
}

