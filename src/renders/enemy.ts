import { hasWallCollision } from "..";
import { ENEMY_SIZE, PLAYER_SPEED, TILE_SIZE } from "../maps/constants";
import { IMap } from "../maps/IMap";
import { Direction } from "./types/directionType";
import { getRandomEnemyColor, getRandomInteger, getReverseDirection } from "./utils";

export class Enemy {
    private x: number = null;
    private y: number = null;
    private id: number = null;
    private ctx: CanvasRenderingContext2D = null;
    private direction: Direction = null;
    constructor(col: number, row: number, id: number, ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.id = id;
        this.x = col * TILE_SIZE;
        this.y = row * TILE_SIZE;
    }
    render = () => {
        this.ctx.beginPath();
        this.ctx.arc(this.x + TILE_SIZE / 2, this.y + TILE_SIZE / 2, ENEMY_SIZE / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = getRandomEnemyColor();
        this.ctx.fill();
        this.ctx.closePath();
    }
    move = (map: IMap) => {
        const availableDirections = this.getAvailableDirections(map)
        let directionToMove: Direction | null = null;
        if (availableDirections.length === 1) {
            directionToMove = availableDirections[0];
        } else if (availableDirections.length === 2) {
            if (availableDirections.includes(this.direction)) {
                directionToMove = this.direction
            } else {
                directionToMove = availableDirections[getRandomInteger(1)]
            }
        } else {
            const reversDirection = getReverseDirection(this.direction)
            if (availableDirections.includes(this.direction)) {
                directionToMove = availableDirections
                    .filter(el => el !== reversDirection)[getRandomInteger(availableDirections.length - 1)]
            } else {
                directionToMove = availableDirections[getRandomInteger(availableDirections.length - 1)]
            }
        }
        switch (directionToMove) {
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
        this.direction = directionToMove;
    }
    private getAvailableDirections = (map: IMap): Array<Direction> => {
        const allDirections: Array<Direction> = ["Up", "Down", "Left", "Right"];
        return allDirections.filter((el: Direction) => this.canTurnToDirection(map, el));
    }
    private canTurnToDirection = (map: IMap, direction: Direction): boolean => {
        return !hasWallCollision({ x: this.x, y: this.y }, map, direction)
    }
    getCoordinates = () => {
        return {
            x: this.x,
            y: this.y
        }
    }
    getDirection = (): Direction => {
        return this.direction
    }
    getID = () => this.id;
}