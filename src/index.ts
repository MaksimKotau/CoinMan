import { Level } from "./level/level";
import { level1 } from "./maps/1stLevel";
import { ILevel } from "./maps/IMap";
import { GameState } from "./renders/types/gameStateType";

class Game {
  private canvas: HTMLCanvasElement = null;
  private ctx: CanvasRenderingContext2D = null;
  private levels: Array<ILevel> = [level1];
  private currentLevelIndex: number = 0;
  private currentLevel: Level = null;
  private state: GameState = null;
  private lives: number = null;
  constructor() {
    this.state = GameState.START_NEW_GAME;
    this.canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.currentLevel = new Level(
      this.ctx,
      this.levels[this.currentLevelIndex]
    );
    document.addEventListener("keydown", this.keyDownHandler, false);
    this.draw();
  }
  keyDownHandler = (e) => {
    if (e.keyCode === 39) {
      this.currentLevel.handleDirectionChange("Right");
    } else if (e.keyCode === 37) {
      this.currentLevel.handleDirectionChange("Left");
    } else if (e.keyCode === 38) {
      this.currentLevel.handleDirectionChange("Up");
    } else if (e.keyCode === 40) {
      this.currentLevel.handleDirectionChange("Down");
    }
  };
  draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.currentLevel.move();
    this.currentLevel.render();
    requestAnimationFrame(this.draw);
  };
}

const game = new Game();

export { game };
