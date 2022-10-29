import { PLAYER_COLOR, PLAYER_SIZE, PLAYER_SPEED, TILE_SIZE } from "../maps/constants";

export type Direction = "Up" | "Down" | "Left" | "Right";

export class Player {
    private x: number = null;
    private y: number = null;
    private direction: Direction = null;
    private ctx: CanvasRenderingContext2D = null;
    constructor(col: number, row: number, ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.x = col * TILE_SIZE;
        this.y = row * TILE_SIZE;
        this.direction = "Right";
    }
    render = () => {
        this.ctx.beginPath();
        this.ctx.arc(this.x + TILE_SIZE / 2, this.y + TILE_SIZE / 2, PLAYER_SIZE / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = PLAYER_COLOR;
        this.ctx.fill();
        this.ctx.closePath();
    }
    move = (direction: Direction) => {
        this.direction = direction;
        switch (direction) {
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
    getCoordinates = () => {
        return {
            x: this.x,
            y: this.y
        }
    }

}