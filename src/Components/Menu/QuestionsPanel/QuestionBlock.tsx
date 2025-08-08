import React from "react";
import { Answer, Question } from "../../../Types";
import "./QuestionPanel.css";

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
    return (
        <div className="questionBlock menuSmallerTextSize">
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
    );
};

export default QuestionBlock;