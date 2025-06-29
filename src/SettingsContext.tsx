import { createContext, useContext, useState, ReactNode } from 'react';

type Settings = {
    particlesMovement: boolean;
    particlesMouseReaction: boolean;

    toggleParticlesMovement: () => void;
    toggleParticlesMouseReaction: () => void;
};

const defaultSettings: Settings = {
    particlesMouseReaction: true,
    particlesMovement: true,

    toggleParticlesMouseReaction: () => {},
    toggleParticlesMovement: () => {}
};

const SettingsContext = createContext<Settings>(defaultSettings);

export const useSettings = () => useContext(SettingsContext);

type SettingsProviderProps = {
    children: ReactNode;
};

/**
 * A context provider for game settings
 *
 * @param {{ children: ReactNode }} props
 * @returns {JSX.Element}
 */
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }: SettingsProviderProps) => {
    const [particlesMovement, setParticlesMovement] = useState(true);
    const [particlesMouseReaction, setParticlesMouseReaction] = useState(true);

    const toggleParticlesMovement = () => setParticlesMovement(!particlesMovement);
    const toggleParticlesMouseReaction = () => setParticlesMouseReaction(!particlesMouseReaction);

    return (
        <SettingsContext value={{
            particlesMovement,
            particlesMouseReaction,

            toggleParticlesMovement,
            toggleParticlesMouseReaction
        }}>
            {children}
        </SettingsContext>
    );
};
