import { BoardGameProps } from "../Types";

const GameBoard: React.FC<BoardGameProps> = ({ question }: BoardGameProps) => {

    return (
        <section className="h-screen w-screen bg-gradient-to-r from-blue-900 to-red-900">
            <h1 className="bg-black p-4 text-white flex justify-center text-3xl">{question.question}</h1>
            <section className="flex justify-between h-full">
                <section className="flex flex-col items-start">
                    <h1 className="bg-black p-4 text-white flex justify-center text-3xl rounded-br-md">Druzyna 1</h1>
                    <h1 className="bg-black p-4 text-green-700 flex justify-center text-3xl rounded-br-md">123</h1>
                </section>

                <section className="w-[50%] h-full flex justify-center items-center">
                    <section className="bg-black w-full h-[50%] rounded-md"></section>
                </section>

                <section className="flex flex-col items-end">
                    <h1 className="bg-black p-4 text-white flex justify-center text-3xl rounded-bl-md">Druzyna 2</h1>
                    <h1 className="bg-black p-4 text-green-700 flex justify-center text-3xl rounded-bl-md">78</h1>
                </section>
            </section>
        </section>
    );
}

export default GameBoard