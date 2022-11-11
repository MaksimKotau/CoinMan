import {
  BRICKS_COUNT,
  COLLISION_DISTANCE,
  ENEMY_COLORS,
  TILE_SIZE,
  WALL_ZONE,
} from "../maps/constants";
import { IMap } from "../maps/IMap";
import { Enemy } from "./enemy";
import { Player } from "./player";
import { Coordinates } from "./types/coordinatesType";
import { Direction } from "./types/directionType";

export const getRandomInteger = (n: number) => {
  return Math.round(Math.random() * n);
};

export const getRandomEnemyColor = () => {
  return ENEMY_COLORS[getRandomInteger(ENEMY_COLORS.length - 1)];
};

export const getReverseDirection = (direction: Direction): Direction => {
  switch (direction) {
    case "Down":
      return "Up";
    case "Up":
      return "Down";
    case "Left":
      return "Right";
    case "Right":
      return "Left";
  }
};

export const hasWallCollision = (
  coords: Coordinates,
  map: IMap,
  direction: Direction
): boolean => {
  const { x, y } = coords;
  if (direction === "Down") {
    //is map end reached
    if (BRICKS_COUNT * TILE_SIZE <= y + TILE_SIZE) {
      return true;
    }
    // is next row reached
    if (y % TILE_SIZE !== 0) {
      return false;
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
      return true;
    }
    // is next row reached
    if (y % TILE_SIZE !== 0) {
      return false;
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
      return true;
    }
    // is next row reached
    if (x % TILE_SIZE !== 0) {
      return false;
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
      return true;
    }
    // is next row reached
    if (x % TILE_SIZE !== 0) {
      return false;
    }
    const nextX = Math.trunc(x / TILE_SIZE) - 1;
    const nextTopY = Math.trunc(y / TILE_SIZE);
    const nextBottomY = Math.trunc((y + TILE_SIZE - 1) / TILE_SIZE);
    const hasTopCollision = map[nextTopY][nextX] === WALL_ZONE;
    const hasBottomCollision = map[nextBottomY][nextX] === WALL_ZONE;
    return hasTopCollision || hasBottomCollision;
  }
  return false;
};

export const getEnemyCollisionID = (
  player: Player,
  enemies: Array<Enemy>
): number | null => {
  let result = null;
  for (let i = 0; i < enemies.length; i++) {
    if (
      distanceBetweenDots(
        player.getCoordinates(),
        enemies[i].getCoordinates()
      ) <= COLLISION_DISTANCE
    ) {
      result = enemies[i].getID();
      break;
    }
  }
  return result;
};

export const distanceBetweenDots = (
  first: Coordinates,
  second: Coordinates
): number => {
  return Math.sqrt((first.x - second.x) ** 2 + (first.y - second.y) ** 2);
};

export const getCellsByCoordinates = (
  coordinates: Coordinates
): Array<{ col: number; row: number }> => {
  const result: Array<{ col: number; row: number }> = [];
  //leftTop
  result.push({
    col: Math.trunc(coordinates.x / TILE_SIZE),
    row: Math.trunc(coordinates.y / TILE_SIZE),
  });
  //rightTop
  result.push({
    col: Math.trunc((coordinates.x + TILE_SIZE - 1) / TILE_SIZE),
    row: Math.trunc(coordinates.y / TILE_SIZE),
  });
  //leftBottom
  result.push({
    col: Math.trunc(coordinates.x / TILE_SIZE),
    row: Math.trunc((coordinates.y + TILE_SIZE - 1) / TILE_SIZE),
  });
  //rightBottom
  result.push({
    col: Math.trunc((coordinates.x + TILE_SIZE - 1) / TILE_SIZE),
    row: Math.trunc((coordinates.y + TILE_SIZE - 1) / TILE_SIZE),
  });
  return result;
};
