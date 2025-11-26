
export async function checkGithubActivity(accessToken: string): Promise<boolean> {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);


        const response = await fetch('https://api.github.com/users/Axmerko/events', {

        });


        const res = await fetch('https://api.github.com/user/events', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
        });

        if (!res.ok) {
            console.error("GitHub API Error:", res.statusText);
            return false;
        }

        const events = await res.json();


        const hasPushToday = events.some((event: any) => {

            const isPush = event.type === 'PushEvent';


            const eventDate = new Date(event.created_at);
            const isToday = eventDate >= today;

            return isPush && isToday;
        });

        console.log(`🔍 GitHub kontola: ${hasPushToday ? "MAKAL" : "FLÁKAL SE"}`);

        return hasPushToday;

    } catch (error) {
        console.error("Chyba při kontrole GitHubu:", error);
        return false;
    }
}