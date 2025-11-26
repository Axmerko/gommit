import {Html} from "@react-three/drei";

interface SpeechBubbleProps {
    text: string;
}

export function SpeechBubble({text}: SpeechBubbleProps) {
    if (!text) return null;

    return (
        <Html position={[0, 12, 0]} center distanceFactor={10}>
            <div className="bg-white px-4 py-2 rounded-xl shadow-lg border-2 border-gray-200 w-auto min-w-[100px] text-center animate-bounce whitespace-nowrap">
                <p className="text-black font-bold text-sm font-mono">
                    {text}
                </p>
                <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0
                        border-l-[8px] border-l-transparent
                        border-r-[8px] border-r-transparent
                        border-t-[8px] border-t-white">
                </div>
            </div>
        </Html>
    )
}