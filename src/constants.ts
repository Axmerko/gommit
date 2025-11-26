// src/constants.ts

// Definice tlačítek a jejich vlastností
export const CONTROL_BUTTONS = [
    { label: "🏃 Run", id: "Running", color: "bg-blue-600" },
    { label: "💃 Dance", id: "Dance", color: "bg-purple-600" },
    { label: "👋 Wave", id: "Wave", color: "bg-yellow-600" },
    { label: "⬆️ Jump", id: "Jump", color: "bg-orange-600" },
    { label: "💀 Die", id: "Death", color: "bg-red-600" },
    { label: "🧘 Idle", id: "Idle", color: "bg-gray-600" },
];

// Mapování nálad na barvy pozadí (Tailwind classes)
export const MOOD_BG_COLORS: Record<string, string> = {
    Running: "from-blue-900 via-blue-950 to-black",
    Dance: "from-purple-900 via-purple-950 to-black",
    Wave: "from-yellow-900 via-yellow-950 to-black",
    Jump: "from-orange-900 via-orange-950 to-black",
    Death: "from-red-900 via-red-950 to-black",
    Idle: "from-gray-800 via-gray-950 to-black",
};

export const DEFAULT_MOOD = 'Idle';