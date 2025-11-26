export async function checkGithubActivity(accessToken: string): Promise<boolean> {
    try {
        // 1. Nastavíme dnešní datum
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log("🔍 KONTROLA GITHUB AKTIVITY...");

        // 2. KROK A: Zjistíme tvé GitHub jméno (Login)
        // Tím se vyhneme chybám 404, protože budeme adresovat přesně tebe.
        const userRes = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!userRes.ok) {
            console.error("❌ Chyba při získávání profilu:", userRes.status);
            return false;
        }

        const userData = await userRes.json();
        const username = userData.login;
        console.log(`👤 Uživatel identifikován jako: ${username}`);

        // 3. KROK B: Stáhneme eventy pro konkrétního uživatele
        const eventsUrl = `https://api.github.com/users/${username}/events`;

        const res = await fetch(eventsUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error("❌ Chyba při stahování eventů:", res.status);
            return false;
        }

        const events = await res.json();

        // DEBUG: Vypíšeme, co jsme našli (první 3 akce)
        console.log("📋 Poslední akce na GitHubu:");
        events.slice(0, 3).forEach((e: any) => {
            console.log(` - ${e.type} v repu ${e.repo.name} (${new Date(e.created_at).toLocaleString()})`);
        });

        // 4. Vyhodnocení: Hledáme PushEvent z dneška
        const hasPushToday = events.some((event: any) => {
            const isPush = event.type === 'PushEvent';
            const eventDate = new Date(event.created_at);
            const isToday = eventDate >= today;

            if (isPush && isToday) {
                console.log(`✅ NALEZENO! Push z: ${eventDate.toLocaleTimeString()}`);
            }
            return isPush && isToday;
        });

        return hasPushToday;

    } catch (error) {
        console.error("❌ Kritická chyba v github.ts:", error);
        return false;
    }
}