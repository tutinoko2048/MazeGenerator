const AIR = 0;
    const BLOCK = 1
    const Direction = { Up: 0, Down: 1, Left: 2, Right: 3 };
const canvasId = 'mazeCanvas'

document.getElementById('generate').addEventListener('click', function() {
    generateMaze()
});

class BaseGenerator {
width;
  height;
  tiles;
canvas;
constructor(width, height) {
    this.width = width;
    this.height = height;
    this.tiles = Array.from(
      new Array(this.height),
      () => new Array(this.width).fill(AIR)
    );
this.canvas = document.getElementById(canvasId);

this.clearCanvas();
}
setBlock(x, y, value) {
        this.tiles[y][x] = BLOCK;
        this.drawOnCanvas(x, y);
      }

isAir(x, y) {
    if (
      0 <= x && x <= this.width - 1&&
      0 <= y && y <= this.height - 1 &&
      this.tiles[y][x] === AIR
    ) return true;
  }

      drawOnCanvas(x, y, color = '#000') {
    
    const context = this.canvas.getContext('2d');
context.imageSmoothingEnabled = false;
context.webkitImageSmoothingEnabled = false;

    const tileSize = Math.min(this.canvas.width / this.width, this.canvas.height / this.height);

    context.fillStyle = color;
    context.fillRect(x * tileSize + 0.5, y * tileSize + 0.5, tileSize, tileSize);
}

clearCanvas() {
        
        const context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

drawSizeInfo(time) {
        const sizeInfoDiv = document.getElementById('sizeInfo');
        sizeInfoDiv.innerHTML = `Width: ${this.width}, Height: ${this.height}, ${time} ms`;
      }


}

    class StickDropGenerator extends BaseGenerator {
      
  constructor(width, height) {
    super(width, height)
    this.initWall();
    
  }
  
  initWall() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (
// outer wall
          x === 0 ||
          y === 0 ||
          x === this.width - 1 ||
          y === this.height - 1 ||
// inner wall
(x % 2 === 0 && y % 2 === 0 && 
x !== this.width - 2 && y !== this.height - 2)
          
        ) this.setBlock(x, y);
      }
    }
  }
  
  
  async generate() {
    for (let y = 2; y < this.height - 2; y += 2) {
      for (let x = 2; x < this.width - 2; x += 2) {
        const directions = [];
        if (y === 2) directions.push(Direction.Up);
        if (this.isAir(x, y + 1)) directions.push(Direction.Down);
        if (this.isAir(x - 1, y)) directions.push(Direction.Left);
        if (this.isAir(x + 1, y)) directions.push(Direction.Right);
        if (directions.length === 0) continue;
        
        const randomDirection = randomValue(directions)
        switch (randomDirection) {
          case Direction.Up: this.setBlock(x, y - 1); break;
          case Direction.Down: this.setBlock(x, y + 1); break;
          case Direction.Left: this.setBlock(x - 1, y); break;
          case Direction.Right: this.setBlock(x + 1, y); break;
        }
      }
    }
  }
}

    
async function generateMaze() {
  const maze = new StickDropGenerator(99, 99);
  const at = Date.now()
  await maze.generate();
  maze.drawSizeInfo(Date.now() - at)
}
    function random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function randomValue(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms))
}


function weightedRandom(...values) {
  const totalWeight = values.reduce((sum, [, weight]) => sum + weight, 0);
  let randomValue = Math.random() * totalWeight;

  for (const [value, weight] of values) {
    if (randomValue < weight) {
      return value;
    }
    randomValue -= weight;
  }
  return values[values.length - 1][0];
}
