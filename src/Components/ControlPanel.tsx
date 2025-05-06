import { useRef } from "react";
import { WhatTeam, ControlPanelProps, GameState } from "../Types";

const ControlPanel: React.FC<ControlPanelProps> = ({gameLogic}: ControlPanelProps) => {
    const input = useRef<HTMLInputElement>(null);
    const startingTeam = useRef<HTMLSelectElement>(null);

    // Handle answer check
    const handleCheck = () => {
        const val = input.current?.value.trim();
        const startingTeamVal = startingTeam.current?.value;
        if (!val) return;

        gameLogic?.checkAnswer(val, startingTeamVal as WhatTeam);
        if (input.current)
            input.current.value = "";
    };

    const handleContinue = () => {
        gameLogic?.continueToNextPhase();
    }

    const handleUndo = () => {
        gameLogic?.undoAction();
    }

    const handleRedo = () => {
        gameLogic?.redo();
    }

    const handleRestart = () => {
        
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className="form box-border">
            {/** When starting team must be set */}
            {gameLogic?.gameState === GameState.RUNNING && gameLogic?.startingTeam === WhatTeam.TO_BE_DETERMINED && (
            <select ref={startingTeam} className="btn">
                <option value={WhatTeam.TEAM1}>{gameLogic?.team1.getName}</option>
                <option value={WhatTeam.TEAM2}>{gameLogic?.team2.getName}</option>
            </select>
            )}
            
            {/** When game is running */}
            {gameLogic?.gameState === GameState.RUNNING && (
            <>
                <input ref={input} type="text" className="input" placeholder="Answer..." />
                <button type="submit" className="btn h-full" onClick={handleCheck}>Check</button>
            </>
            )}

            {/** When game is waiting for continue */}
            {gameLogic?.gameState === GameState.FINISHED_QUESTION_WAITING_FOR_NEXT_ROUND && (
                <button type="submit" className="btn h-full" onClick={handleContinue}>Continue</button>
            )}
            
            {/** When game is finished */}
            {gameLogic?.gameState === GameState.ENDED && (
                <button type="submit" className="btn h-full" onClick={handleRestart}>Restart Game</button>
            )}

            <button type="button" className="btn h-full" onClick={handleUndo} {...(gameLogic?.canUndo ? {} : {disabled: true})}>Undo</button>
            <button type="button" className="btn h-full" onClick={handleRedo} {...(gameLogic?.canRedo ? {} : {disabled: true})}>Redo</button>
        </form>
    );
};

export default ControlPanel;