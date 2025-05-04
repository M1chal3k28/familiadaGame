import "./Classes/Team";
import Team from "./Classes/Team";

export interface Answer {
    code: string;
    score: number;
    revealed: boolean;
    reaveledByTeam: WhatTeam;
};

export enum QuestionType {
    NORMAL = "normal",
    HARD = "hard",
    BLANK = "blank",
};
export interface QuestionMeta {
    answerCount: number;
    longestAnswer: number;
    mostScoredAnswerCode: string;
};

export interface Question {
    id: number;
    type: QuestionType;
    question: string;
    answers: Answer[];
    questionMeta: QuestionMeta;
};

export type BoardGameProps = {
    question: Question;
};

export enum GamePhase {
    QUESTION_INTRO = "questionIntro",
    QUESTION_MAIN = "questionMain",
};

export interface Round {
    question: Question;
    points: number;
};

export enum WhatTeam {
    TEAM1 = "team1",
    TEAM2 = "team2",
    TO_BE_DETERMINED = "to_be_determined",
}
export interface GameInterface {
    team1: Team;
    team2: Team;
    rounds: Round[];
    currentRound: number;
    phase: GamePhase;
    currentTeam: WhatTeam;
    startingTeam: WhatTeam;
};