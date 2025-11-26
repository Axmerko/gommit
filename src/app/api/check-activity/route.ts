import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {checkGithubActivity} from "@/lib/github";
import {prisma} from "@/lib/db";

export async function POST() {
    const session: any = await getServerSession(authOptions);

    if(!session || !session.accessToken){
        return NextResponse.json({error: "Nejsi přihlášený"},{status: 401});
    }

    const hasWorked = await checkGithubActivity(session.accessToken);

    const newMood = hasWorked ? "Running" : "Idle";

    await prisma.golemLog.create({
        data: {mood: newMood},
    });

    return NextResponse.json({
        worked: hasWorked,
        mood: newMood,
    });
}