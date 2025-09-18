import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds guilds.members.read',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (token.accessToken) {
        try {
          const res = await fetch(
            `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            const roles: string[] = data.roles || [];
            token.roles = roles;
            const adminRole = process.env.ADMIN_ROLE_ID;
            const leaderRole = process.env.LEADER_ROLE_ID;
            if (adminRole && roles.includes(adminRole)) {
              token.role = 'admin';
            } else if (leaderRole && roles.includes(leaderRole)) {
              token.role = 'leader';
            } else {
              token.role = 'user';
            }
          }
        } catch (err) {
          console.error('Error fetching guild member', err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string | undefined;
        session.user.roles = token.roles as string[] | undefined;
        session.user.isAdmin = token.role === 'admin';
        session.user.isLeader = token.role === 'leader';
      }
      return session;
    },
  },
};
