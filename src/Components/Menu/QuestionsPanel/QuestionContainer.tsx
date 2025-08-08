import React from "react";
import {ImportButton, FileType} from "./ImportButton";
import { Question, SavedQuestionValidator } from "../../../Types";
import { notificationManager } from "../../Notifications/NotificationManager";
import { useSettings } from "../../../SettingsContext";

const QuestionContainer: React.FC = () => { 
    const {setQuestions} = useSettings()!;

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

    return (
        <main className="menuMain">
            <div className="flex flex-row">
                <ImportButton className="menuSmallerTextSize menuButton" acceptedTypes={[FileType.JSON, FileType.TXT]} callback={handleImport}/>
            </div>
        </main>
    );
};

export default QuestionContainer;