'use client'

import Scene from "@/components/Scene";
import { useState, useEffect } from "react";
// 1. IMPORTY PRO AUTH
import { useSession, signIn, signOut } from "next-auth/react";
import { CONTROL_BUTTONS, MOOD_BG_COLORS, DEFAULT_MOOD } from "@/constants";

export default function Home() {
    const [mood, setMood] = useState(DEFAULT_MOOD);

    // 2. ZÍSKÁNÍ DAT O UŽIVATELI
    // useSession() je háček, který se zeptá: "Je tu někdo přihlášený?"
    // data: session -> obsahuje info o uživateli (jméno, email, fotka)
    const { data: session } = useSession();

    // Načítání z DB (Zatím necháme takto, později upravíme pro konkrétního uživatele)
    useEffect(() => {
        const fetchMood = async () => {
            try {
                const response = await fetch('/api/mood');
                const data = await response.json();
                if (data.mood) setMood(data.mood);
            } catch (error) {
                console.error("Chyba při načítání:", error);
            }
        };
        fetchMood();
    }, []);

    const handleMoodChange = async (newMood: string) => {
        setMood(newMood);
        try {
            await fetch('/api/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood: newMood }),
            });
        } catch (error) {
            console.error("Chyba při ukládání:", error);
        }
    }

    const currentBgClass = MOOD_BG_COLORS[mood] || MOOD_BG_COLORS[DEFAULT_MOOD];

    return (
        <main className={`relative h-screen w-full bg-gradient-to-b ${currentBgClass} transition-all duration-1000`}>

            {/* 3. UŽIVATELSKÝ PANEL (Pravý horní roh) */}
            <div className="absolute top-4 right-4 z-20">
                {!session ? (
                    // A) Pokud NENÍ přihlášený -> Tlačítko Login
                    <button
                        onClick={() => signIn('github')}
                        className="bg-gray-800 text-white px-4 py-2 rounded-full font-bold hover:bg-black border border-gray-600 flex items-center gap-2 transition"
                    >
                        <span>🐱</span> Login with GitHub
                    </button>
                ) : (
                    // B) Pokud JE přihlášený -> Profilovka + Logout
                    <div className="flex items-center gap-3 bg-gray-900/80 p-2 pr-4 rounded-full border border-gray-700 backdrop-blur-sm">
                        {/* Fotka uživatele */}
                        {session.user?.image && (
                            <img
                                src={session.user.image}
                                alt="Profile"
                                className="w-8 h-8 rounded-full border border-gray-500"
                            />
                        )}

                        <div className="flex flex-col">
                            <span className="text-white text-xs font-bold leading-none">{session.user?.name}</span>
                            <span className="text-gray-400 text-[10px] leading-none">Logged in</span>
                        </div>

                        <button
                            onClick={() => signOut()}
                            className="ml-2 text-red-400 hover:text-red-300 text-xs font-bold uppercase"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>

            <Scene mood={mood} />

            {/* Ovládání Golema (Zobrazíme ho, i když není přihlášený - jako Demo) */}
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