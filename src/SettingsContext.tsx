import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Settings = {
    particlesMovement: boolean;
    particlesMouseReaction: boolean;

    toggleParticlesMovement: () => void;
    toggleParticlesMouseReaction: () => void;
};

type StoredSettings = {
    particlesMovement: boolean;
    particlesMouseReaction: boolean;
}

const defaultSettings: StoredSettings = {
    particlesMouseReaction: true,
    particlesMovement: true,

    // toggleParticlesMouseReaction: () => {},
    // toggleParticlesMovement: () => {}
};

export const loadSettingsFromLocalStorage = (): StoredSettings => {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
        try {
            const parsedSettings = JSON.parse(storedSettings);
            return {
                particlesMovement: parsedSettings.particlesMovement,
                particlesMouseReaction: parsedSettings.particlesMouseReaction
            };
        } catch (error) {
            console.warn('Error parsing stored settings:', error, "Using default settings.");
        }
    }
    return defaultSettings;
};

export const saveSettingsToLocalStorage = (settings: StoredSettings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
};

const SettingsContext = createContext<Settings | undefined>(undefined);

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
    const initialSettings = loadSettingsFromLocalStorage();

    const [particlesMovement, setParticlesMovement] = useState(initialSettings.particlesMovement);
    const [particlesMouseReaction, setParticlesMouseReaction] = useState(initialSettings.particlesMouseReaction);

    const toggleParticlesMovement = () => setParticlesMovement(!particlesMovement);
    const toggleParticlesMouseReaction = () => setParticlesMouseReaction(!particlesMouseReaction);

    useEffect(() => {
        saveSettingsToLocalStorage({
            particlesMovement,
            particlesMouseReaction
        });
    }, [particlesMovement, particlesMouseReaction]);

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
