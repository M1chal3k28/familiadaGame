import { Answer, BoardGameProps, GameState, Round } from "../Types";
import "./ControlPanel"
import ControlPanel from "./ControlPanel";
import { WhatTeam, TeamInfoProps, TeamXsProps } from "../Types";
import Team from "../Classes/Team";
import clsx from "clsx";
import { useMemo } from "react";
import GameLogic from "../Classes/GameLogic";

const TeamInfo: React.FC<TeamInfoProps> = ({ team, side }: TeamInfoProps) => {
    const isLeft = useMemo(() => side === "left", [side]);
    const isRight = useMemo(() => side === "right", [side]);
    const isTeam1 = useMemo(() => team?.getWhatTeam == WhatTeam.TEAM1, [team]);
    const isTeam2 = useMemo(() => team?.getWhatTeam == WhatTeam.TEAM2, [team]);

    return (
        <section className={clsx("flex flex-col", { "items-start": isLeft, "items-end": isRight})}>
            <h1 className={
                clsx("bg-black p-3 text-white flex justify-center text-5xl", { "rounded-br-md": isLeft, "rounded-bl-md": isRight }, { "text-sky-500": isTeam1, "text-red-900": isTeam2 })
            }>{team?.getName}</h1>
            <h1 className={clsx("bg-black p-3 text-green-700 flex justify-center text-5xl", { "rounded-br-md": isLeft, "rounded-bl-md": isRight })}>{team?.getScore}</h1>
        </section>
    );
}

const TeamXs: React.FC<TeamXsProps> = ({ team, side }: TeamXsProps) => {
    const isLeft = useMemo(() => side === "left", [side]);
    const isRight = useMemo(() => side === "right", [side]);

    return (
        <section className={clsx("flex flex-col h-full", { 'ml-5': isRight, 'mr-5': isLeft })}>
            {[...Array(team?.getXs)].map((_, i) => (
                <div key={i} className="flex-1 flex items-center justify-center">
                    <p className="text-green-700 text-9xl">X</p>
                </div>
            ))}
        </section>
    )
}

type AnswerTableProps = {
    round?: Round;
    gameState?: GameState;
    gameLogic?: GameLogic;
}

const AnswerTable: React.FC<AnswerTableProps> = ({ round, gameState, gameLogic }: AnswerTableProps) => {
    const winner: Team | undefined = useMemo(() => gameLogic?.winningTeam, [gameLogic?.winningTeam]);
    const isWinnerTeam1 = useMemo(() => winner?.getWhatTeam === WhatTeam.TEAM1, [winner]);
    const isWinnerTeam2 = useMemo(() => winner?.getWhatTeam === WhatTeam.TEAM2, [winner]);
    return (
        <>
        {gameState !== GameState.ENDED && (
            <table className="text-green-700 w-full text-7xl">
                <tbody>
                    {gameState === GameState.FINISHED_QUESTION_WAITING_FOR_NEXT_ROUND && (<>
                        {round?.question.answers.map((answer: Answer, index: number) => (
                            <tr key={index + 1} className={clsx({ "text-white": !answer?.revealed })}>
                                <td className="p-2 w-[10%]">{index + 1}.</td>
                                <td className="p-2 w-[70%]">{answer.code}</td>
                                <td className="p-2 w-[20%] text-right">{answer.score}</td>
                            </tr>
                        ))}
                    </>)}
                    {gameState === GameState.RUNNING && (<>
                        {round?.question.answers.map((answer: Answer, index: number) => (
                            <tr key={index + 1}>
                                <td className="p-2 w-[10%]">{index + 1}.</td>
                                <td className="p-2 w-[70%]">{answer.revealed ? answer.code : ".".repeat(10)}</td>
                                <td className="p-2 w-[20%] text-right">{answer.revealed ? answer.score : "#".repeat(2)}</td>
                            </tr>
                        ))}
                    </>)}

                    <tr key={0} className="text-right">
                        <td colSpan={3}>Suma: {round?.points}</td>
                    </tr>
                </tbody>
            </table>
        )}
        {gameState === GameState.ENDED && (
            <section className="w-auto bg-black p-3 text-white flex justify-center text-5xl">
                Wygrywa:
                <span className={clsx("ml-2", { "text-team1": isWinnerTeam1, "text-team2": isWinnerTeam2 })}>
                    {winner !== undefined && winner.getName}
                    {winner === undefined && "Nikt"}
                </span>
            </section>
        )}
        </>
    );
};

const GameStatusBanner: React.FC<{ team?: Team, gameState?: GameState, round?: Round, gameLogic?: GameLogic  }> = ({ team, gameState, round, gameLogic }) => {
    const isTeam1 = useMemo(() => team?.getWhatTeam == WhatTeam.TEAM1, [team]);
    const isTeam2 = useMemo(() => team?.getWhatTeam == WhatTeam.TEAM2, [team]);
    const gameIsRunning = useMemo(() => gameState === GameState.RUNNING, [gameState]);
    const gameIsWaitingForNextRound = useMemo(() => gameState === GameState.FINISHED_QUESTION_WAITING_FOR_NEXT_ROUND, [gameState]);
    const gameIsEnded = useMemo(() => gameState === GameState.ENDED, [gameState]);

    return (
        <section className="w-auto bg-black p-3 text-white flex justify-center text-5xl rounded-t-md">
            {gameIsRunning  &&  "Odpowiada:"}
            {gameIsWaitingForNextRound &&  "Wygrywa:"}
            {gameIsEnded && "Koniec Gry !"}

            <span className={clsx("ml-2", {"text-team1": isTeam1, "text-team2": isTeam2})}> 
                {gameIsRunning && (team?.getName)}
                {gameIsWaitingForNextRound && 
                (round?.winner !== WhatTeam.TO_BE_DETERMINED ? gameLogic?.getTeamByWhatTeam(round?.winner)?.getName : "Nikt")
                }
            </span>
        </section>
    );
}

const GameBoard: React.FC<BoardGameProps> = ({ gameLogic }: BoardGameProps) => {
    const isTeam1turn = useMemo(() => gameLogic?.currentTeam === WhatTeam.TEAM1, [gameLogic?.currentTeam]);
    const isTeam2turn = useMemo(() => gameLogic?.currentTeam === WhatTeam.TEAM2, [gameLogic?.currentTeam]);
    const isToBeDetermined = useMemo(() => gameLogic?.currentTeam === WhatTeam.TO_BE_DETERMINED, [gameLogic?.currentTeam]);
    const isGameEnded = useMemo(() => gameLogic?.gameState === GameState.ENDED, [gameLogic?.gameState]);

    return (
        <section className={
            clsx(
                {
                    'h-svh w-screen font-[PixelFont] bg-gradient-to-r box-border overflow-auto': true, 
                    'from-team1': isTeam1turn || isToBeDetermined,
                    'to-team2':   isTeam2turn || isToBeDetermined,
                    'from-team1light': isTeam2turn,
                    'to-team2light':   isTeam1turn,
                }
            )}>
            <section className="flex justify-between">
                <TeamInfo team={gameLogic?.team1} side="left" />
                {!isGameEnded && 
                    <h1 className="bg-black p-4 text-white flex justify-center text-6xl h-fit ml-3 mr-3 rounded-b-md">{gameLogic?.currentRound.question.question}</h1>
                }
                <TeamInfo team={gameLogic?.team2} side="right" />
            </section>

            <section className="w-full h-fit flex flex-col justify-center items-center mt-10">
                <GameStatusBanner team={gameLogic?.getTeamByWhatTeam(gameLogic?.currentTeam)} gameState={gameLogic?.gameState} round={gameLogic?.currentRound} gameLogic={gameLogic!} />
                <section className="bg-black w-[90%] h-[100%] rounded-md flex justify-center p-10 ml-10 mr-10">
                    <TeamXs team={gameLogic?.team1} side="left"/>
                    <AnswerTable round={gameLogic?.currentRound} gameState={gameLogic?.gameState} gameLogic={gameLogic!} />
                    <TeamXs team={gameLogic?.team2} side="right"/>
                </section>
                <ControlPanel gameLogic={gameLogic!} />
            </section>
        </section>
    );
}

export default GameBoard