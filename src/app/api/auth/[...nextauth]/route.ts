import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

// Konfigurace přihlašování
const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
    ],
    // Tajný klíč pro šifrování session
    secret: process.env.NEXTAUTH_SECRET,
})

// Exportujeme metody GET a POST, aby Next.js věděl, jak reagovat
export { handler as GET, handler as POST }