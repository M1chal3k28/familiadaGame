import React, { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PLAY_PATH } from "../PathConfig";

import Particles from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
  tsParticles,
} from "@tsparticles/engine";

const MainMenu: React.FC = () => {
    const navigate = useNavigate();
    const handlePlay = () => {
        navigate(PLAY_PATH);
    };

    const handleGithub = () => {
        location.href = "https://github.com/M1chal3k28/familiadaGame";
    };

    // Set up tsparticles
    let particlesContainer: ReturnType<typeof tsParticles.domItem>
    const particlesLoaded = async (container?: Container): Promise<void> => {
        console.log(container);
    };

    const options: ISourceOptions = useMemo(
        () => ({
        background: {
            color: {
            value: "#000",
            },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
            },
            modes: {
            push: {
                quantity: 4,
            },
            repulse: {
                distance: 200,
                duration: 0.4,
            },
            },
        },
        particles: {
            color: {
                value: "#A0A0A0",
            },
            links: {
                color: "#A0A0A0",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            move: {
                direction: MoveDirection.none,
                enable: true,
                outModes: {
                    default: OutMode.out,
                },
                random: false,
                speed: 6,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,
        }),
        [],
    );

    const toggleBgMovementButton = useRef<HTMLButtonElement>(null);
    const toggleBgReactionButton = useRef<HTMLButtonElement>(null);
    const toggleBgMovement = () => {
        if (!particlesContainer) particlesContainer = tsParticles.domItem(0);

        toggleBgMovementButton?.current?.classList.toggle("line-through");

        const options = particlesContainer?.options;
        options!.particles.move.enable = !options?.particles.move.enable;
        particlesContainer!.refresh();
    };

    const toggleBgReaction = () => {
        if (!particlesContainer) particlesContainer = tsParticles.domItem(0);

        toggleBgReactionButton?.current?.classList.toggle("line-through");

        const options = particlesContainer?.options;
        options!.interactivity.events.onClick.enable = !options!.interactivity.events.onClick.enable; 
        options!.interactivity.events.onHover.enable = !options!.interactivity.events.onHover.enable; 
        particlesContainer!.refresh();
    };

    return ( 
    <section className="h-screen w-screen flex justify-center flex-col font-[PixelFont]">
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
            className="-z-10"
        />
        
        <header className="w-full h-1/3 flex justify-center items-center boardTextSize text-white">
            <h1>FAMILIADA <sub className="myTextSize">The Game</sub></h1>
        </header>
        <main className="w-full h-2/3 flex gap-y-10 items-center flex-col align-middle">
            <button type="button" className="menuButton boardTextSize" onClick={handlePlay}>Play</button>
            <button type="button" className="menuButton boardTextSize" onClick={handleGithub}>GITHUB</button>
        </main>
        <footer className="w-full fixed bottom-0 box-border flex flex-row"> 
            <button type="button" ref={toggleBgMovementButton} className="menuButton w-fit flex ml-3" onClick={toggleBgMovement}>Background Movement</button>
            <button type="button" ref={toggleBgReactionButton} className="menuButton w-fit flex ml-3" onClick={toggleBgReaction}>Mouse Reaction</button>
        </footer>
    </section>
    );
};

export default MainMenu;