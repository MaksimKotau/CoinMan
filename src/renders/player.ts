import { getCellsByCoordinates, hasWallCollision } from "./utils";
import { DOT_ZONE, PLAYER_COLOR, PLAYER_SIZE, PLAYER_SPEED, TILE_SIZE } from "../maps/constants";
import { IMap } from "../maps/IMap";
import { Direction } from "./types/directionType";

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
        const playerCoords = getPlayerParams(getMouthAngel(), this.direction || "Left");
        this.ctx.beginPath();
        this.ctx.arc(this.x + TILE_SIZE / 2, this.y + TILE_SIZE / 2, PLAYER_SIZE / 2, playerCoords.startAngle, playerCoords.endAngle);
        this.ctx.lineTo(this.x + TILE_SIZE / 2, this.y + TILE_SIZE / 2);
        this.ctx.closePath();
        this.ctx.arc(this.x + playerCoords.eyeX, this.y + playerCoords.eyeY, 3, 0, Math.PI * 2, true);
        this.ctx.fillStyle = PLAYER_COLOR;
        this.ctx.fill();
        this.ctx.closePath();
    }
    private canMove = (map: IMap) => {
        return !hasWallCollision(this.getCoordinates(), map, this.direction) ||
            (Boolean(this.nextTurn) && !hasWallCollision(this.getCoordinates(), map, this.nextTurn))

    }
    move = (map: IMap, onEatingDot: (data: { col: number, row: number }) => void) => {
        if (this.canMove(map)) {
            if (this.isMoving && Boolean(this.direction)) {
                if (Boolean(this.nextTurn) && this.canTurn(map)) {
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
                    switch (this.direction) {
                        case "Down":
                            this.y = this.y + PLAYER_SPEED;
                            break;
                        case "Up":
                            this.y = this.y - PLAYER_SPEED;
                            break;
                        case "Left":
                            this.x = this.x - PLAYER_SPEED;
                            break;
                        case "Right":
                            this.x = this.x + PLAYER_SPEED;
                            break;
                    }
                }
            }
        }
        const possibleCellsWithDots = getCellsByCoordinates({ x: this.x, y: this.y })
        possibleCellsWithDots.forEach(cell => {
            if (map[cell.row][cell.col] === DOT_ZONE) {
                onEatingDot(cell)
            }
        })
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

const getPlayerParams = (mouthAngle: number, direction: Direction) => {
    const halfAngel = mouthAngle / 2;
    const config = {
        "Right": {
            startAngle: 0,
            endAngle: 360, 
            eyeXMultiplier: 1/2,
            eyeYMultiplier: 1/4,
        },
        "Left": {
            startAngle: 180,
            endAngle: 180, 
            eyeXMultiplier: 1/2,
            eyeYMultiplier: 1/4,
        },
        "Up": {
            startAngle: 270,
            endAngle: 270, 
            eyeXMultiplier: 1/4,
            eyeYMultiplier: 1/2,
        },
        "Down": {
            startAngle: 90,
            endAngle: 90, 
            eyeXMultiplier: 1/4,
            eyeYMultiplier: 1/2,
        }
    }
    return {
        startAngle: (config[direction].startAngle + halfAngel) * (Math.PI / 180),
        endAngle: (config[direction].endAngle - halfAngel) * (Math.PI / 180),
        eyeX: TILE_SIZE * config[direction].eyeXMultiplier,
        eyeY: TILE_SIZE * config[direction].eyeYMultiplier,
    };
}

const getMouthAngel = () => {
    const milliseconds = new Date().getMilliseconds()
    return milliseconds < 500 ? milliseconds / 10 : (1000 - milliseconds) / 10
}