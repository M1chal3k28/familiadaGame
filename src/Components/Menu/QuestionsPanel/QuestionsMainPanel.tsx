import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const QuestionsMainPanel: React.FC = () => {
    const navigate = useNavigate();
    
    const Play = () => {
        navigate("/play");
    };

    const Back = () => {
        navigate("/");
    };

    return (
        <>
            <header className="menuHeader flex flex-col">
                <div className="flex justify-center w-auto">
                    <h1>Set Questions</h1>
                </div>
                <div className="flex flex-row mt-5 menuSmallerTextSize">
                    <button type="button" className="menuButton w-fit flex" onClick={Back}>&larr; Back</button>
                    <button type="button" className="menuButton w-fit flex" onClick={Play}>Play &rarr;</button>
                </div>
            </header>
            
            <Outlet/>
        </>
    );
};

export default QuestionsMainPanel;