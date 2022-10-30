import { level1 } from "./maps/1stLevel";
import { BRICKS_COUNT, TILE_SIZE, WALL_ZONE } from "./maps/constants";
import { IMap } from "./maps/IMap";
import { mapRenderer } from "./renders/mapRenderer";
import { Direction, Player } from "./renders/player";

class Game {
    private canvas: HTMLCanvasElement = null;
    private ctx: CanvasRenderingContext2D = null;
    private mapData: IMap = null;
    private player: Player = null;

    private lives: number = null;
    constructor() {
        this.canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")
        this.ctx.fillStyle = "black";
        this.mapData = level1.map;
        this.player = new Player(level1.player_start_position.x, level1.player_start_position.y, this.ctx);
        document.addEventListener("keydown", this.keyDownHandler, false);
        this.draw();
    }
    keyDownHandler = (e) => {
        if (e.keyCode === 39) {
            this.player.handleDirectionChange("Right")
        } else if (e.keyCode === 37) {
            this.player.handleDirectionChange("Left")
        } else if (e.keyCode === 38) {
            this.player.handleDirectionChange("Up")
        } else if (e.keyCode === 40) {
            this.player.handleDirectionChange("Down")
        }
    }
    draw = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        mapRenderer(this.mapData, this.ctx)
        this.movePlayer()
        this.player.render();
        requestAnimationFrame(this.draw);
    }
    movePlayer = () => {
        this.player.move(this.mapData);
    }
}

export const hasWallCollision = (coords: { x: number, y: number }, map: IMap, direction: Direction): boolean => {
    const { x, y } = coords;
    if (direction === "Down") {
        //is map end reached
        if (BRICKS_COUNT * TILE_SIZE <= y + TILE_SIZE) {
            return true
        }
        // is next row reached
        if (y % TILE_SIZE !== 0) {
            return false
        }
        const nextY = Math.trunc(y / TILE_SIZE) + 1;
        const nextLeftX = Math.trunc(x / TILE_SIZE);
        const nextRightX = Math.trunc((x + TILE_SIZE - 1) / TILE_SIZE);
        const hasLeftCollision = map[nextY][nextLeftX] === WALL_ZONE;
        const hasRightCollision = map[nextY][nextRightX] === WALL_ZONE;
        return hasLeftCollision || hasRightCollision;
    }
    if (direction === "Up") {
        //is map end reached
        if (y <= 0) {
            return true
        }
        // is next row reached
        if (y % TILE_SIZE !== 0) {
            return false
        }
        const nextY = Math.trunc(y / TILE_SIZE) - 1;
        const nextLeftX = Math.trunc(x / TILE_SIZE);
        const nextRightX = Math.trunc((x + TILE_SIZE - 1) / TILE_SIZE);
        const hasLeftCollision = map[nextY][nextLeftX] === WALL_ZONE;
        const hasRightCollision = map[nextY][nextRightX] === WALL_ZONE;
        return hasLeftCollision || hasRightCollision;
    }
    if (direction === "Right") {
        //is map end reached
        if (BRICKS_COUNT * TILE_SIZE <= x + TILE_SIZE) {
            return true
        }
        // is next row reached
        if (x % TILE_SIZE !== 0) {
            return false
        }
        const nextX = Math.trunc(x / TILE_SIZE) + 1;
        const nextTopY = Math.trunc(y / TILE_SIZE);
        const nextBottomY = Math.trunc((y + TILE_SIZE - 1) / TILE_SIZE);
        const hasTopCollision = map[nextTopY][nextX] === WALL_ZONE;
        const hasBottomCollision = map[nextBottomY][nextX] === WALL_ZONE;
        return hasTopCollision || hasBottomCollision;
    }
    if (direction === "Left") {
        //is map end reached
        if (x <= 0) {
            return true
        }
        // is next row reached
        if (x % TILE_SIZE !== 0) {
            return false
        }
        const nextX = Math.trunc(x / TILE_SIZE) - 1;
        const nextTopY = Math.trunc(y / TILE_SIZE);
        const nextBottomY = Math.trunc((y + TILE_SIZE - 1) / TILE_SIZE);
        const hasTopCollision = map[nextTopY][nextX] === WALL_ZONE;
        const hasBottomCollision = map[nextBottomY][nextX] === WALL_ZONE;
        return hasTopCollision || hasBottomCollision;
    }
    return false;
}

const game = new Game();

export { game }