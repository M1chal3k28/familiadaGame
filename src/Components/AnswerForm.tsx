import { useRef } from "react";
import { WhatTeam, AnswerFormProps } from "../Types";

const AnswerForm: React.FC<AnswerFormProps> = ({gameLogic}: AnswerFormProps) => {
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

    return (
        <form onSubmit={(e) => e.preventDefault()} className="form">
            {(gameLogic?.startingTeam === WhatTeam.TO_BE_DETERMINED) && (
            <select ref={startingTeam}>
                <option value={WhatTeam.TEAM1}>{gameLogic?.team1.getName}</option>
                <option value={WhatTeam.TEAM2}>{gameLogic?.team2.getName}</option>
            </select>
            )}
            <input ref={input} type="text" />
            <button type="submit" className="bg-gray-200" onClick={handleCheck}>Check</button>
        </form>
    );
};

export default AnswerForm;