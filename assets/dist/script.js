"use strict";
var _a;
var Directions;
(function (Directions) {
    Directions[Directions["right"] = 39] = "right";
    Directions[Directions["left"] = 37] = "left";
    Directions[Directions["up"] = 38] = "up";
    Directions[Directions["down"] = 40] = "down";
})(Directions || (Directions = {}));
var DirectionUnits = (_a = {},
    _a[Directions.right] = 10,
    _a[Directions.left] = -10,
    _a[Directions.up] = -10,
    _a[Directions.down] = 10,
    _a);
var scale = 10;
var canvas = document.getElementById("canvas");
var defaultX = canvas.width / 2;
var defaultY = canvas.height / 2;
var defaultPoints = 1;
var defaultDirection = Directions.right;
var defaultPosition = [
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
var ctx = canvas.getContext("2d");
ctx.lineWidth = scale;
var foodCoordinates = [];
var direction = defaultDirection;
var points = defaultPoints;
var paths = defaultPosition;
var trackMovement = function () {
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
var updatePath = function (direction) {
    var isCurved = true;
    var path;
    var lastPath = paths[paths.length - 1];
    var _a = lastPath.path, x = _a[0], y = _a[1];
    // Straight line
    if (lastPath.direction === direction) {
        isCurved = false;
        if (direction === Directions.up || direction === Directions.down) {
            path = [x, y + DirectionUnits[direction]];
        }
        else {
            path = [x + DirectionUnits[direction], lastPath.path[1]];
        }
    }
    else if (direction === Directions.left || direction === Directions.right) {
        // Curves along the x axis
        path = [x + DirectionUnits[direction], y, x, y];
    }
    else {
        // Curves along the y axis
        path = [x, y + DirectionUnits[direction], x, y];
    }
    // Check if food has been eaten
    if (path[0] === foodCoordinates[0] && path[1] === foodCoordinates[1]) {
        makeFood();
        points++;
    }
    paths.push({
        isCurved: isCurved,
        direction: direction,
        path: path,
    });
};
var drawSnake = function () {
    if (ctx) {
        ctx.beginPath();
        paths.forEach(function (_a) {
            var path = _a.path, isCurved = _a.isCurved;
            if (isCurved) {
                // @ts-ignore
                ctx.quadraticCurveTo.apply(ctx, path);
            }
            // @ts-ignore
            ctx.lineTo.apply(ctx, path);
        });
        ctx.stroke();
    }
};
var drawFood = function () {
    var x = foodCoordinates[0], y = foodCoordinates[1];
    ctx.strokeRect(x, y, scale / 6, scale / 6);
};
var makeFood = function () {
    // TODO: Improve so that it always scales with adjusting height and width
    foodCoordinates[0] = Math.floor((canvas.height / 10) * Math.random()) * 10;
    foodCoordinates[1] = Math.floor((canvas.width / 10) * Math.random()) * 10;
};
var hasCrashed = function () {
    // TODO: Add logic
    return false;
};
var resetGame = function () {
    paths = defaultPosition;
    points = defaultPoints;
    direction = defaultDirection;
};
var startGame = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (hasCrashed())
        resetGame();
    if (paths.length === points + 2)
        paths.shift();
    updatePath(direction);
    drawSnake();
    drawFood();
};
trackMovement();
makeFood();
window.setInterval(startGame, 100);
// TODO:  Add button to stop game
