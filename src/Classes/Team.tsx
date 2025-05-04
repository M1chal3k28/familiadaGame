import { GamePhase, WhatTeam } from "../Types";

export default class Team {
    private xcount: number = 0;
    private xbound: number = 1;
    private score: number = 0;
    private whatTeam: WhatTeam;

    constructor(whatTeam: WhatTeam) {
        this.whatTeam = whatTeam;
    }

    public isBlocked(): boolean {
        return this.xcount >= this.xbound;
    }

    public fail(): void {
        this.xcount++;
    }

    /**
     * Resets the team's state for a new round or phase.
     * 
     * Sets the number of Xs (xcount) to zero and the maximum allowed Xs (xbound) to one.
     * If the current game phase is QUESTION_MAIN and this team is the starting team,
     * increases the maximum allowed Xs (xbound) to three.
     */
    public prepare(gamePhase: GamePhase, startingTeam: WhatTeam): void {
        this.xcount = 0;
        this.xbound = 1;

        const phaseIsMain = gamePhase === GamePhase.QUESTION_MAIN;
        const startingTeamIsThisTeam = startingTeam === this.whatTeam;

        if (phaseIsMain && startingTeamIsThisTeam) {
            this.xbound = 3;
        }
    }

    public getScore(): number {
        return this.score;
    }

    public getXs(): number {
        return this.xcount;
    }

    public getMaxXs(): number {
        return this.xbound;
    }

    public appendScore(points: number): void {
        this.score += points;
    }
}