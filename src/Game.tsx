import React, { useEffect, useRef, useState } from "react";
import "./Components/GameBoard"
import { GAME_LOGIC } from "./Classes/GameLogic";
import { WhatTeam } from "./Types";
import GameBoard from "./Components/GameBoard";

const Game: React.FC = () => {
  const input = useRef<HTMLInputElement>(null);
  const startingTeam = useRef<HTMLSelectElement>(null);

  // To force rerender
  const [_, rerender] = useState(0);

  useEffect(() => {
    const unsubscribe = GAME_LOGIC.onUpdate(() => {
      rerender((_) => _ + 1); // forces rerender
    });
    return unsubscribe;
  }, []);

  const handleCheck = () => {
    const val = input.current?.value.trim();
    const startingTeamVal = startingTeam.current?.value;
    if (!val) return;
    GAME_LOGIC.checkAnswer(val, startingTeamVal as WhatTeam);
    if (input.current)
      input.current.value = "";
  };

  return (
    <div>
      <h1>{GAME_LOGIC.currentQuestion.question}</h1>
      <ol>
        {GAME_LOGIC.currentQuestion.answers.map((answer, index) => (
          <li key={index}>{index + 1}. {answer.revealed ? answer.code : "_"} - { answer.revealed ? answer.score : ""} | Reaveled By {answer.reaveledByTeam}</li>
        ))}
      </ol>
      <h3>Points: {GAME_LOGIC.currentRound.points}</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        {(GAME_LOGIC.startingTeam === WhatTeam.TO_BE_DETERMINED) && (
          <select ref={startingTeam}>
            <option value={WhatTeam.TEAM1}>Team 1</option>
            <option value={WhatTeam.TEAM2}>Team 2</option>
          </select>
        )}
        <input ref={input} type="text" />
        <button type="submit" onClick={handleCheck}>Check</button>
      </form>
      <h3>Faza pytania: {GAME_LOGIC.currentPhase}</h3>
      <h2>Druzyny:</h2>
      <ol>
        <li>Team1{GAME_LOGIC.currentTeam === WhatTeam.TEAM1 && "(current)"}:
          <ol>
            <li> Punkty: {GAME_LOGIC.team1.getScore()}</li>
            <li> Xs: {GAME_LOGIC.team1.getXs()}</li>
            <li> Mozliwe Xy: {GAME_LOGIC.team1.getMaxXs()}</li>
          </ol>
        </li>
        <li>Team2{GAME_LOGIC.currentTeam === WhatTeam.TEAM2 && "(current)"}:
          <ol>
            <li> Punkty: {GAME_LOGIC.team2.getScore()}</li>
            <li> Xs: {GAME_LOGIC.team2.getXs()}</li>
            <li> Mozliwe Xy: {GAME_LOGIC.team2.getMaxXs()}</li>
          </ol>
        </li>
      </ol>
    </div>
    // <GameBoard question={GAME_LOGIC.currentQuestion}/>
  );
};

export default Game;