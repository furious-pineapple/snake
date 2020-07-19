type snakeTracker = {
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

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const defaultX = canvas.width / 2;
const defaultY = canvas.height / 2;

const scale = 10;

const ctx = canvas!.getContext("2d");
ctx!.lineWidth = scale;

const startPosition: snakeTracker[] = [
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

const foodCoordinates: number[] = [];
let direction = Directions.right;
let points = 1;

const trackMovement = () => {
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

const updatePath = (paths: snakeTracker[], direction: Directions) => {
  let isCurved = true;
  let path;
  const lastPath = paths[paths.length - 1];
  const [x, y] = lastPath.path;
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
  if (path[0] === foodCoordinates[0] && path[1] === foodCoordinates[1]) {
    makeNewFood();
    points++;
  }
  paths.push({
    isCurved,
    direction,
    path,
  });
};

const drawSnake = (ctx: CanvasRenderingContext2D, paths: snakeTracker[]) => {
  ctx.beginPath();
  paths.forEach(({ path, isCurved }) => {
    if (isCurved) {
      /* @ts-ignore */
      ctx.quadraticCurveTo(...path);
    }
    /* @ts-ignore */
    ctx.lineTo(...path);
  });
  ctx.stroke();
};

const makeNewFood = () => {
  // TODO: Improve so that it always scales with adjusting height and width
  foodCoordinates[0] = Math.floor((canvas.height / 10) * Math.random()) * 10;
  foodCoordinates[1] = Math.floor((canvas.width / 10) * Math.random()) * 10;
};

const drawFood = () => {
  // @ts-ignore;
  ctx.strokeRect(...foodCoordinates, scale / 6, scale / 6);
};

function startGame() {
  const paths: snakeTracker[] = startPosition;
  trackMovement();
  makeNewFood();
  window.setInterval(() => {
    /* @ts-ignore */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (paths.length === points + 2) {
      paths.shift();
    }
    updatePath(paths, direction);
    /* @ts-ignore */
    drawSnake(ctx, paths);
    drawFood();
  }, 100);
}

startGame();
