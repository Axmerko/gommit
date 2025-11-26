'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Golem } from './Golem'

interface SceneProps {
    mood: string;
}

export default function Scene({ mood }: SceneProps) {
    return (
        <div className="h-full w-full">
            <Canvas camera={{ position: [0, 3, 10], fov: 45 }}>

                <ambientLight intensity={1} />
                <directionalLight position={[5, 10, 5]} intensity={3} />
                <Environment preset="city" />

                <Golem mood={mood} scale={0.2} position={[0, -3, 0]} />

                <OrbitControls />
            </Canvas>
        </div>
    )
}