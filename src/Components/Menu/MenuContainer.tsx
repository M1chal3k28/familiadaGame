import React, { useMemo } from "react";
import { Outlet } from "react-router-dom";

import Particles from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import { useSettings } from "../../SettingsContext";

const MenuContainer: React.FC = () => {
    // Set up tsparticles
    const particlesLoaded = async (container?: Container): Promise<void> => {
        () => container;
    };

    const { particlesMovement, particlesMouseReaction } = useSettings()!;
    
    const options: ISourceOptions = useMemo(
        () => ({
        background: {
            color: {
            value: "#000",
            },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onClick: {
                    enable: particlesMouseReaction,
                    mode: "push",
                },
                onHover: {
                    enable: particlesMouseReaction,
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
                enable: particlesMovement,
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
                limit: {
                    mode: "delete",
                    value: 150,
                },
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
        [particlesMouseReaction, particlesMovement],
    );

    return ( 
    <section className="h-screen w-screen flex flex-start flex-col font-[PixelFont]">
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
            className="-z-10"
        />
        
        <Outlet/>
        <footer className="menuFooter"> 
            <p>In development | &copy; {new Date().getFullYear()}</p>
            <p>using <a href="https://particles.js.org/" target="_blank" className="underline">tsParticles</a></p>
        </footer>
    </section>
    );
};

export default MenuContainer;