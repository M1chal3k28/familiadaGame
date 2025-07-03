import { QUESTIONS_PANEL, SETTINGS_PATH } from "../../PathConfig";
import { useNavigate } from "react-router-dom";

const MainMenu: React.FC = () => {
    const navigate = useNavigate();
    const handleStart = () => {
        navigate(QUESTIONS_PANEL);
    };

    const handleGithub = () => {
        location.href = "https://github.com/M1chal3k28/familiadaGame";
    };

    const handleSettings = () => {
        navigate(SETTINGS_PATH);
    }

    return (
        <>
            <header className="menuHeader">
                <h1>FAMILIADA <sub className="myTextSize">The Game</sub></h1>
            </header>
            <main className="menuMain">
                <button type="button" className="menuButton boardTextSize" onClick={handleStart}>Start</button>
                <button type="button" className="menuButton boardTextSize" onClick={handleSettings}>Settings</button>
                <button type="button" className="menuButton boardTextSize" onClick={handleGithub}>GITHUB</button>
            </main>
        </>
    )
};

export default MainMenu;