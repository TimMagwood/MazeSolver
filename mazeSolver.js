const canvas = document.getElementById("mazeCanvas");
const context = canvas.getContext("2d");

const canvasSize = 500;
canvas.width = canvasSize;
canvas.height = canvasSize;

const gridSize = 20;
const cellSize = canvasSize / gridSize;

document.getElementById("generateMaze").addEventListener("click", createMaze);

function createMaze() {
    grid = [];
    stack = [];

    for (let y = 0; y < gridSize; y++) {
        let row = [];
        for (let x = 0; x < gridSize; x++) {
            row.push({ visited: false, walls: [true, true, true, true] });
        }
        grid.push(row);
    }

    let start = grid[0][0];
    stack.push(start);
    start.visited = true;

    while (stack.length > 0) {
        let current = stack[stack.length - 1];
        let [x, y] = [grid.indexOf(current), current.indexOf(current)];

        // Get any unvisited neighbors
        let neighbors = getNeighbors(x, y).filter((n) => !n.visited);

        // If there are unvisited neighbors, set the next cell to a random one and remove the wall between them
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
}

function getNeighbors(x, y) {
    // Returns an array of valid neighbors (top, right, bottom, left)
    // Need to check that we are within maze boundaries
}

function removeWall(current, next) {
    // Removes wall between two cells to create maze path
}

function drawMaze() {
    context.clearRect(0, 0, canvas.width, canvas.height);

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
