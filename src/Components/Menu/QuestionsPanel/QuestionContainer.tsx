import React from "react";
import ImportButton from "./ImportButton";

const QuestionContainer: React.FC = () => { 
    return (
        <main className="menuMain">
            <div className="flex flex-row">
                <ImportButton className="menuSmallerTextSize menuButton"/>
            </div>
        </main>
    );
};

export default QuestionContainer;