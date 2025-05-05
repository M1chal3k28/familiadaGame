import { GameInterface, Question, GamePhase, Round, Answer, WhatTeam } from "../Types";
import Team from "./Team";
import { getQuestions } from "../services/QuestionService";

export class GameLogic {
    private static instance: GameLogic; 
    private gameInfo: GameInterface;
    private eventTarget: EventTarget = new EventTarget();

    private constructor(questions: Question[]) {
        this.gameInfo = {
            team1: new Team(WhatTeam.TEAM1, "Drużyna 1"),
            team2: new Team(WhatTeam.TEAM2, "Drużyna 2"),
            rounds: questions.map((question: Question) => {
                return {
                    question,
                    points: 0,
                    leftIntroRestarts: 1,
                };
            }),
            currentRound: 0,
            phase: GamePhase.QUESTION_INTRO,
            currentTeam: WhatTeam.TO_BE_DETERMINED,
            startingTeam: WhatTeam.TO_BE_DETERMINED,
        };
    }

    private prepareTeams() {
        this.gameInfo.team1.prepare(this.gameInfo.phase, this.gameInfo.startingTeam);
        this.gameInfo.team2.prepare(this.gameInfo.phase, this.gameInfo.startingTeam);
    }

    private restartCurrentRound() {
        if (this.currentRound.leftIntroRestarts === 0) {
            this.nextPhase(true);
        }

        this.currentRound.leftIntroRestarts -= 1;
        this.gameInfo.phase = GamePhase.QUESTION_INTRO;
        this.gameInfo.currentTeam = WhatTeam.TO_BE_DETERMINED;
        this.gameInfo.startingTeam = WhatTeam.TO_BE_DETERMINED;
        this.prepareTeams();

        this.emitUpdate();
    }

    /**
     * Moves the game to the next phase.
     * 
     * If the current phase is QUESTION_INTRO and the forceNewRound flag is not set,
     * the game phase is changed to QUESTION_MAIN and the starting team is set to the
     * current team. Both teams are reset.
     * 
     * If the current phase is QUESTION_MAIN or the forceNewRound flag is set,
     * the game phase is changed to QUESTION_INTRO, the current round is incremented,
     * the current team is set to TO_BE_DETERMINED and the starting team is set to
     * TO_BE_DETERMINED. Both teams are reset.
     * 
     * @param forceNewRound - If true, the game will always move to the next round.
     */
    private nextPhase(forceNewRound?: boolean) {
        if (!forceNewRound && this.gameInfo.phase === GamePhase.QUESTION_INTRO) {
            this.gameInfo.phase = GamePhase.QUESTION_MAIN;
            this.gameInfo.currentTeam = this.startingTeam;
        } else if (forceNewRound || this.gameInfo.phase === GamePhase.QUESTION_MAIN) {
            this.gameInfo.phase = GamePhase.QUESTION_INTRO;
            this.gameInfo.currentRound += 1;
            this.gameInfo.currentTeam = WhatTeam.TO_BE_DETERMINED;
            this.gameInfo.startingTeam = (WhatTeam.TO_BE_DETERMINED);
        }
        
        this.prepareTeams();
        this.emitUpdate();
    }

    /**
     * If the starting team is not set, sets the starting team to the provided team, sets the current team to the starting team, and resets the teams.
     * 
     * If the starting team is already set, this function does nothing.
     * 
     * @param startingTeam - The team to set as the starting team. If undefined or null, the current team is not changed.
     */
    private setStartingTeamIfNeeded(startingTeam?: WhatTeam) {
        if (startingTeam && this.gameInfo.startingTeam === WhatTeam.TO_BE_DETERMINED) {
            this.gameInfo.startingTeam = startingTeam;
            this.gameInfo.currentTeam = (startingTeam as unknown) as WhatTeam;
            this.prepareTeams();
            this.emitUpdate();
        }
    }

    /**
     * Reveal an answer and update the round's points and question metadata.
     * 
     * Sets the revealed flag of the answer to true and assigns the current team to the answer.
     * Increments the round's points by the score of the answer.
     * Increments the question metadata's answer count by one.
     * 
     * @param answer - The answer to be revealed.
     */
    private revealAnswer(answer: Answer) {
        const round = this.currentRound;
        answer.revealed = true;
        answer.revealedByTeam = this.gameInfo.currentTeam;
        round.points += answer.score;
        round.question.questionMeta.answersRevealed += 1;
    }

    /**
     * Processes an answer submission and updates the game state accordingly for the main game phase.
     * 
     * If all answers have been revealed by the starting team, the starting team
     * is awarded all points for the round and the game phase is changed to the
     * next phase. If the opposite team has revealed any answers, the opposite
     * team is awarded all points for the round and the game phase is changed to
     * the next phase. Otherwise, the game phase is not changed.
     */
    private handleMainPhaseAnswer() {
        const answeredByStartingTeam = this.gameInfo.currentTeam == this.gameInfo.startingTeam;
        const allAnswersRevealed = this.currentRound.question.questionMeta.answersRevealed === this.currentRound.question.questionMeta.answerCount;

        // Check if all answers are revealed by the starting team
        if (answeredByStartingTeam && allAnswersRevealed) {
            // Give all points to the team
            this._currentTeam.appendScore(this.currentRound.points);
            this.nextPhase();
            this.emitUpdate();
            return;
        }  
        // If opposite team revealed any answer
        else if(!answeredByStartingTeam) {
            // Give all points to the team
            this._currentTeam.appendScore(this.currentRound.points);
            this.nextPhase();
            this.emitUpdate();
            return;
        }
    }

    private handleIntroPhaseAnswer(answerObj: Answer) {
        const round = this.currentRound;
        const isBestAnswer = round.question.questionMeta.mostScoredAnswerCode === answerObj.code;

        // if starting team got best answer
        if (this.gameInfo.startingTeam === this.gameInfo.currentTeam) {
            // check if answer is the best answer
            if (isBestAnswer) {
                this.nextPhase();
                this.emitUpdate();
                return;
            } 
            // Else change team and let them guess better
            else {
                this.tryToSwitchTeams();
            }
        } 
        // if second team answer check which team got better answer
        else {
            // Get copy of answers and filter out unrevealed answers
            const revealed = round.question.answers.filter((a: Answer) => a.revealed);
            
            // Check which team got best answer
            let winner: WhatTeam = WhatTeam.TO_BE_DETERMINED;

            // If only one answer is revealed check which team got it
            if (revealed.length === 1)
                winner = revealed[0].revealedByTeam;

            // If two answers are revealed check which team got better
            else if (revealed.length === 2)
                winner = revealed[0].score > revealed[1].score ? revealed[0].revealedByTeam! : revealed[1].revealedByTeam!;

            // Set starting team for main phase
            this.setStartingTeamIfNeeded(winner);
            this.nextPhase();
        }
    }
    
    /**
     * Increments the current team's X count and handles team switching if blocked.
     *
     * This method increases the number of Xs for the current team by invoking the
     * `fail` method on the team. If the team becomes blocked after receiving an X,
     * it attempts to switch to the other team by invoking `tryToSwitchTeams`.
     * Regardless of whether the team is blocked, an update event is emitted.
     */
    private giveXToTheTeam(): void {
        const team: Team = this._currentTeam;
        team.fail();
        // If team is blocked
        if (team.isBlocked) {
            this.tryToSwitchTeams();
        }

        this.emitUpdate();
    }

    private get _currentTeam(): Team {
        if (this.gameInfo.currentTeam === WhatTeam.TEAM1) return this.gameInfo.team1;
        else if (this.gameInfo.currentTeam === WhatTeam.TEAM2) return this.gameInfo.team2;
        
        throw new Error("Current team is not set");
    }

    private emitUpdate() {
        this.eventTarget.dispatchEvent(new Event("update"));
    }

    /**
     * Attempts to switch the current team to the other team.
     * If the team that we want to switch to is blocked, it checks if we are in the intro phase.
     * If we are, it checks if we have allowed resets left. If we do, it resets the current round.
     * If not, it goes to the next round.
     * If we are not in the intro phase, it just goes to the next round.
     * If the team that we want to switch to is not blocked, it switches to that team.
     */
    private tryToSwitchTeams(): void {
        const teamToSwitchTo = this.gameInfo.currentTeam === WhatTeam.TEAM1 ? WhatTeam.TEAM2 : WhatTeam.TEAM1;
        const team: Team = teamToSwitchTo === WhatTeam.TEAM1 ? this.gameInfo.team1 : this.gameInfo.team2;
        if (team.isBlocked) {
            // Check if intro phase
            if (this.gameInfo.phase === GamePhase.QUESTION_INTRO) {
                // Check if reset is allowed
                if (this.currentRound.leftIntroRestarts > 0) {
                    this.restartCurrentRound();
                    // Must return here to prevent switch to the other team
                    return;
                }
            }
            
            // Next round
            this.nextPhase(true);

            return;
        }
        // Switch team
        this.gameInfo.currentTeam = teamToSwitchTo;
        this.emitUpdate();
    }

    /** PUBLIC METHODS */
    /**
     * Processes an answer submission and updates the game state accordingly.
     * 
     * This function sets the starting team if it is not already set and processes
     * the submitted answer. If the answer is correct and not previously revealed,
     * it updates the score and game state. If the answer is incorrect or already
     * revealed, it penalizes the team by giving them an 'X'. The function also
     * handles transitions between game phases based on the current phase, the
     * correctness of the answer, and whether all answers have been revealed.
     * 
     * @param answer - The submitted answer to be checked.
     * @param startingTeam - (Optional) The team that starts the round.
     */
    public checkAnswer(answer: string, startingTeam?: WhatTeam) {
        // set starting team
        this.setStartingTeamIfNeeded(startingTeam);
        
        // find answer
        const answerObj: Answer | undefined = this.currentQuestion.answers.find((a) => a.code === answer);
        if (!answerObj || answerObj.revealed) {
            this.giveXToTheTeam();
            return;
        }

        this.revealAnswer(answerObj);

        // if main phase
        if (this.gameInfo.phase === GamePhase.QUESTION_MAIN) {
            this.handleMainPhaseAnswer();
        }

        // if intro phase
        if (this.gameInfo.phase === GamePhase.QUESTION_INTRO) {
            this.handleIntroPhaseAnswer(answerObj);
        }

        this.emitUpdate();
    }

    public get GamePhase(): GamePhase { return this.gameInfo.phase; }
    public get currentQuestion(): Question { return this.currentRound.question; }
    public get currentRound(): Round { return this.gameInfo.rounds[this.gameInfo.currentRound]; }
    public get currentPhase(): GamePhase { return this.gameInfo.phase; }
    public get startingTeam(): WhatTeam { return this.gameInfo.startingTeam; }
    public get team1(): Team { return this.gameInfo.team1; }
    public get team2(): Team { return this.gameInfo.team2; }
    public get currentTeam(): WhatTeam { return this.gameInfo.currentTeam; }
    
    public static async createInstance(): Promise<GameLogic> {
        if (!GameLogic.instance) {
            const questions = await getQuestions(); // <- może być async
            GameLogic.instance = new GameLogic(questions);
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
}

export default GameLogic;
export const GAME_LOGIC: Promise<GameLogic> = GameLogic.createInstance();