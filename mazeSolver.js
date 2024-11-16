/**
 * @summary Generates and draws a maze based on specified canvas/grid size.
 * @author TimMagwood <timothy.magwood@gmail.com>
 *
 * Created:     2024-11-12
 * Modified:    2024-11-16
 */

const { grid } = require('./mazeGenerator.js');

document.getElementById("generateMaze").addEventListener("click", createMaze);