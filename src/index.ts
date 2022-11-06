import { level1 } from "./maps/1stLevel";
import { EMPTY_ZONE } from "./maps/constants";
import { IMap } from "./maps/IMap";
import { Enemy } from "./renders/enemy";
import { mapRenderer } from "./renders/mapRenderer";
import { Player } from "./renders/player";
import { getEnemyCollisionID } from "./renders/utils";

class Game {
    private canvas: HTMLCanvasElement = null;
    private ctx: CanvasRenderingContext2D = null;
    private mapData: IMap = null;
    private player: Player = null;
    private enemies: Array<Enemy> = [];
    private lives: number = null;
    constructor() {
        this.canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")
        this.ctx.fillStyle = "black";
        this.mapData = level1.map;
        this.player = new Player(level1.player_start_position.x, level1.player_start_position.y, this.ctx);
        document.addEventListener("keydown", this.keyDownHandler, false);
        level1.enemies_start_position.forEach((en, index) => {
            this.enemies.push(new Enemy(en.y, en.x, index, this.ctx))
        })
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
        this.movePlayer();
        this.moveEnemies();
        this.player.render();
        this.renderEnemies();
        this.detectEnemiesCollision()
        requestAnimationFrame(this.draw);
    }
    onEatingDot = (data: {col: number, row: number}) => {
        this.mapData[data.row][data.col] = EMPTY_ZONE;
    }
    movePlayer = () => {
        this.player.move(this.mapData, this.onEatingDot);
    }
    moveEnemies = () => {
        this.enemies.forEach(enemy => {
            enemy.move(this.mapData)
        })
    }
    renderEnemies = () => {
        this.enemies.forEach(enemy => {
            enemy.render()
        })
    }
    detectEnemiesCollision = () => {
        const enemyID = getEnemyCollisionID(this.player, this.enemies)
        if (enemyID !== null){
            alert('collision with ' + enemyID)
        }
    }
}

const game = new Game();

export { game };
