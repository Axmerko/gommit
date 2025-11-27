'use client'

import Scene from "@/components/Scene";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { CONTROL_BUTTONS, MOOD_BG_COLORS, DEFAULT_MOOD } from "@/constants";

export default function Home() {
    const [mood, setMood] = useState(DEFAULT_MOOD);
    const { data: session } = useSession();
    const [isChecking, setIsChecking] = useState(false);

    // Nový stav pro zobrazení/skrytí tlačítek
    const [showDebug, setShowDebug] = useState(false);

    // Funkce pro kontrolu GitHubu
    const checkGithub = async () => {
        setIsChecking(true);
        try {
            const res = await fetch('/api/check-activity', { method: 'POST' });
            const data = await res.json();
            console.log("🤖 Golemova analýza:", data);
            if (data.mood) setMood(data.mood);
        } catch (error) {
            console.error("Chyba při kontrole GitHubu:", error);
        } finally {
            setIsChecking(false);
        }
    };

    // EFEKT: Načtení při startu
    useEffect(() => {
        const initGolem = async () => {
            // 1. Načíst z DB (okamžitá historie)
            try {
                const dbRes = await fetch('/api/mood');
                const dbData = await dbRes.json();
                if (dbData.mood) setMood(dbData.mood);
            } catch (e) { console.error(e); }

            // 2. AUTOMATICKY zkontrolovat GitHub (pokud je přihlášen)
            if (session) {
                checkGithub();
            }
        };

        initGolem();
    }, [session]); // Spustí se, když se načte session


    // Manuální změna (pro debug)
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

            {/* 1. Horní panel (Login + Sync) */}
            <div className="absolute top-4 right-4 z-20 flex gap-2 items-center">

                {/* Toggle Debug tlačítek */}
                <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-white/50 hover:text-white px-2 transition"
                    title="Vývojářské nástroje"
                >
                    🛠️
                </button>

                {session && (
                    <button
                        onClick={checkGithub}
                        disabled={isChecking}
                        className="bg-white/10 text-white px-4 py-2 rounded-full font-bold hover:bg-white/20 border border-white/20 backdrop-blur-sm transition disabled:opacity-50 flex gap-2 items-center"
                    >
                        {isChecking ? <span className="animate-spin">🔄</span> : "🔄"}
                        <span className="hidden sm:inline">Sync</span>
                    </button>
                )}

                {!session ? (
                    <button
                        onClick={() => signIn('github')}
                        className="bg-gray-900 text-white px-4 py-2 rounded-full font-bold hover:bg-black border border-gray-600 flex items-center gap-2 transition"
                    >
                        <span>🐱</span> Login
                    </button>
                ) : (
                    <div className="flex items-center gap-3 bg-black/40 p-2 pr-4 rounded-full border border-white/10 backdrop-blur-sm">
                        {session.user?.image && (
                            <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-white/30" />
                        )}
                        <button onClick={() => signOut()} className="ml-2 text-white/70 hover:text-red-400 text-xs font-bold uppercase transition">✕</button>
                    </div>
                )}
            </div>

            {/* 3D Scéna */}
            <Scene mood={mood} />

            {/* 2. Debug panel (Zobrazí se jen po kliknutí na 🛠️) */}
            {showDebug && (
                <div className="absolute bottom-10 left-10 flex flex-col gap-4 z-10 pointer-events-none">
                    <div className="bg-black/80 p-6 rounded-xl border border-gray-700 backdrop-blur-sm pointer-events-auto shadow-2xl">
                        <h1 className="text-white text-xl font-bold mb-2">Debug Menu 🔧</h1>
                        <div className="grid grid-cols-3 gap-2">
                            {CONTROL_BUTTONS.map((btn) => (
                                <button
                                    key={btn.id}
                                    onClick={() => handleMoodChange(btn.id)}
                                    className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-2 rounded transition"
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}