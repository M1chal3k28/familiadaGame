import { tsParticles } from "@tsparticles/engine";
import { useRef } from "react";
import { useSettings } from "../../SettingsContext";
import { MENU_PATH } from "../../PathConfig";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const SettingsMenu: React.FC = () => {
    const toggleBgMovementButton = useRef<HTMLButtonElement>(null);
    const toggleBgReactionButton = useRef<HTMLButtonElement>(null);
    let particlesContainer: ReturnType<typeof tsParticles.domItem>

    const { particlesMovement, particlesMouseReaction, toggleParticlesMovement, toggleParticlesMouseReaction } = useSettings()!;
    const toggleBgMovement = () => {
        if (!particlesContainer) particlesContainer = tsParticles.domItem(0);

        toggleBgMovementButton?.current?.classList.toggle("line-through");

        toggleParticlesMovement();
        particlesContainer!.refresh();
    };

    const toggleBgReaction = () => {
        if (!particlesContainer) particlesContainer = tsParticles.domItem(0);

        toggleBgReactionButton?.current?.classList.toggle("line-through");

        toggleParticlesMouseReaction();
        particlesContainer!.refresh();
    };

    const navigate = useNavigate();
    const backToMenu = () => {
        navigate(MENU_PATH);
    };
    
    return (
        <>
            <header className="menuHeader">
                <h1>SETTINGS</h1>
            </header>
            <main className="menuMain">
                <button type="button" ref={toggleBgMovementButton} 
                    className={clsx("menuButton boardTextSize w-fit flex ml-3", { "line-through": !particlesMovement })} onClick={toggleBgMovement}
                >Background Movement</button>
                <button type="button" ref={toggleBgReactionButton} 
                    className={clsx("menuButton boardTextSize w-fit flex ml-3", { "line-through": !particlesMouseReaction })} onClick={toggleBgReaction}
                >Mouse Reaction</button>
                <button type="button" className="menuButton boardTextSize w-fit flex ml-3" onClick={backToMenu}>BACK</button>
            </main>
        </>
    )
};

export default SettingsMenu;