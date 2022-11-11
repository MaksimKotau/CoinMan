import {
  BRICKS_COUNT,
  DOT_COLOR,
  DOT_RADIUS,
  DOT_ZONE,
  TILE_SIZE,
  WALL_COLOR,
  WALL_ZONE,
} from "../maps/constants";
import { IMap } from "../maps/IMap";

export const renderMap = (mapData: IMap, ctx: CanvasRenderingContext2D) => {
  for (let row = 0; row < BRICKS_COUNT; row++) {
    for (let col = 0; col < BRICKS_COUNT; col++) {
      if (mapData[row][col] === WALL_ZONE) {
        renderWall(row, col, ctx);
      } else if (mapData[row][col] === DOT_ZONE) {
        renderDot(row, col, ctx);
      }
    }
  }
};

const renderWall = (
  row: number,
  col: number,
  ctx: CanvasRenderingContext2D
) => {
  ctx.beginPath();
  ctx.rect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = WALL_COLOR;
  ctx.fill();
  ctx.closePath();
};

const renderDot = (row: number, col: number, ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.arc(
    col * TILE_SIZE + TILE_SIZE / 2,
    row * TILE_SIZE + TILE_SIZE / 2,
    DOT_RADIUS,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = DOT_COLOR;
  ctx.fill();
  ctx.closePath();
};
