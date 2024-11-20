/**
 * @summary Generates and draws a maze based on specified canvas/grid size.
 * @author TimMagwood <timothy.magwood@gmail.com>
 *
 * Created:     2024-11-16
 * Modified:    2024-11-16
 */

const canvas = document.getElementById("mazeCanvas");
canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

const mazeStatus = document.getElementById("mazeStatus");
const ctx = canvas.getContext("2d");

const canvasSize = 500;
canvas.width = canvasSize;
canvas.height = canvasSize;

let grid;
const gridSize = 20;
const cellSize = canvasSize / gridSize;

let start;
let setStartFlag;
let end;
let setEndFlag;

document.getElementById("generateMaze").addEventListener("click", createMaze);
document.getElementById("changeStart").addEventListener("click", function() {setStartFlag = true;});
document.getElementById("changeEnd").addEventListener("click", function() {setEndFlag = true;});

/**
 * Creates a maze based on specified grid/canvas size.
 */
function createMaze() {
    mazeStatus.innerText = 'Generating maze.';
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
    shadeCell(start, '#00ff0080');
    shadeCell(end, '#ff000080');
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
    for (let x = 0; x < gridSize; y++) {
        for (let y = 0; y < gridSize; x++) {
          let cell = grid[x][y];
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

/**
 * Gets the cursor position on the canvas when a user clicks it
 * @param canvas The maze canvas that the user is clicking on
 * @param event The mouse click event
 */
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    if (setStartFlag) {
        // Clean current fill from start point
        // Set new start point to clicked location
        start = grid[Math.floor(x / cellSize)][Math.floor(y / cellSize)];
        // Draw fill on new location
        shadeCell(start, '#00ff0080');
        // Reset flag
        setStartFlag = false;
    } else if (setEndFlag) {
        // Clean current fill from end point
        // Set new end point to clicked location
        end = grid[Math.floor(x / cellSize)][Math.floor(y / cellSize)];
        // Draw fill on new location
        shadeCell(end, '#ff000080');
        // Reset flag
        setEndFlag = false;
    }
}

/**
 * Allows the user to click a spot on the grid to set as the new start point
 */
function changeStart() {
    setStartFlag = true;
}

/**
 * Allows the user to click a spot on the grid to set as the new end point
 */
function changeEnd() {

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

function shadeCell(cell, rgbColor) {
    ctx.beginPath();
    ctx.rect(cell.x * cellSize + 1, cell.y * cellSize + 1, cellSize - 2, cellSize - 2);
    ctx.fillStyle = rgbColor;
    ctx.fill()
    ctx.strokeStyle = rgbColor;
    ctx.stroke();
}