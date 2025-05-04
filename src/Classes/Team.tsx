import { GAME_LOGIC } from "./GameLogic";
import { GamePhase, WhatTeam } from "../Types";

export default class Team {
    private xcount: number = 0;
    private xbound: number = 0;
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

    public prepare(): void {
        this.xcount = 0;
        // TODO: Get info about game state and set xbound properly
        if (GAME_LOGIC.GamePhase === GamePhase.QUESTION_INTRO) {
            this.xbound = 1;
        } else if (GAME_LOGIC.GamePhase === GamePhase.QUESTION_MAIN) {
            if (GAME_LOGIC.startingTeam === this.whatTeam) {
                this.xbound = 3;
            } else {
                this.xbound = 1;
            }
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