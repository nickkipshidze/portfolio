// Basic conway's game of life code
class GameOfLife {
    constructor(canvasId, cellSize = 30, colorAlive = "rgba(255, 255, 255, 1)", colorDead = "rgba(255, 255, 255, 0.2)", delay = 128) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.cellSize = cellSize;
        this.life = [];

        this.colorAlive = colorAlive;
        this.colorDead = colorDead;

        this.delay = delay;
    }

    makeLife(width, height) {
        let life = [];

        for (let y = 0; y < height; y++) {
            life.push([]);
            for (let x = 0; x < width; x++) {
                life[y].push(0);
            }
        }

        return life;
    }

    drawGlider(grid, x, y) {
        //            ## 
        //              ##
        //          ######
        //
        // Thats my profile picture (:
        
        const coordinates = [
                    [0, 1],

                            [1, 2],

            [2, 0], [2, 1], [2, 2]
        ];

        for (const coord of coordinates) {
            coord[0] += y;
            coord[1] += x;

            if (coord[0] >= grid.length) coord[0] -= grid.length;
            if (coord[0] < 0) coord[0] += grid.length;
            if (coord[1] >= grid[0].length) coord[1] -= grid[0].length;
            if (coord[1] < 0) coord[1] += grid[0].length;

            grid[coord[0]][coord[1]] = 1;
        }
    }

    drawGliders(grid, gliderCount) {
        const spacing = Math.floor(grid[0].length / (gliderCount + 1));

        for (let i = 1; i <= gliderCount; i++) {
            const x = i * spacing;
            const y = Math.floor(Math.random() * (grid.length - 2)) + 1;
            this.drawGlider(grid, x, y);
        }
    }

    drawGrid(grid) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === 1) {
                    this.context.fillRect(
                        x * this.cellSize, y * this.cellSize,
                        this.cellSize, this.cellSize
                    );
                }
            }
        }
    }

    countNeighbors(grid, x, y) {
        const width = grid[0].length;
        const height = grid.length;
        let count = 0;

        for (let offsetY = -1; offsetY <= 1; offsetY++) {
            for (let offsetX = -1; offsetX <= 1; offsetX++) {
                if (offsetX === 0 && offsetY === 0) {
                    continue;
                }

                const neighborX = (x + offsetX + width) % width;
                const neighborY = (y + offsetY + height) % height;

                if (grid[neighborY][neighborX] === 1) {
                    count++;
                }
            }
        }

        return count;
    }

    applyRules(grid, nextGrid, x, y) {
        const numNeighbors = this.countNeighbors(grid, x, y);

        if (grid[y][x] === 1) {
            if (numNeighbors < 2)
                nextGrid[y][x] = 0;
            else if (numNeighbors === 2 || numNeighbors === 3)
                nextGrid[y][x] = 1;
            else if (numNeighbors > 3)
                nextGrid[y][x] = 0;
        } else if (grid[y][x] === 0) {
            if (numNeighbors === 3)
                nextGrid[y][x] = 1;
        }
    }

    updateGrid(grid) {
        const nextGrid = grid.map((innerArray) => innerArray.slice());

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                this.applyRules(grid, nextGrid, x, y);
            }
        }

        return nextGrid;
    }

    updateCanvas() {
        if (
            this.canvas.width !== window.innerWidth ||
            this.canvas.height !== window.innerHeight
        ) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.life = this.makeLife(
                Math.floor(window.innerWidth / this.cellSize),
                Math.floor(window.innerHeight / this.cellSize)
            );

            try {
                this.drawGliders(
                    this.life,
                    Math.floor(window.innerWidth / (this.cellSize * 16)) + 1
                );
            } catch (error) {
                console.log(error);
            }
        }

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillStyle = this.colorDead;
        this.drawGrid(this.life);

        this.life = this.updateGrid(this.life);

        this.context.fillStyle = this.colorAlive;
        this.drawGrid(this.life);

        setTimeout(() => this.updateCanvas(), this.delay);
    }
}

// First section has no variable assigned to it
new GameOfLife("life-canvas-1").updateCanvas();

// Second section is assigned to the variable "game"
// which is used for managing "mousemove" events on it
const game = new GameOfLife(
    "life-canvas-2", 30, 
    "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.2)"
);
game.updateCanvas();

// Code for interactive section
game.canvas.addEventListener("mousemove", (event) => {
    const rect = game.canvas.getBoundingClientRect();
    let y = Math.floor((event.clientY - rect.top) / game.cellSize);
    let x = Math.floor((event.clientX - rect.left) / game.cellSize);

    if (game.life.length > y > 0 && game.life[0].length > x > 0)
        game.life[y][x] = 1;
});
