"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import MatrixRain from "../3d/MatrixRain";
import TypingAnimation from "../ui/TypingAnimation";

export default function HeroSection() {
        const heroRef = useRef<HTMLDivElement>(null);
        const titleRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
                if (titleRef.current) {
                        // Initial animation for the title
                        gsap.fromTo(
                                titleRef.current,
                                { opacity: 0, y: 50 },
                                {
                                        opacity: 1,
                                        y: 0,
                                        duration: 1,
                                        delay: 0.5,
                                        ease: "power3.out",
                                }
                        );
                }
        }, []);

        return (
                <section
                        ref={heroRef}
                        className="relative h-screen w-full overflow-hidden"
                >
                        {/* 3D Background */}
                        <div className="absolute inset-0 z-0">
                                <Canvas
                                        camera={{
                                                position: [0, 0, 5],
                                                fov: 75,
                                        }}
                                        className="w-full h-full"
                                >
                                        <ambientLight intensity={0.1} />
                                        <pointLight
                                                position={[10, 10, 10]}
                                                intensity={0.3}
                                        />

                                        {/* Matrix rain effect */}
                                        <MatrixRain />

                                        {/* Stars background */}
                                        <Stars
                                                radius={100}
                                                depth={50}
                                                count={2000}
                                                factor={4}
                                                saturation={0}
                                                fade
                                                speed={1}
                                        />

                                        {/* Enable mouse interaction */}
                                        <OrbitControls
                                                enableZoom={false}
                                                enablePan={false}
                                                enableRotate={true}
                                                autoRotate={true}
                                                autoRotateSpeed={0.5}
                                                rotateSpeed={0.1}
                                        />
                                </Canvas>
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                                <div ref={titleRef} className="max-w-4xl">
                                        <div className="mb-8">
                                                <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-[var(--terminal-green)] to-[var(--terminal-blue)] bg-clip-text text-transparent">
                                                        Developer
                                                </h1>
                                                <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-[var(--terminal-orange)] to-[var(--terminal-purple)] bg-clip-text text-transparent">
                                                        Terminal
                                                </h1>
                                        </div>

                                        <div className="font-mono text-xl md:text-2xl mb-8">
                                                <TypingAnimation
                                                        text="Aariz Sheikh - Full-Stack Developer"
                                                        className="text-white"
                                                />
                                        </div>

                                        <div className="font-mono text-sm md:text-base text-[var(--code-comment)] max-w-2xl mx-auto">
                                                <span className="text-[var(--code-keyword)]">
                                                        {/* /** */}
                                                </span>
                                                <br />
                                                <span className="text-[var(--code-comment)]">
                                                        {" "}
                                                        * Welcome to my digital
                                                        environment
                                                </span>
                                                <br />
                                                <span className="text-[var(--code-comment)]">
                                                        {" "}
                                                        * Scroll to explore my
                                                        repositories
                                                </span>
                                                <br />
                                                <span className="text-[var(--code-keyword)]">
                                                        {" "}
                                                        */
                                                </span>
                                        </div>
                                </div>

                                {/* Scroll indicator */}
                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                                        <div className="animate-bounce">
                                                <div className="w-6 h-10 border-2 border-[var(--terminal-green)] rounded-full flex justify-center">
                                                        <div className="w-1 h-3 bg-[var(--terminal-green)] rounded-full mt-2 animate-pulse"></div>
                                                </div>
                                        </div>
                                        <p className="font-mono text-xs text-[var(--code-comment)] mt-2">
                                                scroll
                                        </p>
                                </div>
                        </div>
                </section>
        );
}
