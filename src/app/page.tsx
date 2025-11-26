'use client'

import Scene from "@/components/Scene";
import { useState, useEffect } from "react"; // Přidali jsme useEffect
import { CONTROL_BUTTONS, MOOD_BG_COLORS, DEFAULT_MOOD } from "@/constants";

export default function Home() {
    const [mood, setMood] = useState(DEFAULT_MOOD);

    // 1. NAČTENÍ Z DATABÁZE (Při startu aplikace)
    useEffect(() => {
        // Funkce musí být async, proto ji definujeme uvnitř
        const fetchMood = async () => {
            try {
                const response = await fetch('/api/mood'); // Zavoláme náš GET endpoint
                const data = await response.json();
                if (data.mood) {
                    console.log("📥 Načteno z DB:", data.mood);
                    setMood(data.mood);
                }
            } catch (error) {
                console.error("Chyba při načítání:", error);
            }
        };

        fetchMood();
    }, []); // Prázdné pole [] = Spustit jen jednou při startu


    // 2. UKLÁDÁNÍ DO DATABÁZE (Při kliknutí)
    const handleMoodChange = async (newMood: string) => {
        // A) Optimistické UI: Hned změníme barvu a robota, nečekáme na server
        setMood(newMood);

        // B) Na pozadí pošleme data serveru
        try {
            await fetch('/api/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood: newMood }),
            });
            console.log("💾 Uloženo do DB:", newMood);
        } catch (error) {
            console.error("Chyba při ukládání:", error);
        }
    }

    const currentBgClass = MOOD_BG_COLORS[mood] || MOOD_BG_COLORS[DEFAULT_MOOD];

    return (
        <main className={`relative h-screen w-full bg-gradient-to-b ${currentBgClass} transition-all duration-1000`}>
            <Scene mood={mood} />

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
                                // Tady voláme naši novou chytrou funkci
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