import { hasWallCollision } from "..";
import { PLAYER_COLOR, PLAYER_SIZE, PLAYER_SPEED, TILE_SIZE } from "../maps/constants";
import { IMap } from "../maps/IMap";

export type Direction = "Up" | "Down" | "Left" | "Right";

export class Player {
    private x: number = null;
    private y: number = null;
    private ctx: CanvasRenderingContext2D = null;
    private isMoving = false;
    private direction: Direction | null = null;
    private nextTurn: Direction | null = null;
    constructor(col: number, row: number, ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.x = col * TILE_SIZE;
        this.y = row * TILE_SIZE;
    }
    render = () => {
        this.ctx.beginPath();
        this.ctx.arc(this.x + TILE_SIZE / 2, this.y + TILE_SIZE / 2, PLAYER_SIZE / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = PLAYER_COLOR;
        this.ctx.fill();
        this.ctx.closePath();
    }
    private canMove = (map: IMap) => {
        return !hasWallCollision(this.getCoordinates(), map, this.direction) ||
            (Boolean(this.nextTurn) && !hasWallCollision(this.getCoordinates(), map, this.nextTurn))

    }
    move = (map: IMap) => {
        if (this.canMove(map)) {
            if (this.isMoving && Boolean(this.direction)) {
                if (Boolean(this.nextTurn) && this.canTurn(map)) {
                    console.log('Try to turn')
                    switch (this.nextTurn) {
                        case "Down":
                            this.y = this.y + PLAYER_SPEED;
                            break;
                        case "Left":
                            this.x = this.x - PLAYER_SPEED;
                            break;
                        case "Right":
                            this.x = this.x + PLAYER_SPEED;
                            break;
                        case "Up":
                            this.y = this.y - PLAYER_SPEED;
                            break;
                    }
                    this.direction = this.nextTurn;
                    this.nextTurn = null;
                } else {
                    console.log(`Move player ${this.direction}`)
                    switch (this.direction) {
                        case "Down":
                            this.y = this.y + PLAYER_SPEED;
                            return;
                        case "Up":
                            this.y = this.y - PLAYER_SPEED;
                            return;
                        case "Left":
                            this.x = this.x - PLAYER_SPEED;
                            return;
                        case "Right":
                            this.x = this.x + PLAYER_SPEED;
                            return;
                    }
                }
            }
        }
    }
    getCoordinates = () => {
        return {
            x: this.x,
            y: this.y
        }
    }
    getDirection = () => {
        return this.direction;
    }
    getIsMoving = () => {
        return this.isMoving;
    }
    getTurnDirection = () => {
        return this.nextTurn
    }
    handleDirectionChange = (direction: Direction) => {
        console.log(`Is moving: ${this.isMoving}, Direction: ${this.direction}, turn: ${this.nextTurn}`)
        if (direction === "Right") {
            if (Boolean(this.direction)) {
                this.nextTurn = "Right"
            } else {
                this.isMoving = true;
                this.direction = "Right";
            }
        } else if (direction === "Left") {
            if (Boolean(this.direction)) {
                this.nextTurn = "Left"
            } else {
                this.isMoving = true;
                this.direction = "Left";
            }
        } else if (direction === "Up") {
            if (Boolean(this.direction)) {
                this.nextTurn = "Up"
            } else {
                this.isMoving = true;
                this.direction = "Up";
            }
        } else if (direction === "Down") {
            if (Boolean(this.direction)) {
                this.nextTurn = "Down"
            } else {
                this.isMoving = true;
                this.direction = "Down";
            }
        }
    }
    private canTurn = (map: IMap) => {
        return !hasWallCollision({ x: this.x, y: this.y }, map, this.nextTurn)
    }
}