/**
 * @summary Generates and draws a maze based on specified canvas/grid size.
 * @author TimMagwood <timothy.magwood@gmail.com>
 *
 * Created:     2024-11-12
 * Modified:    2024-11-16
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
    mazeStatus.innerText = "solving...";
    path = [];

    // Reset all cells visited state to false
    for(let i = 0; i < grid.length; i++) {
        grid[i].forEach((cell) => cell.visited = false);
    }

    // Starting with depth-first search
    function dfs(cell) {
        cell.visited = true;
        drawCellDot(cell, '#ff000080');
        if(cell.x == end.x && cell.y == end.y) {
            mazeStatus.innerText = "Found path to end.";
            path.push([cell.x, cell.y]);
            return true;
        }

        for (let [dx, dy] of DIRECTIONS) {
            const nx = cell.x + dx;
            const ny = cell.y + dy;
            const nextCell = grid[nx][ny];

            if (nx >= 0 && ny >= 0 && nx < MAZE_SIZE && ny < MAZE_SIZE && !nextCell.visited && isValidMove(cell, nextCell)) {
                path.push([nextCell, [...path, cell]]);
            }
        }

        // Remove recents cell if it doesn't lead to solution
        path.pop();
        return false;
    }

    // Call the solve method from the start point
    dfs(start);

    // Send the reversed path so that we can draw it
    drawPathToEnd(path.reverse());
}

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
    path.forEach((cell) => console.log(cell));
    mazeStatus.innerText += " Maze Solved!";
}