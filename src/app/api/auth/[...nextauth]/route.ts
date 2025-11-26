import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"


export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,

            authorization: { params: { scope: "read:user user:email repo" } },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,


    callbacks: {

        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },

        async session({ session, token }: any) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }