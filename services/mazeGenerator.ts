
import { MazeCell } from '../types';

export const generateMaze = (width: number, height: number): MazeCell[][] => {
  // Initialize grid
  const grid: MazeCell[][] = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      walls: { top: true, right: true, bottom: true, left: true },
      isStart: false,
      isEnd: false,
      hasItem: false,
      hasBonus: false,
      visited: false,
    }))
  );

  const stack: MazeCell[] = [];
  const startX = 0;
  const startY = 0;
  grid[startY][startX].isStart = true;
  grid[startY][startX].visited = true;
  stack.push(grid[startY][startX]);

  while (stack.length > 0) {
    const current = stack.pop()!;
    const { x, y } = current;

    const neighbors = [];
    // Top
    if (y > 0 && !grid[y - 1][x].visited) neighbors.push(grid[y - 1][x]);
    // Right
    if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push(grid[y][x + 1]);
    // Bottom
    if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push(grid[y + 1][x]);
    // Left
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push(grid[y][x - 1]);

    if (neighbors.length > 0) {
      stack.push(current);
      const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];

      // Remove walls
      if (chosen.y < y) { // Top
        current.walls.top = false;
        chosen.walls.bottom = false;
      } else if (chosen.x > x) { // Right
        current.walls.right = false;
        chosen.walls.left = false;
      } else if (chosen.y > y) { // Bottom
        current.walls.bottom = false;
        chosen.walls.top = false;
      } else if (chosen.x < x) { // Left
        current.walls.left = false;
        chosen.walls.right = false;
      }

      chosen.visited = true;
      stack.push(chosen);
    }
  }

  // Set end point (furthest from start)
  grid[height - 1][width - 1].isEnd = true;

  // Add items and bonuses
  let itemsPlaced = 0;
  const maxItems = Math.floor((width * height) / 20);
  while (itemsPlaced < maxItems) {
    const randX = Math.floor(Math.random() * width);
    const randY = Math.floor(Math.random() * height);
    const cell = grid[randY][randX];
    if (!cell.isStart && !cell.isEnd && !cell.hasItem) {
      cell.hasItem = true;
      itemsPlaced++;
    }
  }

  return grid;
};
