import React, { useEffect, useReducer, useState } from "react";
import "./Components/GameBoard"
import GameLogic from "./Classes/GameLogic";
// import { WhatTeam } from "./Types";
import GameBoard from "./Components/GameBoard";
import { useSettings } from "./SettingsContext";
import { prepareQuestions } from "./services/QuestionService";
// import "./Components/ControlPanel"
// import ControlPanel from "./Components/ControlPanel";

const Game: React.FC = () => {
  const questions = useSettings()!.questions;

  // Load game logic
  const [gameLogic] = useState<GameLogic>(new GameLogic(prepareQuestions(questions)));

  // To force rerender
  const [_, forceRerender] = useReducer((x) => x + 1, 0);
  // Add event listener to game logic
  useEffect(() => {
    if (!gameLogic) return; // Ensure gameLogic is defined
  
    const unsubscribe = gameLogic.onUpdate(() => {
      forceRerender(); // forces rerender
    });
  
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [gameLogic]);

  return (
    <>
      <GameBoard gameLogic={gameLogic!} />
      {/* <div>
        <h1>{gameLogic?.currentQuestion.question}</h1>
        <ol>
          {gameLogic?.currentQuestion.answers.map((answer, index) => (
            <li key={index}>{index + 1}. {answer.revealed ? answer.code : "_"} - { answer.revealed ? answer.score : ""} | Reaveled By {answer.revealedByTeam}</li>
          ))}
        </ol>
        <h3>Points: {gameLogic?.currentRound.points}</h3>
        <ControlPanel gameLogic={gameLogic!} />
        <h3>Faza pytania: {gameLogic?.currentPhase}</h3>
        <h2>Druzyny:</h2>
        <ol>
          <li>Team1{gameLogic?.currentTeam === WhatTeam.TEAM1 && "(current)"}:
            <ol>
              <li> Punkty: {gameLogic?.team1.getScore}</li>
              <li> Xs: {gameLogic?.team1.getXs}</li>
              <li> Mozliwe Xy: {gameLogic?.team1.getMaxXs}</li>
            </ol>
          </li>
          <li>Team2{gameLogic?.currentTeam === WhatTeam.TEAM2 && "(current)"}:
            <ol>
              <li> Punkty: {gameLogic?.team2.getScore}</li>
              <li> Xs: {gameLogic?.team2.getXs}</li>
              <li> Mozliwe Xy: {gameLogic?.team2.getMaxXs}</li>
            </ol>
          </li>
        </ol>
      </div> */}
    </>
  );
};

export default Game;