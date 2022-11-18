import { hasWallCollision } from './utils';
import { ENEMY_SIZE, PLAYER_SPEED, TILE_SIZE } from '../maps/constants';
import { IMap } from '../maps/IMap';
import { Direction } from '../types/directionType';
import {
  getRandomEnemyColor,
  getRandomInteger,
  getReverseDirection
} from './utils';
import Context from '../context';

export class Enemy {
  private x: number = null;
  private y: number = null;
  private id: number = null;
  private color: string = null;
  private direction: Direction = null;
  constructor(col: number, row: number, id: number) {
    this.id = id;
    this.x = col * TILE_SIZE;
    this.y = row * TILE_SIZE;
    this.color = getRandomEnemyColor();
  }
  render = () => {
    const ctx = Context.get().graphicContext;
    ctx.beginPath();
    ctx.arc(
      this.x + TILE_SIZE / 2,
      this.y + TILE_SIZE / 2,
      ENEMY_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x + 18, this.y +11)
    ctx.lineTo(this.x + 27, this.y + 6);
    ctx.lineTo(this.x + 20, this.y + 20);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x + 20, this.y +10)
    ctx.lineTo(this.x + 29, this.y + 15);
    ctx.lineTo(this.x + 20, this.y + 20);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x + 20, this.y +16)
    ctx.lineTo(this.x + 27, this.y + 24);
    ctx.lineTo(this.x + 18, this.y + 22);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x + 20, this.y +20)
    ctx.lineTo(this.x + 15, this.y + 29);
    ctx.lineTo(this.x + 10, this.y + 20);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x + 12, this.y + 22)
    ctx.lineTo(this.x + 3, this.y + 24);
    ctx.lineTo(this.x + 10, this.y + 16);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x + 10, this.y +10)
    ctx.lineTo(this.x + 1, this.y + 15);
    ctx.lineTo(this.x + 10, this.y + 20);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x + 12, this.y +11)
    ctx.lineTo(this.x + 3, this.y + 6);
    ctx.lineTo(this.x + 10, this.y + 20);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x + 20, this.y +10)
    ctx.lineTo(this.x + 15, this.y + 1);
    ctx.lineTo(this.x + 10, this.y + 10);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.ellipse( this.x + 19, this.y + 12, 2, 3, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill()
    ctx.closePath();

    ctx.beginPath();
    ctx.ellipse( this.x + 11, this.y + 12, 2, 3, Math.PI * 7 / 4, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill()
    ctx.closePath();

    ctx.beginPath();
    ctx.arc( this.x + 12, this.y + 13, 1, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill()
    ctx.closePath();

    ctx.beginPath();
    ctx.arc( this.x + 18, this.y + 13, 1, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill()
    ctx.closePath();

  };
  move = (map: IMap) => {
    const availableDirections = this.getAvailableDirections(map);
    let directionToMove: Direction | null = null;
    if (availableDirections.length === 1) {
      directionToMove = availableDirections[0];
    } else if (availableDirections.length === 2) {
      if (availableDirections.includes(this.direction)) {
        directionToMove = this.direction;
      } else {
        directionToMove = availableDirections[getRandomInteger(1)];
      }
    } else {
      const reversDirection = getReverseDirection(this.direction);
      if (availableDirections.includes(this.direction)) {
        directionToMove = availableDirections.filter(
          (el) => el !== reversDirection
        )[getRandomInteger(availableDirections.length - 1)];
      } else {
        directionToMove =
          availableDirections[getRandomInteger(availableDirections.length - 1)];
      }
    }
    switch (directionToMove) {
      case 'Down':
        this.y = this.y + PLAYER_SPEED;
        break;
      case 'Left':
        this.x = this.x - PLAYER_SPEED;
        break;
      case 'Right':
        this.x = this.x + PLAYER_SPEED;
        break;
      case 'Up':
        this.y = this.y - PLAYER_SPEED;
        break;
    }
    this.direction = directionToMove;
  };
  private getAvailableDirections = (map: IMap): Array<Direction> => {
    const allDirections: Array<Direction> = ['Up', 'Down', 'Left', 'Right'];
    return allDirections.filter((el: Direction) =>
      this.canTurnToDirection(map, el)
    );
  };
  private canTurnToDirection = (map: IMap, direction: Direction): boolean => {
    return !hasWallCollision({ x: this.x, y: this.y }, map, direction);
  };
  getCoordinates = () => {
    return {
      x: this.x,
      y: this.y
    };
  };
  getDirection = (): Direction => {
    return this.direction;
  };
  getID = () => this.id;
}
