/**
 * @summary Generates and draws a maze based on specified canvas/grid size.
 * @author TimMagwood <timothy.magwood@gmail.com>
 *
 * Created:     2024-11-16
 * Modified:    2024-11-16
 */

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const canvasSize = 500;
canvas.width = canvasSize;
canvas.height = canvasSize;

let grid;
const gridSize = 20;
const cellSize = canvasSize / gridSize;

let start;
let end;

document.getElementById("generateMaze").addEventListener("click", createMaze);

/**
 * Creates a maze based on specified grid/canvas size.
 */
function createMaze() {
    grid = [];
    stack = [];

    for (let y = 0; y < gridSize; y++) {
        let row = [];
        for (let x = 0; x < gridSize; x++) {
            // Walls: Top, Right, Bottom, Left
            row.push({ x: x, y: y, visited: false, walls: [true, true, true, true] });
        }
        grid.push(row);
    }

    start = grid[0][0];
    end = grid[gridSize - 1][gridSize - 1];
    stack.push(start);
    start.visited = true;

    while (stack.length > 0) {
        let current = stack[stack.length - 1];

        // Get any unvisited neighbors
        let neighbors = getNeighbors(current).filter((n) => !n.visited);

        // If there are unvisited neighbors, set the next cell to a random neighbor and remove the wall between them
        // If not, move back in the maze and try again
        if (neighbors.length > 0) {
            let next = neighbors[Math.floor(Math.random() * neighbors.length)];
            next.visited = true;
            stack.push(next);
            removeWall(current, next);
        } else {
            stack.pop();
        }
    }

    drawMaze();
    drawCellDot(start, '#ff000080');
    drawCellDot(end, '#0000ff80');
}

/**
 * Gets the valid neighboring cells of a maze cell.
 * Checks to make sure the neighbor is within maze boundaries.
 * @param {Cell} current The current maze cell
 * @return Array of valid neighbors
 */
function getNeighbors(current) {
    currNeighbors = [];

    // Check up
    if (current.y > 0) { currNeighbors.push(grid[current.y - 1][current.x]); }
    // Check right
    if (current.x < gridSize - 1) { currNeighbors.push(grid[current.y][current.x + 1]); }
    // Check down
    if (current.y < gridSize - 1) { currNeighbors.push(grid[current.y + 1][current.x]); }
    // Check left
    if (current.x > 0) { currNeighbors.push(grid[current.y][current.x - 1]); }

    return currNeighbors;
}

/**
 * Removes a wall between two cells.
 * @param {number} current The current maze cell
 * @param {number} next The neighboring maze cell
 */
function removeWall(current, next) {
    // Removes wall between two cells to create maze path
    if (current.x - next.x == 1) {
        // Next is to the left of current
        current.walls[3] = false;
        next.walls[1] = false;
    } else if (current.x - next.x == -1) {
        // Next is to the right of current
        current.walls[1] = false;
        next.walls[3] = false;
    } else if (current.y - next.y == 1) {
        // Next is above current
        current.walls[0] = false;
        next.walls[2] = false;
    } else if (current.y - next.y == -1) {
        // Next is below current
        current.walls[2] = false;
        next.walls[0] = false;
    }
}

/**
 * Draws the created maze on the canvas
 */
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          let cell = grid[y][x];
          let xPos = x * cellSize;
          let yPos = y * cellSize;
    
          // Draw walls based on cell's wall array
          ctx.beginPath();
          if (cell.walls[0]) { ctx.moveTo(xPos, yPos); ctx.lineTo(xPos + cellSize, yPos); } // top
          if (cell.walls[1]) { ctx.moveTo(xPos + cellSize, yPos); ctx.lineTo(xPos + cellSize, yPos + cellSize); } // right
          if (cell.walls[2]) { ctx.moveTo(xPos + cellSize, yPos + cellSize); ctx.lineTo(xPos, yPos + cellSize); } // bottom
          if (cell.walls[3]) { ctx.moveTo(xPos, yPos + cellSize); ctx.lineTo(xPos, yPos); } // left
          ctx.stroke();
        }
    }
}


function drawCellDot(cell, rgbColor) {
    ctx.beginPath();
    let drawX = (cell.x * cellSize) + (cellSize / 2);
    let drawY = (cell.y * cellSize) + (cellSize / 2);
    ctx.arc(drawX, drawY, cellSize * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = rgbColor;
    ctx.fill()
    ctx.strokeStyle = rgbColor;
    ctx.stroke();
}