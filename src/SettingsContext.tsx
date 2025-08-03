import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Question, QuestionType } from './Types';

type Settings = {
    particlesMovement: boolean;
    particlesMouseReaction: boolean;
    questions: Question[];

    toggleParticlesMovement: () => void;
    toggleParticlesMouseReaction: () => void;
    setQuestions: (questions: Question[]) => void;
};

type StoredSettings = {
    particlesMovement: boolean;
    particlesMouseReaction: boolean;
    questions: Question[];
}

const defaultQuestions: Question[] = [
    {
        id: 1,
        type: QuestionType.NORMAL,
        question: "Example question",
        answers: [
            { code: "Answer1", score: 15 },
            { code: "Remove question using the X button", score: 1 },
            { code: "Edit question using the pencil button", score: 2 }
        ]
    }
];

const defaultSettings: StoredSettings = {
    particlesMouseReaction: true,
    particlesMovement: true,
    questions: defaultQuestions
    

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
                particlesMouseReaction: parsedSettings.particlesMouseReaction,
                questions: parsedSettings.questions
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
    const [questions, setQuestions] = useState(initialSettings.questions);

    const toggleParticlesMovement = () => setParticlesMovement(!particlesMovement);
    const toggleParticlesMouseReaction = () => setParticlesMouseReaction(!particlesMouseReaction);

    useEffect(() => {
        saveSettingsToLocalStorage({
            particlesMovement,
            particlesMouseReaction,
            questions
        });
    }, [particlesMovement, particlesMouseReaction, questions]);

    return (
        <SettingsContext value={{
            particlesMovement,
            particlesMouseReaction,
            questions,

            toggleParticlesMovement,
            toggleParticlesMouseReaction,
            setQuestions
        }}>
            {children}
        </SettingsContext>
    );
};
