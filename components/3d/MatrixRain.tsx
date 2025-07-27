"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function MatrixRain() {
        const pointsRef = useRef<THREE.Points>(null);

        // Generate matrix rain particles
        const particles = useMemo(() => {
                const count = 1000;
                const positions = new Float32Array(count * 3);
                const colors = new Float32Array(count * 3);
                const speeds = new Float32Array(count);

                for (let i = 0; i < count; i++) {
                        const i3 = i * 3;

                        // Random positions
                        positions[i3] = (Math.random() - 0.5) * 20; // x
                        positions[i3 + 1] = Math.random() * 20 - 10; // y
                        positions[i3 + 2] = (Math.random() - 0.5) * 20; // z

                        // Green matrix colors with variation
                        const greenIntensity = Math.random() * 0.5 + 0.5;
                        colors[i3] = 0; // r
                        colors[i3 + 1] = greenIntensity; // g
                        colors[i3 + 2] = greenIntensity * 0.3; // b

                        // Random fall speeds
                        speeds[i] = Math.random() * 0.05 + 0.01;
                }

                return { positions, colors, speeds, count };
        }, []);

        useFrame((state, delta) => {
                if (pointsRef.current) {
                        const positions = pointsRef.current.geometry.attributes
                                .position.array as Float32Array;

                        // Update particle positions for matrix rain effect
                        for (let i = 0; i < particles.count; i++) {
                                const i3 = i * 3;

                                // Move particles down
                                positions[i3 + 1] -=
                                        particles.speeds[i] * delta * 60;

                                // Reset particles that have fallen below the view
                                if (positions[i3 + 1] < -10) {
                                        positions[i3 + 1] = 10;
                                        positions[i3] =
                                                (Math.random() - 0.5) * 20;
                                        positions[i3 + 2] =
                                                (Math.random() - 0.5) * 20;
                                }
                        }

                        pointsRef.current.geometry.attributes.position.needsUpdate =
                                true;

                        // Subtle rotation for depth
                        pointsRef.current.rotation.y += delta * 0.1;
                }
        });

        return (
                <Points ref={pointsRef}>
                        <bufferGeometry>
                                <bufferAttribute
                                        attach="attributes-position"
                                        args={[particles.positions, 3]}
                                />
                                <bufferAttribute
                                        attach="attributes-color"
                                        args={[particles.colors, 3]}
                                />
                        </bufferGeometry>
                        <PointMaterial
                                size={0.1}
                                sizeAttenuation={true}
                                vertexColors={true}
                                transparent={true}
                                opacity={0.8}
                                blending={THREE.AdditiveBlending}
                        />
                </Points>
        );
}
