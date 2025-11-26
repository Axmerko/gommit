'use client'

import Scene from "@/components/Scene";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { CONTROL_BUTTONS, MOOD_BG_COLORS, DEFAULT_MOOD } from "@/constants";

export default function Home() {
    const [mood, setMood] = useState(DEFAULT_MOOD);
    const { data: session } = useSession();
    const [isChecking, setIsChecking] = useState(false); // Stav načítání

    // 1. CHYTRÉ NAČTENÍ (Při startu)
    useEffect(() => {
        const initGolem = async () => {
            // A) Nejdřív zjistíme, co si pamatuje databáze
            try {
                const dbRes = await fetch('/api/mood');
                const dbData = await dbRes.json();
                if (dbData.mood) setMood(dbData.mood);
            } catch (e) { console.error(e); }

            // B) Pokud je uživatel přihlášený, zkontrolujeme GitHub (automaticky)
            if (session) {
                checkGithub();
            }
        };

        initGolem();
    }, [session]); // Spustí se, když se změní session (přihlášení)


    // 2. FUNKCE PRO KONTROLU GITHUBU
    const checkGithub = async () => {
        setIsChecking(true);
        try {
            const res = await fetch('/api/check-activity', { method: 'POST' });
            const data = await res.json();

            console.log("🤖 Golemova analýza:", data);

            if (data.mood) {
                setMood(data.mood);
            }
        } catch (error) {
            console.error("Chyba při kontrole GitHubu:", error);
        } finally {
            setIsChecking(false);
        }
    };


    const handleMoodChange = async (newMood: string) => {
        setMood(newMood);
        await fetch('/api/mood', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood: newMood }),
        });
    }

    const currentBgClass = MOOD_BG_COLORS[mood] || MOOD_BG_COLORS[DEFAULT_MOOD];

    return (
        <main className={`relative h-screen w-full bg-gradient-to-b ${currentBgClass} transition-all duration-1000`}>

            {/* UŽIVATELSKÝ PANEL */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">

                {/* NOVÉ TLAČÍTKO: SYNC */}
                {session && (
                    <button
                        onClick={checkGithub}
                        disabled={isChecking}
                        className="bg-green-600/80 text-white px-4 py-2 rounded-full font-bold hover:bg-green-500 border border-green-400 backdrop-blur-sm transition disabled:opacity-50"
                    >
                        {isChecking ? "🔄 Kontroluji..." : "🔄 Sync GitHub"}
                    </button>
                )}

                {!session ? (
                    <button
                        onClick={() => signIn('github')}
                        className="bg-gray-800 text-white px-4 py-2 rounded-full font-bold hover:bg-black border border-gray-600 flex items-center gap-2 transition"
                    >
                        <span>🐱</span> Login
                    </button>
                ) : (
                    <div className="flex items-center gap-3 bg-gray-900/80 p-2 pr-4 rounded-full border border-gray-700 backdrop-blur-sm">
                        {session.user?.image && (
                            <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-gray-500" />
                        )}
                        <div className="flex flex-col">
                            <span className="text-white text-xs font-bold leading-none">{session.user?.name}</span>
                        </div>
                        <button onClick={() => signOut()} className="ml-2 text-red-400 hover:text-red-300 text-xs font-bold uppercase">Logout</button>
                    </div>
                )}
            </div>

            <Scene mood={mood} />

            {/* Ovládání (Pro testování necháme viditelné) */}
            <div className="absolute top-10 left-10 flex flex-col gap-4 z-10 pointer-events-none">
                <div className="bg-gray-900/80 p-6 rounded-xl border border-gray-700 backdrop-blur-sm pointer-events-auto shadow-2xl">
                    <h1 className="text-white text-3xl font-bold mb-2">Golem v1.0 🤖</h1>
                    <p className="text-gray-400 mb-4 font-mono text-sm">
                        STATUS: <span className="text-yellow-400">{mood}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {CONTROL_BUTTONS.map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => handleMoodChange(btn.id)}
                                className={`${btn.color} hover:opacity-80 text-white px-4 py-2 rounded font-bold transition transform active:scale-95`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}