import React from "react";
import { Answer, Question } from "../../../Types";
import "./QuestionPanel.css";
import Draggable from "react-draggable";

type QuestionBlockProps = {
    question: Question
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({question}) => {
    const answers = question.answers.map((answer: Answer, index) => (
        <div key={index} className="flex justify-between gap-2 text-boardLcd">
            <div title={answer.code} className="cursor-help w-8/12 overflow-hidden">&rarr; {answer.code.length > 5 ? answer.code.slice(0, 5) + "..." : answer.code}</div>
            <div className="w-4/12 text-right">{answer.score}🪙</div>
        </div>
    ));

    const ref = React.useRef(null);

    const handleStopDragging = (e: any) => {
        console.log(e);
    };

    return (
        <Draggable
        axis="x"
        handle=".handle"
        scale={1.01}
        nodeRef={ref}
        onStop={handleStopDragging}
        bounds={{top: -100, left: -100, right: 100, bottom: 100}}>
            <div ref={ref} className="questionBlock menuSmallerTextSize handle">
                <div className="flex justify-between mb-5">
                    <p className="w-10/12">💬 {question.question} 💬</p>
                    <p className="w-2/12 text-right"># {question.id}</p>
                </div>
                <hr className="border-2 rounded"/>
                <div className="mt-5">
                    <div className="grid grid-cols-2 grid-flow-dense gap-6 w-full">
                        {answers}
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export default QuestionBlock;