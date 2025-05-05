import { RefObject } from "react";
import "./Classes/Team";
import Team from "./Classes/Team";
import GameLogic from "./Classes/GameLogic";

export interface Answer {
    code: string;
    score: number;
    revealed: boolean;
    revealedByTeam: WhatTeam;
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
    answersRevealed: number;
};

export interface Question {
    id: number;
    type: QuestionType;
    question: string;
    answers: Answer[];
    questionMeta: QuestionMeta;
};

export enum GamePhase {
    QUESTION_INTRO = "questionIntro",
    QUESTION_MAIN = "questionMain",
};

export interface Round {
    question: Question;
    points: number;
    leftIntroRestarts: number; // <- number of times left to restart the round in case no one answers in the intro
    winner: WhatTeam;
};

export enum WhatTeam {
    TEAM1 = "team1",
    TEAM2 = "team2",
    TO_BE_DETERMINED = "to_be_determined",
}

export enum GameState {
    RUNNING = "running",
    FINISHED_QUESTION_WAITING_FOR_NEXT_ROUND = "waiting",
    ENDED = "ended",
}

export interface GameInterface {
    team1: Team;
    team2: Team;
    rounds: Round[];
    currentRound: number;
    phase: GamePhase;
    currentTeam: WhatTeam;
    startingTeam: WhatTeam;
    gameState: GameState;
};

export type ControlPanelProps = {
    gameLogic?: GameLogic;
}

export type BoardGameProps = {
    gameLogic?: GameLogic;
    inputRef?: RefObject<HTMLInputElement>;
    selectRef?: RefObject<HTMLSelectElement>;
};

export type Side = "left" | "right";
export type TeamInfoProps = {
    team?: Team;
    side: Side;
};

export type TeamXsProps = {
    team?: Team;
    side: Side;
};