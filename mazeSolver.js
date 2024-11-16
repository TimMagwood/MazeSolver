/**
 * @summary Generates and draws a maze based on specified canvas/grid size.
 * @author TimMagwood <timothy.magwood@gmail.com>
 *
 * Created:     2024-11-12
 * Modified:    2024-11-16
 */

// const { grid, canvasSize, gridSize, start, end } = require('./mazeGenerator.js');

document.getElementById("solveMaze").addEventListener("click", solveMaze);

/**
 * Finds a path from the start point to the end point in the maze.
 */
function solveMaze() {
    const mazeStatus =  document.getElementById("mazeStatus");
    mazeStatus.innerText = "solving...";
    path = [];
    // Starting with depth-first search
    function dfs(x, y) {
        if(x == end.x && y == end.y) {
            mazeStatus.innerText = "Found path to end.";
            // TODO Add dot every time we visit a cell so that we can follow along
            path.push([x, y]);
            return true;
        }

        // TODO Make sure grid is actually coming in correctly
        // TODO Check that this is validating correctly...
        if(!isValidMove(grid, visited, x, y)) {
            return false;
        }

        // TODO Check all directions re-calling dfs()

        // Remove recents cell if it doesn't lead to solution
        path.pop();
        return false;
    }

    // Call the solve method from the start point
    dfs(start.x, start.y);

    // Send the reversed path so that we can draw it
    drawPathToEnd(path.reverse());
}

function isValidMove(grid, visited, x, col) {
    return x >= 0 &&
        x < grid.length &&
        y >= 0 &&
        y < grid[0].length &&
        grid[x][y] === 1 &&
        !visited[x][y];
  }

/**
 * Draws the path from start point to end point.
 * @param path An array of indexes that contain the path from the start to the end.
 */
function drawPathToEnd(path) {

    mazeStatus.innerText += "Maze Solved!";
}