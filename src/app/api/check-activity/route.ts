import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { checkGithubActivity } from "@/lib/github";
import { prisma } from "@/lib/db";

export async function POST() {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Nejsi přihlášený" }, { status: 401 });
    }

    // 1. Získáme datum posledního commitu
    const lastPushDate = await checkGithubActivity(session.accessToken);

    let newMood = "Idle"; // Výchozí stav
    let hoursSincePush = -1;

    if (lastPushDate) {
        // 2. Vypočítáme rozdíl v hodinách
        const now = new Date();
        const diffMs = now.getTime() - lastPushDate.getTime(); // Rozdíl v milisekundách
        hoursSincePush = Math.floor(diffMs / (1000 * 60 * 60)); // Převod na hodiny

        console.log(`⏱️ Hodin od posledního commitu: ${hoursSincePush}`);

        // 3. HERNÍ LOGIKA (Pravidla hry)
        if (hoursSincePush < 2) {
            // Méně než 2 hodiny -> Párty! Jsi v ráži.
            newMood = "Dance";
        } else if (hoursSincePush < 24) {
            // Méně než 24 hodin -> Makáš, udržuješ tempo.
            newMood = "Running";
        } else if (hoursSincePush < 72) {
            // Méně než 3 dny -> Odpočíváš.
            newMood = "Idle";
        } else {
            // Více než 3 dny -> Golem umírá nudou.
            newMood = "Death";
        }
    } else {
        // Pokud GitHub nic nenašel (nebo chyba), dáme Idle (nebo Death, chceš-li být přísný)
        newMood = "Idle";
    }

    // 4. Uložíme výsledek do DB
    await prisma.golemLog.create({
        data: { mood: newMood }
    });

    return NextResponse.json({
        mood: newMood,
        lastPush: lastPushDate,
        hoursSince: hoursSincePush
    });
}