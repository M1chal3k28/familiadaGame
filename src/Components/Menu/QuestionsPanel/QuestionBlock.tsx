import React from "react";
import { Answer, Question } from "../../../Types";
import "./QuestionPanel.css";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

type QuestionBlockProps = {
    question: Question,
    onRemove: (id: number) => void,
    onEdit: (id: number) => void
}

const questionBlockDragBounds = {
    top: -100,
    right: 100,
    bottom: 100,
    left: -100
};
const percantageToMakeActionOnDrag = 0.75;

const QuestionBlock: React.FC<QuestionBlockProps> = ({question, onRemove}) => {
    const answers = question.answers.map((answer: Answer, index) => (
        <div key={index} className="flex justify-between gap-2 text-boardLcd">
            <div title={answer.code} className="cursor-help w-8/12 overflow-hidden">&rarr; {answer.code.length > 5 ? answer.code.slice(0, 5) + "..." : answer.code}</div>
            <div className="w-4/12 text-right">{answer.score}🪙</div>
        </div>
    ));

    const ref = React.useRef<HTMLDivElement>(null);
    const questionBlockDeleteRef = React.useRef<HTMLDivElement>(null);
    const questionBlockEditRef = React.useRef<HTMLDivElement>(null);
    const [ questionBlockPossiton, setQuestionBlockPossiton ] = React.useState({ x: 0, y: 0 });
    const [ questionBlockDelta, setQuestionBlockDelta ] = React.useState({ x: 0, y: 0 });

    const handleDrag = (_: DraggableEvent, ui: DraggableData) => {
        const {x, y} = questionBlockDelta;
        setQuestionBlockDelta({
            x: x + ui.deltaX,
            y: y + ui.deltaY,
        });

        if (questionBlockDelta.x <= questionBlockDragBounds.left * percantageToMakeActionOnDrag) {
            questionBlockDeleteRef.current?.classList.remove("hidden");
        } else if (questionBlockDelta.x >= questionBlockDragBounds.right * percantageToMakeActionOnDrag) {
            questionBlockEditRef.current?.classList.remove("hidden");
        } else {
            questionBlockEditRef.current?.classList.add("hidden");
            questionBlockDeleteRef.current?.classList.add("hidden");
        }
    };

    const handleStopDragging = (_: DraggableEvent) => {
        setQuestionBlockPossiton({ x: 0, y: 0 });
        setQuestionBlockDelta({ x: 0, y: 0 });

        questionBlockDeleteRef.current?.classList.add("hidden");
        questionBlockEditRef.current?.classList.add("hidden");

        if (questionBlockDelta.x <= questionBlockDragBounds.left * percantageToMakeActionOnDrag) {
            handleRemove();
        }
    };

    const handleStartDragging = (_: DraggableEvent) => {
        () => _;
    }
    
    const handleRemove = () => {
        onRemove(question.id);
    }

    return (
        <Draggable
        axis="x"
        handle=".handle"
        scale={1}
        nodeRef={ref}
        position={questionBlockPossiton}
        onStop={handleStopDragging}
        onStart={handleStartDragging}
        onDrag={handleDrag}
        bounds={{top: questionBlockDragBounds.top, left: questionBlockDragBounds.left, right: questionBlockDragBounds.right, bottom: questionBlockDragBounds.bottom}}>
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

                {/* Overlay for delete and edit text */}
                <div ref={questionBlockEditRef} className="questionBlockOverlay hidden edit">EDIT</div>
                <div ref={questionBlockDeleteRef} className="questionBlockOverlay hidden delete">DELETE</div>
            </div>
        </Draggable>
    );
};

export default QuestionBlock;