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

    if (gameLogic?.gameState === GameState.RUNNING) return (
        <form onSubmit={(e) => e.preventDefault()} className="form">
            {(gameLogic?.startingTeam === WhatTeam.TO_BE_DETERMINED) && (
            <select ref={startingTeam}>
                <option value={WhatTeam.TEAM1}>{gameLogic?.team1.getName}</option>
                <option value={WhatTeam.TEAM2}>{gameLogic?.team2.getName}</option>
            </select>
            )}
            <input ref={input} type="text" />
            <button type="submit" className="bg-gray-200 h-full" onClick={handleCheck}>Check</button>
            <button type="button" className="bg-gray-200 h-full" onClick={handleUndo} {...(gameLogic?.canUndo ? {} : {disabled: true})} >Undo</button>
            <button type="button" className="bg-gray-200 h-full" onClick={handleRedo} {...(gameLogic?.canRedo ? {} : {disabled: true})} >Redo</button>
        </form>
    );
    else if (gameLogic?.gameState === GameState.FINISHED_QUESTION_WAITING_FOR_NEXT_ROUND) return (
        <form onSubmit={(e) => e.preventDefault()} className="form">
            <button type="submit" className="bg-gray-200 h-full" onClick={handleContinue}>Continue</button>
            <button type="button" className="bg-gray-200 h-full" onClick={handleUndo} {...(gameLogic?.canUndo ? {} : {disabled: true})} >Undo</button>
            <button type="button" className="bg-gray-200 h-full" onClick={handleRedo} {...(gameLogic?.canRedo ? {} : {disabled: true})} >Redo</button>
        </form>
    )
};

export default ControlPanel;