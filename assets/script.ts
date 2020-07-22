type snakePath = {
  isCurved: boolean;
  path: number[];
  direction: Directions;
};

enum Directions {
  right = 39,
  left = 37,
  up = 38,
  down = 40,
}

const DirectionUnits = {
  [Directions.right]: 10,
  [Directions.left]: -10,
  [Directions.up]: -10,
  [Directions.down]: 10,
};

const scale = 10;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const defaultX = canvas.width / 2;
const defaultY = canvas.height / 2;

const defaultPoints = 1;
const defaultDirection = Directions.right;
const defaultPosition: snakePath[] = [
  {
    isCurved: false,
    path: [defaultX, defaultY],
    direction: Directions.right,
  },
  {
    isCurved: false,
    path: [defaultX + 10, defaultY],
    direction: Directions.right,
  },
  {
    isCurved: false,
    path: [defaultX + 20, defaultY],
    direction: Directions.right,
  },
];

const ctx = canvas!.getContext("2d");
ctx!.lineWidth = scale;

const foodCoordinates: number[] = [];
let direction = defaultDirection;
let points = defaultPoints;
let paths: snakePath[] = [...defaultPosition];

const trackMovement = (): void => {
  // Setup events to track snake direction
  document.addEventListener("keydown", function (event) {
    switch (event.which) {
      case Directions.left:
        direction =
          direction !== Directions.right ? Directions.left : direction;
        break;
      case Directions.right:
        direction =
          direction !== Directions.left ? Directions.right : direction;
        break;

      case Directions.up:
        direction = direction !== Directions.down ? Directions.up : direction;
        break;

      case Directions.down:
        direction = direction !== Directions.up ? Directions.down : direction;
        break;
    }
  });
};

const updatePath = (direction: Directions): void => {
  const lastPath = paths[paths.length - 1];
  const [x, y] = lastPath.path;
  let isCurved = true;
  let path;
  // Straight line
  if (lastPath.direction === direction) {
    isCurved = false;
    if (direction === Directions.up || direction === Directions.down) {
      path = [x, y + DirectionUnits[direction]];
    } else {
      path = [x + DirectionUnits[direction], lastPath.path[1]];
    }
  } else if (direction === Directions.left || direction === Directions.right) {
    // Curves along the x axis
    path = [x + DirectionUnits[direction], y, x, y];
  } else {
    // Curves along the y axis
    path = [x, y + DirectionUnits[direction], x, y];
  }
  // Check if food has been eaten
  if (path.join("") === foodCoordinates.join("")) {
    updateScore();
    makeFood();
  }
  paths.push({
    isCurved,
    direction,
    path,
  });
};

const drawSnake = (): void => {
  if (ctx) {
    ctx.beginPath();
    paths.forEach(({ path, isCurved }) => {
      if (isCurved) {
        // @ts-ignore
        ctx.quadraticCurveTo(...path);
      }
      // @ts-ignore
      ctx.lineTo(...path);
    });
    ctx.stroke();
  }
};

const drawFood = (): void => {
  const [x, y] = foodCoordinates;
  ctx!.strokeRect(x, y, scale / 6, scale / 6);
};

const makeFood = (): void => {
  foodCoordinates[0] = Math.floor((canvas.height / 10) * Math.random()) * 10;
  foodCoordinates[1] = Math.floor((canvas.width / 10) * Math.random()) * 10;
};

const updateScore = () => {
  points += 1;
  const pointsTextNode = document.querySelector("#points");
  if (pointsTextNode) pointsTextNode.innerHTML = `${points}00`;
};

const hasCrashed = (): boolean => {
  const currentPath = paths[paths.length - 1];
  let hasCrashed = false;
  // Check if path is outside border
  if (
    currentPath.path[0] < 0 ||
    currentPath.path[0] > canvas.width ||
    currentPath.path[1] < 0 ||
    currentPath.path[1] > canvas.height
  ) {
    hasCrashed = true;
  }
  if (!hasCrashed) {
    paths.forEach(({ path }, index) => {
      if (!hasCrashed && index !== paths.length - 1) {
        if (path.join() === currentPath.path.join()) {
          hasCrashed = true;
        }
      }
    });
  }
  return hasCrashed;
};

const resetGame = () => {
  paths = [...defaultPosition];
  points = defaultPoints;
  direction = defaultDirection;
};

const startGame = () => {
  ctx!.clearRect(0, 0, canvas.width, canvas.height);
  if (hasCrashed()) resetGame();
  if (paths.length === points + 2) paths.shift();
  updatePath(direction);
  drawSnake();
  drawFood();
};

trackMovement();
makeFood();
window.setInterval(startGame, 100);

// TODO:  Add button to stop game
