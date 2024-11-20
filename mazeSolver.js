/**
 * @summary Generates and draws a maze based on specified canvas/grid size.
 * @author TimMagwood <timothy.magwood@gmail.com>
 *
 * Created:     2024-11-12
 * Modified:    2024-11-18
 */

// const { grid, canvasSize, gridSize, start, end } = require('./mazeGenerator.js');

document.getElementById("solveMaze").addEventListener("click", solveMaze);

const DIRECTIONS = [
    [-1, 0], // Up
    [0, 1], // Right
    [1, 0], // Down
    [0, -1] // Left
]

/**
 * Finds a path from the start point to the end point in the maze.
 */
function solveMaze() {
    const mazeStatus =  document.getElementById("mazeStatus");
    mazeStatus.innerText = "Solving...";
    path = [];

    // Reset all cells visited state to false
    for(let i = 0; i < grid.length; i++) {
        grid[i].forEach((cell) => cell.visited = false);
    }

    // Call the solve method from the start point
    dfs(start.y, start.x);

    // Send the reversed path so that we can draw it
    drawPathToEnd(path.reverse());
}

/**
 * Performs a search on neighboring cells to check for a valid path.
 * Uses the Depth-First-Search pathfinding algorithm
 * Returns once pathfinder reaches end OR when it is determined that no solution exists.
 * @param {number} x Cell row value.
 * @param {number} y Cell column value.
 * @returns {boolean} True if valid path is found, False if not.
 */
function dfs(x, y) {
    if(x == end.y && y == end.x) {
        mazeStatus.innerText = "Found path to end.";
        return true;
    }
    
    grid[x][y].visited = true;
    drawCellDot(grid[x][y], '#ff000080');
    
    for (let [dx, dy] of DIRECTIONS) {
        const nx = x + dx;
        const ny = y + dy;

            if(nx >= 0 && ny >= 0 && nx < grid.length && ny < grid.length && !grid[nx][ny].visited) {
                if(isValidMove(grid[x][y], grid[nx][ny])) {
                    if (dfs(nx, ny)) {
                        path.push(grid[nx][ny])
                        return true;
                    } else {
                        path.pop();
                    }
                }
            }
        }

    return false; // No valid path
}

/**
 * Checks if a move can be made between two given cells.
 * @param {number} currCell Current cell.
 * @param {number} nextCell Next cell.
 * @returns {boolean} True if move is valid, False if not.
 */
function isValidMove(currCell, nextCell) {

    const[x1, y1] = [currCell.x, currCell.y];
    const[x2, y2] = [nextCell.x, nextCell.y];

    if (x1 == x2) { // We are in the same row
        if (y2 > y1) {
            return !currCell.walls[2]; // Check if there is a wall below
        } else {
            return !currCell.walls[0]; // Check if there is a wall above
        }
    } else if (y1 == y2) {
        if (x2 > x1) {
            return !currCell.walls[1]; // Check if there is a wall right
        } else {
            return !currCell.walls[3]; // Check if there is a wall left
        }
    }
    return false; // Otherwise, its an invalid move
}

/**
 * Draws the path from start point to end point.
 * @param path An array of indexes that contain the path from the start to the end.
 */
function drawPathToEnd(path) {
    path.unshift(start);
    path.forEach((cell) => drawCellDot(cell, '#00ff0080'));
    mazeStatus.innerText += " Maze Solved!";
}