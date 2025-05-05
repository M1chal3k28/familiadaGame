import { Answer, BoardGameProps } from "../Types";
import "./AnswerForm"
import AnswerForm from "./AnswerForm";
import { WhatTeam } from "../Types";
import clsx from "clsx";
import { useMemo } from "react";

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
                <section className="flex flex-col items-start">
                    <h1 className="bg-black p-4 text-white flex justify-center text-4xl rounded-br-md">{gameLogic?.team1.getName}</h1>
                    <h1 className="bg-black p-4 text-green-700 flex justify-center text-7xl rounded-br-md">{gameLogic?.team1.getScore}</h1>
                </section>

                <section className="w-[75%] h-full flex flex-col justify-center items-center">
                    <section className="bg-black w-full h-[75%] rounded-md flex justify-center p-10">
                        <section className="flex flex-col h-full mr-5">
                        {[...Array(gameLogic?.team1.getXs)].map((_, i) => (
                            <div key={i} className="flex-1 flex items-center justify-center">
                                <p className="text-green-700 text-9xl">X</p>
                            </div>
                        ))}
                        </section>
                        <table className="text-green-700 w-full text-7xl">
                            <tbody>
                                {
                                    gameLogic?.currentRound.question.answers.map((answer: Answer, index: number) => (
                                        <tr key={index + 1}>
                                            <td className="p-2 w-[10%]">{index + 1}.</td>
                                            <td className="p-2 w-[70%]">{answer.revealed ? answer.code : ".".repeat(gameLogic.currentQuestion.questionMeta.longestAnswer)}</td>
                                            <td className="p-2 w-[20%] text-right">{answer.revealed ? answer.score : "#".repeat(2)}</td>
                                        </tr>
                                    ))
                                }

                                <tr key={0} className="text-right">
                                    <td colSpan={3}>Suma: {gameLogic?.currentRound.points}</td>
                                </tr>
                            </tbody>
                        </table>
                        <section className="flex flex-col h-full ml-5">
                            {[...Array(gameLogic?.team2.getXs)].map((_, i) => (
                                <div key={i} className="flex-1 flex items-center justify-center">
                                    <p className="text-green-700 text-9xl">X</p>
                                </div>
                            ))}
                        </section>
                    </section>
                    <AnswerForm gameLogic={gameLogic!} />
                </section>

                <section className="flex flex-col items-end">
                    <h1 className="bg-black p-4 text-white flex justify-center text-4xl rounded-bl-md">{gameLogic?.team2.getName}</h1>
                    <h1 className="bg-black p-4 text-green-700 flex justify-center text-7xl rounded-bl-md">{gameLogic?.team2.getScore}</h1>
                </section>
            </section>
        </section>
    );
}

export default GameBoard