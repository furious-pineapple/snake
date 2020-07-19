"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
var canvas = document.getElementById("canvas");
var defaultX = canvas.width / 2;
var defaultY = canvas.height / 2;
var scale = 10;
var ctx = canvas.getContext("2d");
ctx.lineWidth = scale;
var startPosition = [
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
var foodCoordinates = [];
var direction = Directions.right;
var points = 1;
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
var updatePath = function (paths, direction) {
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
    if (path[0] === foodCoordinates[0] && path[1] === foodCoordinates[1]) {
        makeNewFood();
        points++;
    }
    paths.push({
        isCurved: isCurved,
        direction: direction,
        path: path,
    });
};
var drawSnake = function (ctx, paths) {
    ctx.beginPath();
    paths.forEach(function (_a) {
        var path = _a.path, isCurved = _a.isCurved;
        if (isCurved) {
            /* @ts-ignore */
            ctx.quadraticCurveTo.apply(ctx, path);
        }
        /* @ts-ignore */
        ctx.lineTo.apply(ctx, path);
    });
    ctx.stroke();
};
var makeNewFood = function () {
    // TODO: Improve so that it always scales with adjusting height and width
    foodCoordinates[0] = Math.floor((canvas.height / 10) * Math.random()) * 10;
    foodCoordinates[1] = Math.floor((canvas.width / 10) * Math.random()) * 10;
};
var drawFood = function () {
    // @ts-ignore;
    ctx.strokeRect.apply(ctx, __spreadArrays(foodCoordinates, [scale / 6, scale / 6]));
};
function startGame() {
    var paths = startPosition;
    trackMovement();
    makeNewFood();
    window.setInterval(function () {
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
