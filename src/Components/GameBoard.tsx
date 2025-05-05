import { BoardGameProps } from "../Types";
import "./AnswerForm"
import AnswerForm from "./AnswerForm";

const GameBoard: React.FC<BoardGameProps> = ({ gameLogic }: BoardGameProps) => {
    return (
        <section className="h-screen w-screen bg-gradient-to-r from-blue-900 to-red-900 font-[PixelFont]">
            <h1 className="bg-black p-4 text-white flex justify-center text-3xl">{gameLogic?.currentRound.question.question}</h1>
            <section className="flex justify-between h-full">
                <section className="flex flex-col items-start">
                    <h1 className="bg-black p-4 text-white flex justify-center text-3xl rounded-br-md">{gameLogic?.team1.getName}</h1>
                    <h1 className="bg-black p-4 text-green-700 flex justify-center text-3xl rounded-br-md">{gameLogic?.team1.getScore}</h1>
                </section>

                <section className="w-[75%] h-full flex flex-col justify-center items-center">
                    <section className="bg-black w-full h-[75%] rounded-md">

                    </section>
                    <AnswerForm gameLogic={gameLogic!} />
                </section>

                <section className="flex flex-col items-end">
                    <h1 className="bg-black p-4 text-white flex justify-center text-3xl rounded-bl-md">{gameLogic?.team2.getName}</h1>
                    <h1 className="bg-black p-4 text-green-700 flex justify-center text-3xl rounded-bl-md">{gameLogic?.team2.getScore}</h1>
                </section>
            </section>
        </section>
    );
}

export default GameBoard