import React from "react";
import {ImportButton, FileType} from "./ImportButton";
import { Question, SavedQuestionValidator } from "../../../Types";
import { notificationManager } from "../../Notifications/NotificationManager";
import { useSettings } from "../../../SettingsContext";
import QuestionBlock from "./QuestionBlock";
import "./QuestionPanel.css"

const QuestionContainer: React.FC = () => { 
    const {questions, setQuestions} = useSettings()!;

    const handleImport = async (fileData: string): Promise<boolean> => {
        try {
            const questions = JSON.parse(fileData);
            if (!Array.isArray(questions))
                throw new Error();

            questions.forEach((q: Question) => {
                if (!SavedQuestionValidator(q))
                    throw new Error();
            });
        } catch (error: any) {
            notificationManager.error("Invalid Questions file, please choose a valid one exported by the app", "ERROR", 5000, () => {}, true);
            return false;
        }
        
        setQuestions(JSON.parse(fileData));
        notificationManager.success("Questions imported successfully", "SUCCESS", 5000, () => {}, true);
        return true;  
    };

    const handleExport = async (): Promise<void> => {
        try {
            const blob = new Blob([JSON.stringify(questions)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "questions.json";
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
            notificationManager.info("Questions has been exported", "EXPORT", 5000, () => {}, true);
        } catch (error: any) {
            notificationManager.error(`Error exporting questions`, "ERROR", 5000, () => {}, true);
        }
    };

    const questionBlocks = questions.map((question) => <QuestionBlock question={question} key={question.id} />);

    return (
        <main className="menuMain">
            <div className="flex flex-col items-center h-full border-white border-double border-4 rounded-md w-[80%] overflow-auto p-4 gap-2 overflow-x-hidden">
                {questionBlocks}
            </div>
            <div className="flex flex-row">
                <ImportButton className="menuSmallerTextSize menuButton" acceptedTypes={[FileType.JSON, FileType.TXT]} callback={handleImport}/>
                <button onClick={handleExport} type="button" className="menuSmallerTextSize menuButton">Export</button>
            </div>
        </main>
    );
};

export default QuestionContainer;