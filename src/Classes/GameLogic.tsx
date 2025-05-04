import { GameInterface, Question, GamePhase, Round, Answer, WhatTeam } from "../Types";
import Team from "./Team";
import { getQuestions } from "../services/QuestionService";

export class GameLogic {
    private static instance: GameLogic; 
    private gameInfo: GameInterface;
    private eventTarget: EventTarget = new EventTarget();

    private constructor() {
        this.gameInfo = {
            team1: new Team(WhatTeam.TEAM1),
            team2: new Team(WhatTeam.TEAM2),
            rounds: getQuestions().map((question: Question) => {
                return {
                    question,
                    points: 0,
                };
            }),
            currentRound: 0,
            phase: GamePhase.QUESTION_MAIN,
            currentTeam: WhatTeam.TO_BE_DETERMINED,
            startingTeam: WhatTeam.TO_BE_DETERMINED,
        };
    }

    public prepare() {
        this.prepareTeams();
    }

    private prepareTeams() {
        this.gameInfo.team1.prepare();
        this.gameInfo.team2.prepare();
    }

    public checkAnswer(answer: string, startingTeam?: WhatTeam) {
        // set starting team
        if (startingTeam && this.gameInfo.startingTeam === WhatTeam.TO_BE_DETERMINED) {
            this.gameInfo.startingTeam = startingTeam;
            this.gameInfo.currentTeam = (startingTeam as unknown) as WhatTeam;
            this.prepareTeams();
            this.emitUpdate();
        }
        
        const answerObj: Answer | undefined = this.currentQuestion.answers.find((a) => a.code === answer);

        if (answerObj === undefined) {
            this.giveXToTheTeam();
            return;
        } else if (answerObj !== undefined) {
            if (answerObj.revealed) {
                this.giveXToTheTeam();
                return;
            }

            answerObj.revealed = true;
            this.gameInfo.rounds[this.gameInfo.currentRound].points += answerObj.score;
            answerObj.reaveledByTeam = this.gameInfo.currentTeam;
        }

        this.emitUpdate();
    }

    private tryToSwitchTeams(teamToSwitchTo: WhatTeam): void {
        switch (teamToSwitchTo) {
            case WhatTeam.TEAM1: {
                if (this.gameInfo.team1.isBlocked()) {
                    // TODO: Round ends
                    console.log("Next Phase");
                    return;
                }
                this.gameInfo.currentTeam = WhatTeam.TEAM1;
                this.emitUpdate();
            } break;
            
            case WhatTeam.TEAM2: {
                if (this.gameInfo.team2.isBlocked()) {
                    // TODO: Round ends
                    console.log("Next Phase");
                    return;
                }
                this.gameInfo.currentTeam = WhatTeam.TEAM2;
                this.emitUpdate();
            } break;
        }
    }

    private giveXToTheTeam(): void {
        switch (this.gameInfo.currentTeam) {
            case WhatTeam.TEAM1: {
                this.gameInfo.team1.fail();
                // If team1 is blocked
                if (this.gameInfo.team1.isBlocked()) {
                    this.tryToSwitchTeams(WhatTeam.TEAM2);
                }
            } break;

            case WhatTeam.TEAM2: {
                this.gameInfo.team2.fail();
                // If team1 is blocked
                if (this.gameInfo.team2.isBlocked()) {
                    this.tryToSwitchTeams(WhatTeam.TEAM1);
                }
            } break;
        }

        this.emitUpdate();
    }

    public get GamePhase(): GamePhase {
        return this.gameInfo.phase;
    }

    public get currentQuestion(): Question {
        return this.gameInfo.rounds[this.gameInfo.currentRound].question;
    }

    public get currentRound(): Round {
        return this.gameInfo.rounds[this.gameInfo.currentRound];
    }

    public get currentPhase(): GamePhase {
        return this.gameInfo.phase;
    }

    public get startingTeam(): WhatTeam {
        return this.gameInfo.startingTeam;
    }
    
    public get team1(): Team {
        return this.gameInfo.team1;
    }

    public get team2(): Team {
        return this.gameInfo.team2;
    }

    public get currentTeam(): WhatTeam {
        // if (this.gameInfo.currentTeam === WhatTeam.TEAM1) return this.gameInfo.team1;
        // else if (this.gameInfo.currentTeam === WhatTeam.TEAM2) return this.gameInfo.team2;
        
        // throw new Error("Current team is not set");

        return this.gameInfo.currentTeam;
    }

    public static getInstance() {
        if (!GameLogic.instance) {
            GameLogic.instance = new GameLogic();
        }
        return GameLogic.instance;
    }

    /**
     * Register a callback to be called whenever the game state changes.
     * Returns a function that can be called to remove the callback.
     * @param callback The callback to be called on update.
     * @returns A function that can be called to clean up the event listener.
     */
    public onUpdate(callback: () => void) {
        const handler = () => callback();
        this.eventTarget.addEventListener("update", handler);
        return () => this.eventTarget.removeEventListener("update", handler); // cleanup
    }
    
    private emitUpdate() {
        this.eventTarget.dispatchEvent(new Event("update"));
    }
}

export default GameLogic;
export const GAME_LOGIC: GameLogic = GameLogic.getInstance();