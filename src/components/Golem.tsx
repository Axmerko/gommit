import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { Group } from 'three'
import { GOLEM_MESSAGES } from '../messages'
import { SpeechBubble } from './SpeechBubble'

interface GolemProps {
    mood: string;
    [key: string]: any;
}

export function Golem({ mood, ...props }: GolemProps) {
    const group = useRef<Group>(null)
    const { scene, animations } = useGLTF('/golem.glb') as any
    const { actions, names } = useAnimations(animations, scene)

    const [currentText, setCurrentText] = useState<string>("");

    // --- OPRAVA TEXTU ---
    useEffect(() => {
        // TypeScriptu řekneme: "mood je klíč".
        // Pokud mood v objektu není, vrátí undefined.
        const messages = GOLEM_MESSAGES[mood as keyof typeof GOLEM_MESSAGES];

        // DŮLEŽITÉ: Kontrola Array.isArray(messages).
        // Tím říkáme: "Pokračuj jenom pokud jsi fakt našel SEZNAM."
        // Tohle odstraní tu červenou chybu.
        if (messages && Array.isArray(messages) && messages.length > 0) {
            const randomIndex = Math.floor(Math.random() * messages.length);
            setCurrentText(messages[randomIndex]);
        } else {
            setCurrentText("...");
        }
    }, [mood]);
    // --------------------

    // --- ANIMACE ---
    useEffect(() => {
        if (!names || names.length === 0) return;

        let action: any = actions[mood];

        if (!action) {
            const fuzzy = names.find((n: string) => n.toLowerCase().includes(mood.toLowerCase()));
            if (fuzzy) action = actions[fuzzy];
        }

        if (action) {
            Object.values(actions).forEach((act: any) => {
                if (act !== action && act.isRunning()) act.fadeOut(0.5);
            });
            action.reset().fadeIn(0.5).play();
        } else {
            actions['Idle']?.reset().fadeIn(0.5).play();
        }
    }, [mood, actions, names])


    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={scene} />
            <SpeechBubble text={currentText} />
        </group>
    )
}

useGLTF.preload('/golem.glb')