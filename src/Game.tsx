import React, { useEffect, useRef, useState } from "react";
import "./Components/GameBoard"
import GameLogic, { GAME_LOGIC } from "./Classes/GameLogic";
import { WhatTeam } from "./Types";
// import GameBoard from "./Components/GameBoard";

const Game: React.FC = () => {
  const [gameLogic, setGameLogic] = useState<GameLogic | null>(null);

  useEffect(() => {
    GAME_LOGIC.then(setGameLogic);
  }, []);

  const input = useRef<HTMLInputElement>(null);
  const startingTeam = useRef<HTMLSelectElement>(null);

  // To force rerender
  const [_, rerender] = useState(0);

  useEffect(() => {
    if (!gameLogic) return; // Ensure gameLogic is defined
  
    const unsubscribe = gameLogic.onUpdate(() => {
      rerender((_) => _ + 1); // forces rerender
    });
  
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [gameLogic]);

  const handleCheck = async () => {
    const val = input.current?.value.trim();
    const startingTeamVal = startingTeam.current?.value;
    if (!val) return;

    gameLogic?.checkAnswer(val, startingTeamVal as WhatTeam);
    if (input.current)
      input.current.value = "";
  };

  return (
    <div>
      <h1>{gameLogic?.currentQuestion.question}</h1>
      <ol>
        {gameLogic?.currentQuestion.answers.map((answer, index) => (
          <li key={index}>{index + 1}. {answer.revealed ? answer.code : "_"} - { answer.revealed ? answer.score : ""} | Reaveled By {answer.revealedByTeam}</li>
        ))}
      </ol>
      <h3>Points: {gameLogic?.currentRound.points}</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        {(gameLogic?.startingTeam === WhatTeam.TO_BE_DETERMINED) && (
          <select ref={startingTeam}>
            <option value={WhatTeam.TEAM1}>Team 1</option>
            <option value={WhatTeam.TEAM2}>Team 2</option>
          </select>
        )}
        <input ref={input} type="text" />
        <button type="submit" onClick={handleCheck}>Check</button>
      </form>
      <h3>Faza pytania: {gameLogic?.currentPhase}</h3>
      <h2>Druzyny:</h2>
      <ol>
        <li>Team1{gameLogic?.currentTeam === WhatTeam.TEAM1 && "(current)"}:
          <ol>
            <li> Punkty: {gameLogic?.team1.getScore()}</li>
            <li> Xs: {gameLogic?.team1.getXs()}</li>
            <li> Mozliwe Xy: {gameLogic?.team1.getMaxXs()}</li>
          </ol>
        </li>
        <li>Team2{gameLogic?.currentTeam === WhatTeam.TEAM2 && "(current)"}:
          <ol>
            <li> Punkty: {gameLogic?.team2.getScore()}</li>
            <li> Xs: {gameLogic?.team2.getXs()}</li>
            <li> Mozliwe Xy: {gameLogic?.team2.getMaxXs()}</li>
          </ol>
        </li>
      </ol>
    </div>
    // <GameBoard question={GAME_LOGIC.currentQuestion}/>
  );
};

export default Game;