import { Answer, BoardGameProps } from "../Types";
import "./AnswerForm"
import AnswerForm from "./AnswerForm";
import { WhatTeam, TeamInfoProps, TeamXsProps } from "../Types";
import Team from "../Classes/Team";
import clsx from "clsx";
import { useMemo } from "react";

const TeamInfo: React.FC<TeamInfoProps> = ({ team, side }: TeamInfoProps) => {
    const isLeft = useMemo(() => side === "left", [side]);
    const isRight = useMemo(() => side === "right", [side]);

    return (
        <section className={clsx("flex flex-col", { "items-start": isLeft, "items-end": isRight})}>
            <h1 className={clsx("bg-black p-3 text-white flex justify-center text-5xl", { "rounded-br-md": isLeft, "rounded-bl-md": isRight })}>{team?.getName}</h1>
            <h1 className={clsx("bg-black p-3 text-green-700 flex justify-center text-5xl", { "rounded-br-md": isLeft, "rounded-bl-md": isRight })}>{team?.getScore}</h1>
        </section>
    );
}

const TeamXs: React.FC<TeamXsProps> = ({ team }: TeamXsProps) => {
    return (
        <section className="flex flex-col h-full ml-5">
            {[...Array(team?.getXs)].map((_, i) => (
                <div key={i} className="flex-1 flex items-center justify-center">
                    <p className="text-green-700 text-9xl">X</p>
                </div>
            ))}
        </section>
    )
}

const GameBoard: React.FC<BoardGameProps> = ({ gameLogic }: BoardGameProps) => {
    const isTeam1turn = useMemo(() => gameLogic?.currentTeam === WhatTeam.TEAM1, [gameLogic?.currentTeam]);
    const isTeam2turn = useMemo(() => gameLogic?.currentTeam === WhatTeam.TEAM2, [gameLogic?.currentTeam]);
    const isToBeDetermined = useMemo(() => gameLogic?.currentTeam === WhatTeam.TO_BE_DETERMINED, [gameLogic?.currentTeam]);

    return (
        <section className={
            clsx(
                {
                    'h-screen w-screen font-[PixelFont] bg-gradient-to-r': true, 
                    'from-blue-900': isTeam1turn || isToBeDetermined,
                    'to-red-900':   isTeam2turn || isToBeDetermined,
                    'from-blue-200': isTeam2turn,
                    'to-red-200':   isTeam1turn,
                }
            )}>
            <h1 className="bg-black p-4 text-white flex justify-center text-6xl">{gameLogic?.currentRound.question.question}</h1>
            <section className="flex justify-between h-full">
                <TeamInfo team={gameLogic?.team1} side="left" />

                <section className="w-[70%] h-full flex flex-col justify-center items-center">
                    <section className="bg-black w-full h-[75%] rounded-md flex justify-center p-10">
                        <TeamXs team={gameLogic?.team1} />
                        <table className="text-green-700 w-full text-7xl">
                            <tbody>
                                {gameLogic?.currentRound.question.answers.map((answer: Answer, index: number) => (
                                    <tr key={index + 1}>
                                        <td className="p-2 w-[10%]">{index + 1}.</td>
                                        <td className="p-2 w-[70%]">{answer.revealed ? answer.code : ".".repeat(gameLogic.currentQuestion.questionMeta.longestAnswer)}</td>
                                        <td className="p-2 w-[20%] text-right">{answer.revealed ? answer.score : "#".repeat(2)}</td>
                                    </tr>
                                ))}

                                <tr key={0} className="text-right">
                                    <td colSpan={3}>Suma: {gameLogic?.currentRound.points}</td>
                                </tr>
                            </tbody>
                        </table>
                        <TeamXs team={gameLogic?.team2} />
                    </section>
                    <AnswerForm gameLogic={gameLogic!} />
                </section>

                <TeamInfo team={gameLogic?.team2} side="right" />
            </section>
        </section>
    );
}

export default GameBoard