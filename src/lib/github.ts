// Vrací Datum posledního Pushe, nebo null (pokud žádný nenašel)
export async function checkGithubActivity(accessToken: string): Promise<Date | null> {
    try {
        console.log("🔍 KONTROLA GITHUB AKTIVITY...");

        // 1. Zjistíme uživatele
        const userRes = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!userRes.ok) return null;

        const userData = await userRes.json();
        const username = userData.login;

        // 2. Stáhneme eventy
        const eventsUrl = `https://api.github.com/users/${username}/events`;
        const res = await fetch(eventsUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
            cache: 'no-store',
        });

        if (!res.ok) return null;

        const events = await res.json();

        // 3. Hledáme NEJNOVĚJŠÍ PushEvent
        // (API vrací eventy seřazené od nejnovějších, takže stačí najít první)
        const lastPush = events.find((event: any) => event.type === 'PushEvent');

        if (lastPush) {
            const lastPushDate = new Date(lastPush.created_at);
            console.log(`✅ Poslední commit: ${lastPushDate.toLocaleString()}`);
            return lastPushDate;
        }

        console.log("❌ Žádný PushEvent v historii nenalezen.");
        return null;

    } catch (error) {
        console.error("❌ Chyba v github.ts:", error);
        return null;
    }
}