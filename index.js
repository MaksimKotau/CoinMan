/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/context/index.ts":
/*!******************************!*\
  !*** ./src/context/index.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var GameContext = /** @class */ (function () {
    function GameContext() {
        var _this = this;
        this.context = null;
        this.initContext = function (context) {
            _this.context = context;
        };
    }
    GameContext.prototype.set = function (data) {
        if (this.context === null) {
            throw new Error('Context is not initialized');
        }
        this.context = __assign(__assign({}, this.context), data);
    };
    GameContext.prototype.get = function () {
        if (this.context === null) {
            throw new Error('Context is not initialized');
        }
        return this.context;
    };
    return GameContext;
}());
var gameContext = new GameContext();
exports["default"] = gameContext;


/***/ }),

/***/ "./src/events/eventHandler.ts":
/*!************************************!*\
  !*** ./src/events/eventHandler.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.mouseClickHandler = void 0;
var context_1 = __webpack_require__(/*! ../context */ "./src/context/index.ts");
var gameStateType_1 = __webpack_require__(/*! ../types/gameStateType */ "./src/types/gameStateType.ts");
var mouseClickHandler = function (data) {
    var x = data.x, y = data.y, start = data.start, restart = data.restart;
    var gameState = context_1["default"].get().gameState;
    if (gameState === gameStateType_1.GameState.GAME_NOT_STARTED) {
        if (x >= 220 && x <= 350 && y >= 400 && y <= 440) {
            start();
        }
    }
    if (gameState === gameStateType_1.GameState.GAME_COMPLETED ||
        gameState === gameStateType_1.GameState.GAME_OVER) {
        if (x >= 210 && x <= 360 && y >= 500 && y <= 540) {
            restart();
        }
    }
};
exports.mouseClickHandler = mouseClickHandler;


/***/ }),

/***/ "./src/level/level.ts":
/*!****************************!*\
  !*** ./src/level/level.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Level = void 0;
var context_1 = __webpack_require__(/*! ../context */ "./src/context/index.ts");
var constants_1 = __webpack_require__(/*! ../maps/constants */ "./src/maps/constants.ts");
var enemy_1 = __webpack_require__(/*! ../renders/enemy */ "./src/renders/enemy.ts");
var mapRenderer_1 = __webpack_require__(/*! ../renders/mapRenderer */ "./src/renders/mapRenderer.ts");
var player_1 = __webpack_require__(/*! ../renders/player */ "./src/renders/player.ts");
var popup_1 = __webpack_require__(/*! ../renders/popup */ "./src/renders/popup.ts");
var utils_1 = __webpack_require__(/*! ../renders/utils */ "./src/renders/utils.ts");
var gameStateType_1 = __webpack_require__(/*! ../types/gameStateType */ "./src/types/gameStateType.ts");
var levelStateType_1 = __webpack_require__(/*! ../types/levelStateType */ "./src/types/levelStateType.ts");
var Level = /** @class */ (function () {
    function Level(level, onEarningPoints, onLevelCompleted) {
        var _this = this;
        this.mapData = null;
        this.player = null;
        this.enemies = [];
        this.onEarningPoints = null;
        this.onLevelCompleted = null;
        this.level = null;
        this.handleDirectionChange = function (direction) {
            _this.player.handleDirectionChange(direction);
        };
        this.startLevel = function () {
            setTimeout(function () { return context_1["default"].set({ levelState: levelStateType_1.LevelState.LEVEL_IN_PROGRESS }); }, 3000);
        };
        this.render = function () {
            var _a = context_1["default"].get(), levelState = _a.levelState, levelIndex = _a.levelIndex, lives = _a.lives;
            (0, mapRenderer_1.renderMap)(_this.mapData);
            _this.player.render();
            _this.enemies.forEach(function (enemy) {
                enemy.render();
            });
            if (levelState === levelStateType_1.LevelState.LEVEL_NOT_STARTED) {
                (0, popup_1.renderPopup)('info', ["Level ".concat(levelIndex + 1)]);
            }
            if (levelState === levelStateType_1.LevelState.PLAYER_DIED) {
                (0, popup_1.renderPopup)('warn', [
                    'Coinman died...',
                    "".concat(lives, " ").concat(lives === 1 ? 'life' : 'lives', " left")
                ]);
            }
            if (levelState === levelStateType_1.LevelState.LEVEL_COMPLETED) {
                (0, popup_1.renderPopup)('info', [
                    'Congratulations!!!',
                    "Level ".concat(levelIndex + 1, " completed!!!")
                ]);
            }
        };
        this.onEatingDot = function (data) {
            _this.onEarningPoints(1);
            _this.mapData[data.row][data.col] = constants_1.EMPTY_ZONE;
            var dotsLeft = (0, utils_1.numberOfDotsLeftOnMap)(_this.mapData);
            var _a = context_1["default"].get(), levelsCount = _a.levelsCount, levelIndex = _a.levelIndex;
            if (dotsLeft === 0) {
                if (levelIndex + 1 === levelsCount) {
                    _this.onLevelCompleted();
                }
                else {
                    context_1["default"].set({ levelState: levelStateType_1.LevelState.LEVEL_COMPLETED });
                    setTimeout(function () { return _this.onLevelCompleted(); }, 3000);
                }
            }
        };
        this.move = function () {
            if (context_1["default"].get().levelState === levelStateType_1.LevelState.LEVEL_IN_PROGRESS) {
                _this.player.move(_this.mapData, _this.onEatingDot);
                _this.enemies.forEach(function (enemy) {
                    enemy.move(_this.mapData);
                });
                _this.detectEnemiesCollision();
            }
        };
        this.detectEnemiesCollision = function () {
            var enemyID = (0, utils_1.getEnemyCollisionID)(_this.player, _this.enemies);
            if (enemyID !== null) {
                var lives = context_1["default"].get().lives;
                context_1["default"].set({ lives: --lives });
                if (context_1["default"].get().lives > 0) {
                    _this.resetAfterPlayerDie();
                    context_1["default"].set({ levelState: levelStateType_1.LevelState.PLAYER_DIED });
                    setTimeout(function () { return context_1["default"].set({ levelState: levelStateType_1.LevelState.LEVEL_IN_PROGRESS }); }, 3000);
                }
                else {
                    context_1["default"].set({ gameState: gameStateType_1.GameState.GAME_OVER });
                }
            }
        };
        this.resetAfterPlayerDie = function () {
            _this.player = new player_1.Player(_this.level.player_start_position.x, _this.level.player_start_position.y);
            _this.enemies = [];
            _this.level.enemies_start_position.forEach(function (en, index) {
                _this.enemies.push(new enemy_1.Enemy(en.y, en.x, index));
            });
        };
        this.mapData = JSON.parse(JSON.stringify(level.map));
        this.level = JSON.parse(JSON.stringify(level));
        this.onEarningPoints = onEarningPoints;
        this.onLevelCompleted = onLevelCompleted;
        this.player = new player_1.Player(level.player_start_position.x, level.player_start_position.y);
        level.enemies_start_position.forEach(function (en, index) {
            _this.enemies.push(new enemy_1.Enemy(en.y, en.x, index));
        });
    }
    return Level;
}());
exports.Level = Level;


/***/ }),

/***/ "./src/maps/constants.ts":
/*!*******************************!*\
  !*** ./src/maps/constants.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.CONCRETE_COLOR = exports.BRICK_COLOR = exports.TOOLBAR_HEIGHT = exports.COLLISION_DISTANCE = exports.BRICKS_COUNT = exports.SCREEN_SIZE = exports.TILE_SIZE = exports.PLAYER_SPEED = exports.ENEMY_COLORS = exports.ENEMY_SIZE = exports.PLAYER_COLOR = exports.PLAYER_SIZE = exports.INITIAL_LIVES_COUNT = exports.DOT_ZONE = exports.WALL_ZONE = exports.EMPTY_ZONE = void 0;
exports.EMPTY_ZONE = 0;
exports.WALL_ZONE = 1;
exports.DOT_ZONE = 2;
exports.INITIAL_LIVES_COUNT = 3;
exports.PLAYER_SIZE = 26;
exports.PLAYER_COLOR = 'yellow';
exports.ENEMY_SIZE = 20;
exports.ENEMY_COLORS = [
    '#CF0063',
    '#5dd39e',
    '#348aa7',
    '#513b56',
    '#ff006e',
    '#b5e48c',
    '#d90429',
    '#fb8b24'
];
exports.PLAYER_SPEED = 1;
exports.TILE_SIZE = 30;
exports.SCREEN_SIZE = 570;
exports.BRICKS_COUNT = exports.SCREEN_SIZE / exports.TILE_SIZE;
exports.COLLISION_DISTANCE = 20;
exports.TOOLBAR_HEIGHT = 30;
exports.BRICK_COLOR = '#AA4E54';
exports.CONCRETE_COLOR = '#E6D7E5';


/***/ }),

/***/ "./src/maps/level_1.ts":
/*!*****************************!*\
  !*** ./src/maps/level_1.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.level1 = void 0;
var map1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
exports.level1 = {
    map: map1,
    player_start_position: { x: 17, y: 17 },
    enemies_start_position: [
        { x: 9, y: 9 },
        { x: 9, y: 10 },
        { x: 9, y: 8 }
    ]
};


/***/ }),

/***/ "./src/maps/level_2.ts":
/*!*****************************!*\
  !*** ./src/maps/level_2.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.level2 = void 0;
var map1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
exports.level2 = {
    map: map1,
    player_start_position: { x: 17, y: 17 },
    enemies_start_position: [
        { x: 9, y: 9 },
        { x: 9, y: 10 },
        { x: 9, y: 8 },
        { x: 9, y: 9 }
    ]
};


/***/ }),

/***/ "./src/maps/level_3.ts":
/*!*****************************!*\
  !*** ./src/maps/level_3.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.level3 = void 0;
var map1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
exports.level3 = {
    map: map1,
    player_start_position: { x: 17, y: 17 },
    enemies_start_position: [
        { x: 9, y: 9 },
        { x: 9, y: 9 },
        { x: 9, y: 9 },
        { x: 9, y: 9 },
        { x: 9, y: 9 }
    ]
};


/***/ }),

/***/ "./src/renders/enemy.ts":
/*!******************************!*\
  !*** ./src/renders/enemy.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Enemy = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/renders/utils.ts");
var constants_1 = __webpack_require__(/*! ../maps/constants */ "./src/maps/constants.ts");
var utils_2 = __webpack_require__(/*! ./utils */ "./src/renders/utils.ts");
var context_1 = __webpack_require__(/*! ../context */ "./src/context/index.ts");
var Enemy = /** @class */ (function () {
    function Enemy(col, row, id) {
        var _this = this;
        this.x = null;
        this.y = null;
        this.id = null;
        this.color = null;
        this.direction = null;
        this.render = function () {
            var ctx = context_1["default"].get().graphicContext;
            ctx.beginPath();
            ctx.arc(_this.x + constants_1.TILE_SIZE / 2, _this.y + constants_1.TILE_SIZE / 2, constants_1.ENEMY_SIZE / 2, 0, Math.PI * 2);
            ctx.fillStyle = _this.color;
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(_this.x + 18, _this.y + 11);
            ctx.lineTo(_this.x + 27, _this.y + 6);
            ctx.lineTo(_this.x + 20, _this.y + 20);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(_this.x + 20, _this.y + 10);
            ctx.lineTo(_this.x + 29, _this.y + 15);
            ctx.lineTo(_this.x + 20, _this.y + 20);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(_this.x + 20, _this.y + 16);
            ctx.lineTo(_this.x + 27, _this.y + 24);
            ctx.lineTo(_this.x + 18, _this.y + 22);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(_this.x + 20, _this.y + 20);
            ctx.lineTo(_this.x + 15, _this.y + 29);
            ctx.lineTo(_this.x + 10, _this.y + 20);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(_this.x + 12, _this.y + 22);
            ctx.lineTo(_this.x + 3, _this.y + 24);
            ctx.lineTo(_this.x + 10, _this.y + 16);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(_this.x + 10, _this.y + 10);
            ctx.lineTo(_this.x + 1, _this.y + 15);
            ctx.lineTo(_this.x + 10, _this.y + 20);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(_this.x + 12, _this.y + 11);
            ctx.lineTo(_this.x + 3, _this.y + 6);
            ctx.lineTo(_this.x + 10, _this.y + 20);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(_this.x + 20, _this.y + 10);
            ctx.lineTo(_this.x + 15, _this.y + 1);
            ctx.lineTo(_this.x + 10, _this.y + 10);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.ellipse(_this.x + 19, _this.y + 12, 2, 3, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.ellipse(_this.x + 11, _this.y + 12, 2, 3, (Math.PI * 7) / 4, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(_this.x + 12, _this.y + 13, 1, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(_this.x + 18, _this.y + 13, 1, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
        };
        this.move = function (map) {
            var availableDirections = _this.getAvailableDirections(map);
            var directionToMove = null;
            if (availableDirections.length === 1) {
                directionToMove = availableDirections[0];
            }
            else if (availableDirections.length === 2) {
                if (availableDirections.includes(_this.direction)) {
                    directionToMove = _this.direction;
                }
                else {
                    directionToMove = availableDirections[(0, utils_2.getRandomInteger)(1)];
                }
            }
            else {
                var reversDirection_1 = (0, utils_2.getReverseDirection)(_this.direction);
                if (availableDirections.includes(_this.direction)) {
                    directionToMove = availableDirections.filter(function (el) { return el !== reversDirection_1; })[(0, utils_2.getRandomInteger)(availableDirections.length - 1)];
                }
                else {
                    directionToMove =
                        availableDirections[(0, utils_2.getRandomInteger)(availableDirections.length - 1)];
                }
            }
            switch (directionToMove) {
                case 'Down':
                    _this.y = _this.y + constants_1.PLAYER_SPEED;
                    break;
                case 'Left':
                    _this.x = _this.x - constants_1.PLAYER_SPEED;
                    break;
                case 'Right':
                    _this.x = _this.x + constants_1.PLAYER_SPEED;
                    break;
                case 'Up':
                    _this.y = _this.y - constants_1.PLAYER_SPEED;
                    break;
            }
            _this.direction = directionToMove;
        };
        this.getAvailableDirections = function (map) {
            var allDirections = ['Up', 'Down', 'Left', 'Right'];
            return allDirections.filter(function (el) {
                return _this.canTurnToDirection(map, el);
            });
        };
        this.canTurnToDirection = function (map, direction) {
            return !(0, utils_1.hasWallCollision)({ x: _this.x, y: _this.y }, map, direction);
        };
        this.getCoordinates = function () {
            return {
                x: _this.x,
                y: _this.y
            };
        };
        this.getDirection = function () {
            return _this.direction;
        };
        this.getID = function () { return _this.id; };
        this.id = id;
        this.x = col * constants_1.TILE_SIZE;
        this.y = row * constants_1.TILE_SIZE;
        this.color = (0, utils_2.getRandomEnemyColor)();
    }
    return Enemy;
}());
exports.Enemy = Enemy;


/***/ }),

/***/ "./src/renders/gameFinishedRenderer.ts":
/*!*********************************************!*\
  !*** ./src/renders/gameFinishedRenderer.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.renderGameFinished = void 0;
var context_1 = __webpack_require__(/*! ../context */ "./src/context/index.ts");
var constants_1 = __webpack_require__(/*! ../maps/constants */ "./src/maps/constants.ts");
var gameStateType_1 = __webpack_require__(/*! ../types/gameStateType */ "./src/types/gameStateType.ts");
var results = [
    { name: 'Pavel', scores: 1000 },
    { name: 'Max', scores: 500 },
    { name: 'Dimon', scores: 300 }
];
var renderGameFinished = function () {
    var _a = context_1["default"].get(), ctx = _a.graphicContext, scores = _a.scores, gameState = _a.gameState;
    ctx.beginPath();
    ctx.font = "bold ".concat(gameState === gameStateType_1.GameState.GAME_OVER ? 90 : 50, "px sans-serif");
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = gameState === gameStateType_1.GameState.GAME_OVER ? '#f44336' : '#7b1fa2';
    ctx.shadowBlur = 50;
    ctx.fillStyle = gameState === gameStateType_1.GameState.GAME_OVER ? '#f44336' : '#7b1fa2';
    ctx.fillText(gameState === gameStateType_1.GameState.GAME_OVER ? 'GAME OVER' : 'YOU WON THE GAME', 285, 150);
    ctx.rect(210, 500, 150, 40);
    ctx.fillStyle = gameState === gameStateType_1.GameState.GAME_OVER ? '#f44336' : '#7b1fa2';
    ctx.fill();
    ctx.shadowColor = 'none';
    ctx.shadowBlur = 0;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RESTART', 285, 520);
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('Best scores:', 285, 250);
    ctx.font = 'bold 20px sans-serif';
    var records = __spreadArray(__spreadArray([], results, true), [{ name: 'You', scores: scores }], false).sort(function (a, b) { return b.scores - a.scores; });
    records.forEach(function (el, index) {
        ctx.fillStyle = el.name === 'You' ? '#7b1fa2' : 'white';
        ctx.textAlign = 'left';
        ctx.fillText("".concat(index + 1, ". ").concat(el.name), 100, 320 + index * 40);
        ctx.textAlign = 'right';
        ctx.fillText("".concat(new Array(54 - el.name.length - el.scores.toString().length)
            .fill(null)
            .map(function () { return '.'; })
            .join(''), " ").concat(el.scores), constants_1.SCREEN_SIZE - 100, 320 + index * 40);
    });
    ctx.closePath();
};
exports.renderGameFinished = renderGameFinished;


/***/ }),

/***/ "./src/renders/gameToolbar.ts":
/*!************************************!*\
  !*** ./src/renders/gameToolbar.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.renderGameToolbar = void 0;
var constants_1 = __webpack_require__(/*! ../maps/constants */ "./src/maps/constants.ts");
var context_1 = __webpack_require__(/*! ../context */ "./src/context/index.ts");
var renderGameToolbar = function () {
    var _a = context_1["default"].get(), lives = _a.lives, ctx = _a.graphicContext;
    ctx.beginPath();
    ctx.rect(0, constants_1.SCREEN_SIZE, constants_1.SCREEN_SIZE, constants_1.TOOLBAR_HEIGHT);
    ctx.strokeStyle = constants_1.CONCRETE_COLOR;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    for (var i = 0; i < lives; i++) {
        renderHeart(i);
    }
    renderScores();
    renderLevelNumber();
};
exports.renderGameToolbar = renderGameToolbar;
var renderHeart = function (index) {
    var ctx = context_1["default"].get().graphicContext;
    ctx.beginPath();
    ctx.arc(10 + index * constants_1.TILE_SIZE, constants_1.SCREEN_SIZE + 10, 5, 0, Math.PI, true);
    ctx.arc(20 + index * constants_1.TILE_SIZE, constants_1.SCREEN_SIZE + 10, 5, 0, Math.PI, true);
    ctx.moveTo(25 + index * constants_1.TILE_SIZE, constants_1.SCREEN_SIZE + 10);
    ctx.bezierCurveTo(25 + index * constants_1.TILE_SIZE, constants_1.SCREEN_SIZE + 14, 20 + index * constants_1.TILE_SIZE, constants_1.SCREEN_SIZE + 22, 15 + index * constants_1.TILE_SIZE, constants_1.SCREEN_SIZE + 25);
    ctx.bezierCurveTo(10 + index * constants_1.TILE_SIZE, constants_1.SCREEN_SIZE + 22, 5 + index * constants_1.TILE_SIZE, constants_1.SCREEN_SIZE + 14, 5 + index * constants_1.TILE_SIZE, constants_1.SCREEN_SIZE + 10);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
};
var renderScores = function () {
    var _a = context_1["default"].get(), ctx = _a.graphicContext, scores = _a.scores;
    ctx.beginPath();
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'end';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText("SCORES: ".concat(scores), constants_1.SCREEN_SIZE - 5, constants_1.SCREEN_SIZE + constants_1.TILE_SIZE / 2 + 1);
    ctx.closePath();
};
var renderLevelNumber = function () {
    var _a = context_1["default"].get(), ctx = _a.graphicContext, levelIndex = _a.levelIndex;
    ctx.beginPath();
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText("LEVEL: ".concat(levelIndex + 1), constants_1.SCREEN_SIZE / 2, constants_1.SCREEN_SIZE + constants_1.TILE_SIZE / 2 + 1);
    ctx.closePath();
};


/***/ }),

/***/ "./src/renders/mapRenderer.ts":
/*!************************************!*\
  !*** ./src/renders/mapRenderer.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.renderMap = void 0;
var constants_1 = __webpack_require__(/*! ../maps/constants */ "./src/maps/constants.ts");
var context_1 = __webpack_require__(/*! ../context */ "./src/context/index.ts");
var renderMap = function (mapData) {
    var ctx = context_1["default"].get().graphicContext;
    for (var row = 0; row < constants_1.BRICKS_COUNT; row++) {
        for (var col = 0; col < constants_1.BRICKS_COUNT; col++) {
            if (mapData[row][col] === constants_1.WALL_ZONE) {
                renderWall(row, col, ctx);
            }
            else if (mapData[row][col] === constants_1.DOT_ZONE) {
                renderDot(row, col, ctx);
            }
        }
    }
};
exports.renderMap = renderMap;
var renderWall = function (row, col, ctx) {
    ctx.beginPath();
    ctx.rect(col * constants_1.TILE_SIZE, row * constants_1.TILE_SIZE, constants_1.TILE_SIZE, constants_1.TILE_SIZE);
    ctx.fillStyle = constants_1.CONCRETE_COLOR;
    ctx.strokeStyle = constants_1.CONCRETE_COLOR;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(col * constants_1.TILE_SIZE, row * constants_1.TILE_SIZE + 1, constants_1.TILE_SIZE * 0.2, 8);
    ctx.fillStyle = constants_1.BRICK_COLOR;
    ctx.strokeStyle = constants_1.BRICK_COLOR;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(col * constants_1.TILE_SIZE + constants_1.TILE_SIZE * 0.2 + 2, row * constants_1.TILE_SIZE + 1, constants_1.TILE_SIZE * 0.8 - 2, 8);
    ctx.fillStyle = constants_1.BRICK_COLOR;
    ctx.strokeStyle = constants_1.BRICK_COLOR;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(col * constants_1.TILE_SIZE, row * constants_1.TILE_SIZE + 11, constants_1.TILE_SIZE / 2 - 1, 8);
    ctx.fillStyle = constants_1.BRICK_COLOR;
    ctx.strokeStyle = constants_1.BRICK_COLOR;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(col * constants_1.TILE_SIZE + constants_1.TILE_SIZE / 2 + 1, row * constants_1.TILE_SIZE + 11, constants_1.TILE_SIZE / 2 - 1, 8);
    ctx.fillStyle = constants_1.BRICK_COLOR;
    ctx.strokeStyle = constants_1.BRICK_COLOR;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(col * constants_1.TILE_SIZE, row * constants_1.TILE_SIZE + constants_1.TILE_SIZE - 9, constants_1.TILE_SIZE * 0.8, 8);
    ctx.fillStyle = constants_1.BRICK_COLOR;
    ctx.strokeStyle = constants_1.BRICK_COLOR;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(col * constants_1.TILE_SIZE + constants_1.TILE_SIZE * 0.8 + 2, row * constants_1.TILE_SIZE + constants_1.TILE_SIZE - 9, constants_1.TILE_SIZE * 0.2 - 2, 8);
    ctx.fillStyle = constants_1.BRICK_COLOR;
    ctx.strokeStyle = constants_1.BRICK_COLOR;
    ctx.fill();
    ctx.closePath();
};
var renderDot = function (row, col, ctx) {
    ctx.beginPath();
    ctx.arc(col * constants_1.TILE_SIZE + constants_1.TILE_SIZE / 2, row * constants_1.TILE_SIZE + constants_1.TILE_SIZE / 2, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#efef5d';
    ctx.fill();
    ctx.strokeStyle = '#CC9933';
    ctx.arc(col * constants_1.TILE_SIZE + constants_1.TILE_SIZE / 2, row * constants_1.TILE_SIZE + constants_1.TILE_SIZE / 2, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#CC9933';
    ctx.fillText('$', col * constants_1.TILE_SIZE + constants_1.TILE_SIZE / 2, row * constants_1.TILE_SIZE + constants_1.TILE_SIZE / 2 + 1);
};


/***/ }),

/***/ "./src/renders/newGameRenderer.ts":
/*!****************************************!*\
  !*** ./src/renders/newGameRenderer.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.renderGameStart = void 0;
var context_1 = __webpack_require__(/*! ../context */ "./src/context/index.ts");
var constants_1 = __webpack_require__(/*! ../maps/constants */ "./src/maps/constants.ts");
var renderGameStart = function () {
    var ctx = context_1["default"].get().graphicContext;
    ctx.beginPath();
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#7b1fa2';
    ctx.shadowBlur = 50;
    ctx.fillStyle = '#7b1fa2';
    ctx.fillText('C', 50, constants_1.SCREEN_SIZE / 2);
    ctx.fillText('I N M A N', 195, constants_1.SCREEN_SIZE / 2);
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(150, constants_1.SCREEN_SIZE / 2 - 5, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#efef5d';
    ctx.fill();
    ctx.strokeStyle = '#CC9933';
    ctx.arc(150, constants_1.SCREEN_SIZE / 2 - 5, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = 'bold 45px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#CC9933';
    ctx.fillText('$', 150, constants_1.SCREEN_SIZE / 2 - 2);
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(220, 400, 130, 40);
    ctx.fillStyle = '#7b1fa2';
    ctx.fill();
    ctx.shadowColor = 'none';
    ctx.shadowBlur = 0;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', 285, 420);
    ctx.closePath();
};
exports.renderGameStart = renderGameStart;


/***/ }),

/***/ "./src/renders/player.ts":
/*!*******************************!*\
  !*** ./src/renders/player.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Player = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/renders/utils.ts");
var constants_1 = __webpack_require__(/*! ../maps/constants */ "./src/maps/constants.ts");
var context_1 = __webpack_require__(/*! ../context */ "./src/context/index.ts");
var Player = /** @class */ (function () {
    function Player(col, row) {
        var _this = this;
        this.x = null;
        this.y = null;
        this.isMoving = false;
        this.direction = null;
        this.nextTurn = null;
        this.render = function () {
            var ctx = context_1["default"].get().graphicContext;
            var playerCoords = getPlayerDrawParams(getMouthAngel(), _this.direction || 'Left');
            ctx.beginPath();
            ctx.arc(_this.x + constants_1.TILE_SIZE / 2, _this.y + constants_1.TILE_SIZE / 2, constants_1.PLAYER_SIZE / 2, playerCoords.startAngle, playerCoords.endAngle);
            ctx.lineTo(_this.x + constants_1.TILE_SIZE / 2, _this.y + constants_1.TILE_SIZE / 2);
            ctx.closePath();
            ctx.arc(_this.x + playerCoords.eyeX, _this.y + playerCoords.eyeY, 3, 0, Math.PI * 2, true);
            ctx.fillStyle = constants_1.PLAYER_COLOR;
            ctx.fill();
            ctx.closePath();
        };
        this.canMove = function (map) {
            return (!(0, utils_1.hasWallCollision)(_this.getCoordinates(), map, _this.direction) ||
                (Boolean(_this.nextTurn) &&
                    !(0, utils_1.hasWallCollision)(_this.getCoordinates(), map, _this.nextTurn)));
        };
        this.move = function (map, onEatingDot) {
            if (_this.canMove(map)) {
                if (_this.isMoving && Boolean(_this.direction)) {
                    if (Boolean(_this.nextTurn) && _this.canTurn(map)) {
                        switch (_this.nextTurn) {
                            case 'Down':
                                _this.y = _this.y + constants_1.PLAYER_SPEED;
                                break;
                            case 'Left':
                                _this.x = _this.x - constants_1.PLAYER_SPEED;
                                break;
                            case 'Right':
                                _this.x = _this.x + constants_1.PLAYER_SPEED;
                                break;
                            case 'Up':
                                _this.y = _this.y - constants_1.PLAYER_SPEED;
                                break;
                        }
                        _this.direction = _this.nextTurn;
                        _this.nextTurn = null;
                    }
                    else {
                        switch (_this.direction) {
                            case 'Down':
                                _this.y = _this.y + constants_1.PLAYER_SPEED;
                                break;
                            case 'Up':
                                _this.y = _this.y - constants_1.PLAYER_SPEED;
                                break;
                            case 'Left':
                                _this.x = _this.x - constants_1.PLAYER_SPEED;
                                break;
                            case 'Right':
                                _this.x = _this.x + constants_1.PLAYER_SPEED;
                                break;
                        }
                    }
                }
            }
            var possibleCellsWithDots = (0, utils_1.getCellsByCoordinates)({
                x: _this.x,
                y: _this.y
            });
            possibleCellsWithDots.forEach(function (cell) {
                if (map[cell.row][cell.col] === constants_1.DOT_ZONE) {
                    onEatingDot(cell);
                }
            });
        };
        this.getCoordinates = function () {
            return {
                x: _this.x,
                y: _this.y
            };
        };
        this.getDirection = function () {
            return _this.direction;
        };
        this.getIsMoving = function () {
            return _this.isMoving;
        };
        this.getTurnDirection = function () {
            return _this.nextTurn;
        };
        this.handleDirectionChange = function (direction) {
            if (direction === 'Right') {
                if (_this.direction) {
                    _this.nextTurn = 'Right';
                }
                else {
                    _this.isMoving = true;
                    _this.direction = 'Right';
                }
            }
            else if (direction === 'Left') {
                if (_this.direction) {
                    _this.nextTurn = 'Left';
                }
                else {
                    _this.isMoving = true;
                    _this.direction = 'Left';
                }
            }
            else if (direction === 'Up') {
                if (_this.direction) {
                    _this.nextTurn = 'Up';
                }
                else {
                    _this.isMoving = true;
                    _this.direction = 'Up';
                }
            }
            else if (direction === 'Down') {
                if (_this.direction) {
                    _this.nextTurn = 'Down';
                }
                else {
                    _this.isMoving = true;
                    _this.direction = 'Down';
                }
            }
        };
        this.canTurn = function (map) {
            return !(0, utils_1.hasWallCollision)({ x: _this.x, y: _this.y }, map, _this.nextTurn);
        };
        this.x = col * constants_1.TILE_SIZE;
        this.y = row * constants_1.TILE_SIZE;
    }
    return Player;
}());
exports.Player = Player;
var getPlayerDrawParams = function (mouthAngle, direction) {
    var halfAngel = mouthAngle / 2;
    var config = {
        Right: {
            startAngle: 0,
            endAngle: 360,
            eyeXMultiplier: 1 / 2,
            eyeYMultiplier: 1 / 4
        },
        Left: {
            startAngle: 180,
            endAngle: 180,
            eyeXMultiplier: 1 / 2,
            eyeYMultiplier: 1 / 4
        },
        Up: {
            startAngle: 270,
            endAngle: 270,
            eyeXMultiplier: 1 / 4,
            eyeYMultiplier: 1 / 2
        },
        Down: {
            startAngle: 90,
            endAngle: 90,
            eyeXMultiplier: 1 / 4,
            eyeYMultiplier: 1 / 2
        }
    };
    return {
        startAngle: (config[direction].startAngle + halfAngel) * (Math.PI / 180),
        endAngle: (config[direction].endAngle - halfAngel) * (Math.PI / 180),
        eyeX: constants_1.TILE_SIZE * config[direction].eyeXMultiplier,
        eyeY: constants_1.TILE_SIZE * config[direction].eyeYMultiplier
    };
};
var getMouthAngel = function () {
    var milliseconds = new Date().getMilliseconds();
    return milliseconds < 500 ? milliseconds / 10 : (1000 - milliseconds) / 10;
};


/***/ }),

/***/ "./src/renders/popup.ts":
/*!******************************!*\
  !*** ./src/renders/popup.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.renderPopup = void 0;
var context_1 = __webpack_require__(/*! ../context */ "./src/context/index.ts");
var constants_1 = __webpack_require__(/*! ../maps/constants */ "./src/maps/constants.ts");
var renderPopup = function (type, messages) {
    var ctx = context_1["default"].get().graphicContext;
    ctx.beginPath();
    ctx.rect(70, 185, constants_1.SCREEN_SIZE - 140, 200);
    ctx.fillStyle = type == 'info' ? '#7b1fa2' : '#f44336';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 50;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.strokeRect(80, 195, constants_1.SCREEN_SIZE - 160, 180);
    ctx.shadowColor = 'none';
    ctx.shadowBlur = 0;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    var startY = constants_1.SCREEN_SIZE / 2 -
        (messages.length - 1) * 40 +
        (messages.length % 2 > 0 ? 0 : 20);
    for (var i = 0; i < messages.length; i++) {
        ctx.fillText(messages[i], constants_1.SCREEN_SIZE / 2, startY + i * 40);
    }
    ctx.closePath();
};
exports.renderPopup = renderPopup;


/***/ }),

/***/ "./src/renders/utils.ts":
/*!******************************!*\
  !*** ./src/renders/utils.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.numberOfDotsLeftOnMap = exports.getCellsByCoordinates = exports.distanceBetweenDots = exports.getEnemyCollisionID = exports.hasWallCollision = exports.getReverseDirection = exports.getRandomEnemyColor = exports.getRandomInteger = void 0;
var constants_1 = __webpack_require__(/*! ../maps/constants */ "./src/maps/constants.ts");
var getRandomInteger = function (n) {
    return Math.round(Math.random() * n);
};
exports.getRandomInteger = getRandomInteger;
var getRandomEnemyColor = function () {
    return constants_1.ENEMY_COLORS[(0, exports.getRandomInteger)(constants_1.ENEMY_COLORS.length - 1)];
};
exports.getRandomEnemyColor = getRandomEnemyColor;
var getReverseDirection = function (direction) {
    switch (direction) {
        case 'Down':
            return 'Up';
        case 'Up':
            return 'Down';
        case 'Left':
            return 'Right';
        case 'Right':
            return 'Left';
    }
};
exports.getReverseDirection = getReverseDirection;
var hasWallCollision = function (coords, map, direction) {
    var x = coords.x, y = coords.y;
    if (direction === 'Down') {
        //is map end reached
        if (constants_1.BRICKS_COUNT * constants_1.TILE_SIZE <= y + constants_1.TILE_SIZE) {
            return true;
        }
        // is next row reached
        if (y % constants_1.TILE_SIZE !== 0) {
            return false;
        }
        var nextY = Math.trunc(y / constants_1.TILE_SIZE) + 1;
        var nextLeftX = Math.trunc(x / constants_1.TILE_SIZE);
        var nextRightX = Math.trunc((x + constants_1.TILE_SIZE - 1) / constants_1.TILE_SIZE);
        var hasLeftCollision = map[nextY][nextLeftX] === constants_1.WALL_ZONE;
        var hasRightCollision = map[nextY][nextRightX] === constants_1.WALL_ZONE;
        return hasLeftCollision || hasRightCollision;
    }
    if (direction === 'Up') {
        //is map end reached
        if (y <= 0) {
            return true;
        }
        // is next row reached
        if (y % constants_1.TILE_SIZE !== 0) {
            return false;
        }
        var nextY = Math.trunc(y / constants_1.TILE_SIZE) - 1;
        var nextLeftX = Math.trunc(x / constants_1.TILE_SIZE);
        var nextRightX = Math.trunc((x + constants_1.TILE_SIZE - 1) / constants_1.TILE_SIZE);
        var hasLeftCollision = map[nextY][nextLeftX] === constants_1.WALL_ZONE;
        var hasRightCollision = map[nextY][nextRightX] === constants_1.WALL_ZONE;
        return hasLeftCollision || hasRightCollision;
    }
    if (direction === 'Right') {
        //is map end reached
        if (constants_1.BRICKS_COUNT * constants_1.TILE_SIZE <= x + constants_1.TILE_SIZE) {
            return true;
        }
        // is next row reached
        if (x % constants_1.TILE_SIZE !== 0) {
            return false;
        }
        var nextX = Math.trunc(x / constants_1.TILE_SIZE) + 1;
        var nextTopY = Math.trunc(y / constants_1.TILE_SIZE);
        var nextBottomY = Math.trunc((y + constants_1.TILE_SIZE - 1) / constants_1.TILE_SIZE);
        var hasTopCollision = map[nextTopY][nextX] === constants_1.WALL_ZONE;
        var hasBottomCollision = map[nextBottomY][nextX] === constants_1.WALL_ZONE;
        return hasTopCollision || hasBottomCollision;
    }
    if (direction === 'Left') {
        //is map end reached
        if (x <= 0) {
            return true;
        }
        // is next row reached
        if (x % constants_1.TILE_SIZE !== 0) {
            return false;
        }
        var nextX = Math.trunc(x / constants_1.TILE_SIZE) - 1;
        var nextTopY = Math.trunc(y / constants_1.TILE_SIZE);
        var nextBottomY = Math.trunc((y + constants_1.TILE_SIZE - 1) / constants_1.TILE_SIZE);
        var hasTopCollision = map[nextTopY][nextX] === constants_1.WALL_ZONE;
        var hasBottomCollision = map[nextBottomY][nextX] === constants_1.WALL_ZONE;
        return hasTopCollision || hasBottomCollision;
    }
    return false;
};
exports.hasWallCollision = hasWallCollision;
var getEnemyCollisionID = function (player, enemies) {
    var result = null;
    for (var i = 0; i < enemies.length; i++) {
        if ((0, exports.distanceBetweenDots)(player.getCoordinates(), enemies[i].getCoordinates()) <= constants_1.COLLISION_DISTANCE) {
            result = enemies[i].getID();
            break;
        }
    }
    return result;
};
exports.getEnemyCollisionID = getEnemyCollisionID;
var distanceBetweenDots = function (first, second) {
    return Math.sqrt(Math.pow((first.x - second.x), 2) + Math.pow((first.y - second.y), 2));
};
exports.distanceBetweenDots = distanceBetweenDots;
var getCellsByCoordinates = function (coordinates) {
    var result = [];
    //leftTop
    result.push({
        col: Math.trunc(coordinates.x / constants_1.TILE_SIZE),
        row: Math.trunc(coordinates.y / constants_1.TILE_SIZE)
    });
    //rightTop
    result.push({
        col: Math.trunc((coordinates.x + constants_1.TILE_SIZE - 1) / constants_1.TILE_SIZE),
        row: Math.trunc(coordinates.y / constants_1.TILE_SIZE)
    });
    //leftBottom
    result.push({
        col: Math.trunc(coordinates.x / constants_1.TILE_SIZE),
        row: Math.trunc((coordinates.y + constants_1.TILE_SIZE - 1) / constants_1.TILE_SIZE)
    });
    //rightBottom
    result.push({
        col: Math.trunc((coordinates.x + constants_1.TILE_SIZE - 1) / constants_1.TILE_SIZE),
        row: Math.trunc((coordinates.y + constants_1.TILE_SIZE - 1) / constants_1.TILE_SIZE)
    });
    return result;
};
exports.getCellsByCoordinates = getCellsByCoordinates;
var numberOfDotsLeftOnMap = function (map) {
    var result = 0;
    for (var row = 0; row < map.length; row++) {
        for (var col = 0; col < map[row].length; col++) {
            if (map[row][col] === constants_1.DOT_ZONE) {
                result++;
            }
        }
    }
    return result;
};
exports.numberOfDotsLeftOnMap = numberOfDotsLeftOnMap;


/***/ }),

/***/ "./src/types/gameStateType.ts":
/*!************************************!*\
  !*** ./src/types/gameStateType.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState[GameState["GAME_NOT_STARTED"] = 0] = "GAME_NOT_STARTED";
    GameState[GameState["GAME_IN_PROGRESS"] = 1] = "GAME_IN_PROGRESS";
    GameState[GameState["GAME_OVER"] = 2] = "GAME_OVER";
    GameState[GameState["GAME_COMPLETED"] = 3] = "GAME_COMPLETED";
})(GameState = exports.GameState || (exports.GameState = {}));


/***/ }),

/***/ "./src/types/levelStateType.ts":
/*!*************************************!*\
  !*** ./src/types/levelStateType.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.LevelState = void 0;
var LevelState;
(function (LevelState) {
    LevelState[LevelState["LEVEL_NOT_STARTED"] = 0] = "LEVEL_NOT_STARTED";
    LevelState[LevelState["LEVEL_IN_PROGRESS"] = 1] = "LEVEL_IN_PROGRESS";
    LevelState[LevelState["PLAYER_DIED"] = 2] = "PLAYER_DIED";
    LevelState[LevelState["LEVEL_COMPLETED"] = 4] = "LEVEL_COMPLETED";
})(LevelState = exports.LevelState || (exports.LevelState = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

exports.__esModule = true;
exports.game = void 0;
var context_1 = __webpack_require__(/*! ./context */ "./src/context/index.ts");
var eventHandler_1 = __webpack_require__(/*! ./events/eventHandler */ "./src/events/eventHandler.ts");
var level_1 = __webpack_require__(/*! ./level/level */ "./src/level/level.ts");
var constants_1 = __webpack_require__(/*! ./maps/constants */ "./src/maps/constants.ts");
var level_1_1 = __webpack_require__(/*! ./maps/level_1 */ "./src/maps/level_1.ts");
var level_2_1 = __webpack_require__(/*! ./maps/level_2 */ "./src/maps/level_2.ts");
var level_3_1 = __webpack_require__(/*! ./maps/level_3 */ "./src/maps/level_3.ts");
var gameFinishedRenderer_1 = __webpack_require__(/*! ./renders/gameFinishedRenderer */ "./src/renders/gameFinishedRenderer.ts");
var gameToolbar_1 = __webpack_require__(/*! ./renders/gameToolbar */ "./src/renders/gameToolbar.ts");
var newGameRenderer_1 = __webpack_require__(/*! ./renders/newGameRenderer */ "./src/renders/newGameRenderer.ts");
var gameStateType_1 = __webpack_require__(/*! ./types/gameStateType */ "./src/types/gameStateType.ts");
var levelStateType_1 = __webpack_require__(/*! ./types/levelStateType */ "./src/types/levelStateType.ts");
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.levels = [level_1_1.level1, level_2_1.level2, level_3_1.level3];
        this.currentLevel = null;
        this.keyDownHandler = function (e) {
            if (e.keyCode === 39) {
                _this.currentLevel.handleDirectionChange('Right');
            }
            else if (e.keyCode === 37) {
                _this.currentLevel.handleDirectionChange('Left');
            }
            else if (e.keyCode === 38) {
                _this.currentLevel.handleDirectionChange('Up');
            }
            else if (e.keyCode === 40) {
                _this.currentLevel.handleDirectionChange('Down');
            }
        };
        this.onEarningPoints = function (points) {
            var scores = context_1["default"].get().scores;
            context_1["default"].set({ scores: points + scores });
        };
        this.onLevelCompleted = function () {
            var _a = context_1["default"].get(), levelIndex = _a.levelIndex, scores = _a.scores;
            context_1["default"].set({ scores: scores + 50 });
            if (levelIndex + 1 === _this.levels.length) {
                context_1["default"].set({ gameState: gameStateType_1.GameState.GAME_COMPLETED });
            }
            else {
                var newLevelIndex = levelIndex + 1;
                context_1["default"].set({
                    levelIndex: newLevelIndex,
                    levelState: levelStateType_1.LevelState.LEVEL_NOT_STARTED
                });
                _this.currentLevel = new level_1.Level(_this.levels[newLevelIndex], _this.onEarningPoints, _this.onLevelCompleted);
                _this.currentLevel.startLevel();
            }
        };
        this.draw = function () {
            var _a = context_1["default"].get(), gameState = _a.gameState, ctx = _a.graphicContext, canvas = _a.canvas;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (gameState === gameStateType_1.GameState.GAME_IN_PROGRESS) {
                _this.currentLevel.move();
                _this.currentLevel.render();
                (0, gameToolbar_1.renderGameToolbar)();
            }
            else if (gameState === gameStateType_1.GameState.GAME_NOT_STARTED) {
                (0, newGameRenderer_1.renderGameStart)();
            }
            else if (gameState === gameStateType_1.GameState.GAME_OVER) {
                (0, gameFinishedRenderer_1.renderGameFinished)();
            }
            else if (gameState === gameStateType_1.GameState.GAME_COMPLETED) {
                (0, gameFinishedRenderer_1.renderGameFinished)();
            }
            requestAnimationFrame(_this.draw);
        };
        this.startGame = function () {
            context_1["default"].set({ gameState: gameStateType_1.GameState.GAME_IN_PROGRESS });
            _this.currentLevel.startLevel();
        };
        this.restartGame = function () {
            context_1["default"].set({
                gameState: gameStateType_1.GameState.GAME_NOT_STARTED,
                levelIndex: 0,
                levelState: levelStateType_1.LevelState.LEVEL_NOT_STARTED,
                lives: constants_1.INITIAL_LIVES_COUNT,
                scores: 0
            });
            _this.currentLevel = new level_1.Level(_this.levels[0], _this.onEarningPoints, _this.onLevelCompleted);
        };
        var canvas = document.getElementById('myCanvas');
        canvas.addEventListener('click', function (event) {
            (0, eventHandler_1.mouseClickHandler)({
                x: event.offsetX,
                y: event.offsetY,
                start: _this.startGame,
                restart: _this.restartGame
            });
        });
        var ctx = canvas.getContext('2d');
        context_1["default"].initContext({
            gameState: gameStateType_1.GameState.GAME_NOT_STARTED,
            levelState: levelStateType_1.LevelState.LEVEL_NOT_STARTED,
            graphicContext: ctx,
            lives: constants_1.INITIAL_LIVES_COUNT,
            scores: 0,
            levelIndex: 0,
            levelsCount: this.levels.length,
            canvas: canvas
        });
        ctx.fillStyle = 'black';
        this.currentLevel = new level_1.Level(this.levels[0], this.onEarningPoints, this.onLevelCompleted);
        document.addEventListener('keydown', this.keyDownHandler, false);
        this.draw();
    }
    return Game;
}());
var game = new Game();
exports.game = game;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCx3QkFBd0I7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Z0IsbUJBQU8sQ0FBQyw2Q0FBZ0I7QUFDeEMsNkJBQTZCLG1CQUFPLENBQUMsNkVBQWdDO0FBQ3JFLG9CQUFvQixtQkFBTyxDQUFDLDJEQUF1QjtBQUNuRCx3QkFBd0IsbUJBQU8sQ0FBQyxtRUFBMkI7QUFDM0Qsc0JBQXNCLG1CQUFPLENBQUMsMkRBQXVCO0FBQ3JELHVCQUF1QixtQkFBTyxDQUFDLDZEQUF3QjtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMseUJBQXlCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxxQkFBcUI7QUFDNUQ7QUFDQSwyQ0FBMkMscURBQXFEO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsdURBQXVEO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLFlBQVkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb2luX21hbi8uL3NyYy9jb250ZXh0L2luZGV4LnRzIiwid2VicGFjazovL2NvaW5fbWFuLy4vc3JjL2V2ZW50cy9ldmVudEhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vY29pbl9tYW4vLi9zcmMvbGV2ZWwvbGV2ZWwudHMiLCJ3ZWJwYWNrOi8vY29pbl9tYW4vLi9zcmMvbWFwcy9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vY29pbl9tYW4vLi9zcmMvbWFwcy9sZXZlbF8xLnRzIiwid2VicGFjazovL2NvaW5fbWFuLy4vc3JjL21hcHMvbGV2ZWxfMi50cyIsIndlYnBhY2s6Ly9jb2luX21hbi8uL3NyYy9tYXBzL2xldmVsXzMudHMiLCJ3ZWJwYWNrOi8vY29pbl9tYW4vLi9zcmMvcmVuZGVycy9lbmVteS50cyIsIndlYnBhY2s6Ly9jb2luX21hbi8uL3NyYy9yZW5kZXJzL2dhbWVGaW5pc2hlZFJlbmRlcmVyLnRzIiwid2VicGFjazovL2NvaW5fbWFuLy4vc3JjL3JlbmRlcnMvZ2FtZVRvb2xiYXIudHMiLCJ3ZWJwYWNrOi8vY29pbl9tYW4vLi9zcmMvcmVuZGVycy9tYXBSZW5kZXJlci50cyIsIndlYnBhY2s6Ly9jb2luX21hbi8uL3NyYy9yZW5kZXJzL25ld0dhbWVSZW5kZXJlci50cyIsIndlYnBhY2s6Ly9jb2luX21hbi8uL3NyYy9yZW5kZXJzL3BsYXllci50cyIsIndlYnBhY2s6Ly9jb2luX21hbi8uL3NyYy9yZW5kZXJzL3BvcHVwLnRzIiwid2VicGFjazovL2NvaW5fbWFuLy4vc3JjL3JlbmRlcnMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vY29pbl9tYW4vLi9zcmMvdHlwZXMvZ2FtZVN0YXRlVHlwZS50cyIsIndlYnBhY2s6Ly9jb2luX21hbi8uL3NyYy90eXBlcy9sZXZlbFN0YXRlVHlwZS50cyIsIndlYnBhY2s6Ly9jb2luX21hbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jb2luX21hbi8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG52YXIgR2FtZUNvbnRleHQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBHYW1lQ29udGV4dCgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbml0Q29udGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgICAgIF90aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBHYW1lQ29udGV4dC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250ZXh0ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29udGV4dCBpcyBub3QgaW5pdGlhbGl6ZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHRoaXMuY29udGV4dCksIGRhdGEpO1xyXG4gICAgfTtcclxuICAgIEdhbWVDb250ZXh0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnRleHQgaXMgbm90IGluaXRpYWxpemVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEdhbWVDb250ZXh0O1xyXG59KCkpO1xyXG52YXIgZ2FtZUNvbnRleHQgPSBuZXcgR2FtZUNvbnRleHQoKTtcclxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBnYW1lQ29udGV4dDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMubW91c2VDbGlja0hhbmRsZXIgPSB2b2lkIDA7XHJcbnZhciBjb250ZXh0XzEgPSByZXF1aXJlKFwiLi4vY29udGV4dFwiKTtcclxudmFyIGdhbWVTdGF0ZVR5cGVfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9nYW1lU3RhdGVUeXBlXCIpO1xyXG52YXIgbW91c2VDbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIHggPSBkYXRhLngsIHkgPSBkYXRhLnksIHN0YXJ0ID0gZGF0YS5zdGFydCwgcmVzdGFydCA9IGRhdGEucmVzdGFydDtcclxuICAgIHZhciBnYW1lU3RhdGUgPSBjb250ZXh0XzFbXCJkZWZhdWx0XCJdLmdldCgpLmdhbWVTdGF0ZTtcclxuICAgIGlmIChnYW1lU3RhdGUgPT09IGdhbWVTdGF0ZVR5cGVfMS5HYW1lU3RhdGUuR0FNRV9OT1RfU1RBUlRFRCkge1xyXG4gICAgICAgIGlmICh4ID49IDIyMCAmJiB4IDw9IDM1MCAmJiB5ID49IDQwMCAmJiB5IDw9IDQ0MCkge1xyXG4gICAgICAgICAgICBzdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChnYW1lU3RhdGUgPT09IGdhbWVTdGF0ZVR5cGVfMS5HYW1lU3RhdGUuR0FNRV9DT01QTEVURUQgfHxcclxuICAgICAgICBnYW1lU3RhdGUgPT09IGdhbWVTdGF0ZVR5cGVfMS5HYW1lU3RhdGUuR0FNRV9PVkVSKSB7XHJcbiAgICAgICAgaWYgKHggPj0gMjEwICYmIHggPD0gMzYwICYmIHkgPj0gNTAwICYmIHkgPD0gNTQwKSB7XHJcbiAgICAgICAgICAgIHJlc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubW91c2VDbGlja0hhbmRsZXIgPSBtb3VzZUNsaWNrSGFuZGxlcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMuTGV2ZWwgPSB2b2lkIDA7XHJcbnZhciBjb250ZXh0XzEgPSByZXF1aXJlKFwiLi4vY29udGV4dFwiKTtcclxudmFyIGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL21hcHMvY29uc3RhbnRzXCIpO1xyXG52YXIgZW5lbXlfMSA9IHJlcXVpcmUoXCIuLi9yZW5kZXJzL2VuZW15XCIpO1xyXG52YXIgbWFwUmVuZGVyZXJfMSA9IHJlcXVpcmUoXCIuLi9yZW5kZXJzL21hcFJlbmRlcmVyXCIpO1xyXG52YXIgcGxheWVyXzEgPSByZXF1aXJlKFwiLi4vcmVuZGVycy9wbGF5ZXJcIik7XHJcbnZhciBwb3B1cF8xID0gcmVxdWlyZShcIi4uL3JlbmRlcnMvcG9wdXBcIik7XHJcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4uL3JlbmRlcnMvdXRpbHNcIik7XHJcbnZhciBnYW1lU3RhdGVUeXBlXzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvZ2FtZVN0YXRlVHlwZVwiKTtcclxudmFyIGxldmVsU3RhdGVUeXBlXzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbGV2ZWxTdGF0ZVR5cGVcIik7XHJcbnZhciBMZXZlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExldmVsKGxldmVsLCBvbkVhcm5pbmdQb2ludHMsIG9uTGV2ZWxDb21wbGV0ZWQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubWFwRGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZW5lbWllcyA9IFtdO1xyXG4gICAgICAgIHRoaXMub25FYXJuaW5nUG9pbnRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9uTGV2ZWxDb21wbGV0ZWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubGV2ZWwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRGlyZWN0aW9uQ2hhbmdlID0gZnVuY3Rpb24gKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBfdGhpcy5wbGF5ZXIuaGFuZGxlRGlyZWN0aW9uQ2hhbmdlKGRpcmVjdGlvbik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN0YXJ0TGV2ZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyByZXR1cm4gY29udGV4dF8xW1wiZGVmYXVsdFwiXS5zZXQoeyBsZXZlbFN0YXRlOiBsZXZlbFN0YXRlVHlwZV8xLkxldmVsU3RhdGUuTEVWRUxfSU5fUFJPR1JFU1MgfSk7IH0sIDMwMDApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBfYSA9IGNvbnRleHRfMVtcImRlZmF1bHRcIl0uZ2V0KCksIGxldmVsU3RhdGUgPSBfYS5sZXZlbFN0YXRlLCBsZXZlbEluZGV4ID0gX2EubGV2ZWxJbmRleCwgbGl2ZXMgPSBfYS5saXZlcztcclxuICAgICAgICAgICAgKDAsIG1hcFJlbmRlcmVyXzEucmVuZGVyTWFwKShfdGhpcy5tYXBEYXRhKTtcclxuICAgICAgICAgICAgX3RoaXMucGxheWVyLnJlbmRlcigpO1xyXG4gICAgICAgICAgICBfdGhpcy5lbmVtaWVzLmZvckVhY2goZnVuY3Rpb24gKGVuZW15KSB7XHJcbiAgICAgICAgICAgICAgICBlbmVteS5yZW5kZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChsZXZlbFN0YXRlID09PSBsZXZlbFN0YXRlVHlwZV8xLkxldmVsU3RhdGUuTEVWRUxfTk9UX1NUQVJURUQpIHtcclxuICAgICAgICAgICAgICAgICgwLCBwb3B1cF8xLnJlbmRlclBvcHVwKSgnaW5mbycsIFtcIkxldmVsIFwiLmNvbmNhdChsZXZlbEluZGV4ICsgMSldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobGV2ZWxTdGF0ZSA9PT0gbGV2ZWxTdGF0ZVR5cGVfMS5MZXZlbFN0YXRlLlBMQVlFUl9ESUVEKSB7XHJcbiAgICAgICAgICAgICAgICAoMCwgcG9wdXBfMS5yZW5kZXJQb3B1cCkoJ3dhcm4nLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvaW5tYW4gZGllZC4uLicsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJcIi5jb25jYXQobGl2ZXMsIFwiIFwiKS5jb25jYXQobGl2ZXMgPT09IDEgPyAnbGlmZScgOiAnbGl2ZXMnLCBcIiBsZWZ0XCIpXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobGV2ZWxTdGF0ZSA9PT0gbGV2ZWxTdGF0ZVR5cGVfMS5MZXZlbFN0YXRlLkxFVkVMX0NPTVBMRVRFRCkge1xyXG4gICAgICAgICAgICAgICAgKDAsIHBvcHVwXzEucmVuZGVyUG9wdXApKCdpbmZvJywgW1xyXG4gICAgICAgICAgICAgICAgICAgICdDb25ncmF0dWxhdGlvbnMhISEnLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTGV2ZWwgXCIuY29uY2F0KGxldmVsSW5kZXggKyAxLCBcIiBjb21wbGV0ZWQhISFcIilcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uRWF0aW5nRG90ID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgX3RoaXMub25FYXJuaW5nUG9pbnRzKDEpO1xyXG4gICAgICAgICAgICBfdGhpcy5tYXBEYXRhW2RhdGEucm93XVtkYXRhLmNvbF0gPSBjb25zdGFudHNfMS5FTVBUWV9aT05FO1xyXG4gICAgICAgICAgICB2YXIgZG90c0xlZnQgPSAoMCwgdXRpbHNfMS5udW1iZXJPZkRvdHNMZWZ0T25NYXApKF90aGlzLm1hcERhdGEpO1xyXG4gICAgICAgICAgICB2YXIgX2EgPSBjb250ZXh0XzFbXCJkZWZhdWx0XCJdLmdldCgpLCBsZXZlbHNDb3VudCA9IF9hLmxldmVsc0NvdW50LCBsZXZlbEluZGV4ID0gX2EubGV2ZWxJbmRleDtcclxuICAgICAgICAgICAgaWYgKGRvdHNMZWZ0ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGV2ZWxJbmRleCArIDEgPT09IGxldmVsc0NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMub25MZXZlbENvbXBsZXRlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dF8xW1wiZGVmYXVsdFwiXS5zZXQoeyBsZXZlbFN0YXRlOiBsZXZlbFN0YXRlVHlwZV8xLkxldmVsU3RhdGUuTEVWRUxfQ09NUExFVEVEIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMub25MZXZlbENvbXBsZXRlZCgpOyB9LCAzMDAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5tb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dF8xW1wiZGVmYXVsdFwiXS5nZXQoKS5sZXZlbFN0YXRlID09PSBsZXZlbFN0YXRlVHlwZV8xLkxldmVsU3RhdGUuTEVWRUxfSU5fUFJPR1JFU1MpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnBsYXllci5tb3ZlKF90aGlzLm1hcERhdGEsIF90aGlzLm9uRWF0aW5nRG90KTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmVuZW1pZXMuZm9yRWFjaChmdW5jdGlvbiAoZW5lbXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbmVteS5tb3ZlKF90aGlzLm1hcERhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5kZXRlY3RFbmVtaWVzQ29sbGlzaW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZGV0ZWN0RW5lbWllc0NvbGxpc2lvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGVuZW15SUQgPSAoMCwgdXRpbHNfMS5nZXRFbmVteUNvbGxpc2lvbklEKShfdGhpcy5wbGF5ZXIsIF90aGlzLmVuZW1pZXMpO1xyXG4gICAgICAgICAgICBpZiAoZW5lbXlJRCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpdmVzID0gY29udGV4dF8xW1wiZGVmYXVsdFwiXS5nZXQoKS5saXZlcztcclxuICAgICAgICAgICAgICAgIGNvbnRleHRfMVtcImRlZmF1bHRcIl0uc2V0KHsgbGl2ZXM6IC0tbGl2ZXMgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29udGV4dF8xW1wiZGVmYXVsdFwiXS5nZXQoKS5saXZlcyA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZXNldEFmdGVyUGxheWVyRGllKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dF8xW1wiZGVmYXVsdFwiXS5zZXQoeyBsZXZlbFN0YXRlOiBsZXZlbFN0YXRlVHlwZV8xLkxldmVsU3RhdGUuUExBWUVSX0RJRUQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHJldHVybiBjb250ZXh0XzFbXCJkZWZhdWx0XCJdLnNldCh7IGxldmVsU3RhdGU6IGxldmVsU3RhdGVUeXBlXzEuTGV2ZWxTdGF0ZS5MRVZFTF9JTl9QUk9HUkVTUyB9KTsgfSwgMzAwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0XzFbXCJkZWZhdWx0XCJdLnNldCh7IGdhbWVTdGF0ZTogZ2FtZVN0YXRlVHlwZV8xLkdhbWVTdGF0ZS5HQU1FX09WRVIgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmVzZXRBZnRlclBsYXllckRpZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMucGxheWVyID0gbmV3IHBsYXllcl8xLlBsYXllcihfdGhpcy5sZXZlbC5wbGF5ZXJfc3RhcnRfcG9zaXRpb24ueCwgX3RoaXMubGV2ZWwucGxheWVyX3N0YXJ0X3Bvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICBfdGhpcy5lbmVtaWVzID0gW107XHJcbiAgICAgICAgICAgIF90aGlzLmxldmVsLmVuZW1pZXNfc3RhcnRfcG9zaXRpb24uZm9yRWFjaChmdW5jdGlvbiAoZW4sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5lbmVtaWVzLnB1c2gobmV3IGVuZW15XzEuRW5lbXkoZW4ueSwgZW4ueCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm1hcERhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGxldmVsLm1hcCkpO1xyXG4gICAgICAgIHRoaXMubGV2ZWwgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGxldmVsKSk7XHJcbiAgICAgICAgdGhpcy5vbkVhcm5pbmdQb2ludHMgPSBvbkVhcm5pbmdQb2ludHM7XHJcbiAgICAgICAgdGhpcy5vbkxldmVsQ29tcGxldGVkID0gb25MZXZlbENvbXBsZXRlZDtcclxuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBwbGF5ZXJfMS5QbGF5ZXIobGV2ZWwucGxheWVyX3N0YXJ0X3Bvc2l0aW9uLngsIGxldmVsLnBsYXllcl9zdGFydF9wb3NpdGlvbi55KTtcclxuICAgICAgICBsZXZlbC5lbmVtaWVzX3N0YXJ0X3Bvc2l0aW9uLmZvckVhY2goZnVuY3Rpb24gKGVuLCBpbmRleCkge1xyXG4gICAgICAgICAgICBfdGhpcy5lbmVtaWVzLnB1c2gobmV3IGVuZW15XzEuRW5lbXkoZW4ueSwgZW4ueCwgaW5kZXgpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBMZXZlbDtcclxufSgpKTtcclxuZXhwb3J0cy5MZXZlbCA9IExldmVsO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5DT05DUkVURV9DT0xPUiA9IGV4cG9ydHMuQlJJQ0tfQ09MT1IgPSBleHBvcnRzLlRPT0xCQVJfSEVJR0hUID0gZXhwb3J0cy5DT0xMSVNJT05fRElTVEFOQ0UgPSBleHBvcnRzLkJSSUNLU19DT1VOVCA9IGV4cG9ydHMuU0NSRUVOX1NJWkUgPSBleHBvcnRzLlRJTEVfU0laRSA9IGV4cG9ydHMuUExBWUVSX1NQRUVEID0gZXhwb3J0cy5FTkVNWV9DT0xPUlMgPSBleHBvcnRzLkVORU1ZX1NJWkUgPSBleHBvcnRzLlBMQVlFUl9DT0xPUiA9IGV4cG9ydHMuUExBWUVSX1NJWkUgPSBleHBvcnRzLklOSVRJQUxfTElWRVNfQ09VTlQgPSBleHBvcnRzLkRPVF9aT05FID0gZXhwb3J0cy5XQUxMX1pPTkUgPSBleHBvcnRzLkVNUFRZX1pPTkUgPSB2b2lkIDA7XHJcbmV4cG9ydHMuRU1QVFlfWk9ORSA9IDA7XHJcbmV4cG9ydHMuV0FMTF9aT05FID0gMTtcclxuZXhwb3J0cy5ET1RfWk9ORSA9IDI7XHJcbmV4cG9ydHMuSU5JVElBTF9MSVZFU19DT1VOVCA9IDM7XHJcbmV4cG9ydHMuUExBWUVSX1NJWkUgPSAyNjtcclxuZXhwb3J0cy5QTEFZRVJfQ09MT1IgPSAneWVsbG93JztcclxuZXhwb3J0cy5FTkVNWV9TSVpFID0gMjA7XHJcbmV4cG9ydHMuRU5FTVlfQ09MT1JTID0gW1xyXG4gICAgJyNDRjAwNjMnLFxyXG4gICAgJyM1ZGQzOWUnLFxyXG4gICAgJyMzNDhhYTcnLFxyXG4gICAgJyM1MTNiNTYnLFxyXG4gICAgJyNmZjAwNmUnLFxyXG4gICAgJyNiNWU0OGMnLFxyXG4gICAgJyNkOTA0MjknLFxyXG4gICAgJyNmYjhiMjQnXHJcbl07XHJcbmV4cG9ydHMuUExBWUVSX1NQRUVEID0gMTtcclxuZXhwb3J0cy5USUxFX1NJWkUgPSAzMDtcclxuZXhwb3J0cy5TQ1JFRU5fU0laRSA9IDU3MDtcclxuZXhwb3J0cy5CUklDS1NfQ09VTlQgPSBleHBvcnRzLlNDUkVFTl9TSVpFIC8gZXhwb3J0cy5USUxFX1NJWkU7XHJcbmV4cG9ydHMuQ09MTElTSU9OX0RJU1RBTkNFID0gMjA7XHJcbmV4cG9ydHMuVE9PTEJBUl9IRUlHSFQgPSAzMDtcclxuZXhwb3J0cy5CUklDS19DT0xPUiA9ICcjQUE0RTU0JztcclxuZXhwb3J0cy5DT05DUkVURV9DT0xPUiA9ICcjRTZEN0U1JztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMubGV2ZWwxID0gdm9pZCAwO1xyXG52YXIgbWFwMSA9IFtcclxuICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAyLCAyLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAyLCAyLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAxLCAwLCAxLCAxLCAwLCAxLCAxLCAwLCAxLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAyLCAxLCAwLCAwLCAwLCAxLCAyLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAwLCAxXSxcclxuICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXVxyXG5dO1xyXG5leHBvcnRzLmxldmVsMSA9IHtcclxuICAgIG1hcDogbWFwMSxcclxuICAgIHBsYXllcl9zdGFydF9wb3NpdGlvbjogeyB4OiAxNywgeTogMTcgfSxcclxuICAgIGVuZW1pZXNfc3RhcnRfcG9zaXRpb246IFtcclxuICAgICAgICB7IHg6IDksIHk6IDkgfSxcclxuICAgICAgICB7IHg6IDksIHk6IDEwIH0sXHJcbiAgICAgICAgeyB4OiA5LCB5OiA4IH1cclxuICAgIF1cclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMubGV2ZWwyID0gdm9pZCAwO1xyXG52YXIgbWFwMSA9IFtcclxuICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAwLCAwLCAwLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAxLCAyLCAyLCAyLCAxLCAwLCAxXSxcclxuICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXVxyXG5dO1xyXG5leHBvcnRzLmxldmVsMiA9IHtcclxuICAgIG1hcDogbWFwMSxcclxuICAgIHBsYXllcl9zdGFydF9wb3NpdGlvbjogeyB4OiAxNywgeTogMTcgfSxcclxuICAgIGVuZW1pZXNfc3RhcnRfcG9zaXRpb246IFtcclxuICAgICAgICB7IHg6IDksIHk6IDkgfSxcclxuICAgICAgICB7IHg6IDksIHk6IDEwIH0sXHJcbiAgICAgICAgeyB4OiA5LCB5OiA4IH0sXHJcbiAgICAgICAgeyB4OiA5LCB5OiA5IH1cclxuICAgIF1cclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMubGV2ZWwzID0gdm9pZCAwO1xyXG52YXIgbWFwMSA9IFtcclxuICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAxLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAxLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAwLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAxLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAxLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAyLCAyLCAxXSxcclxuICAgIFsxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgIFsxLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAyLCAwLCAxXSxcclxuICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXVxyXG5dO1xyXG5leHBvcnRzLmxldmVsMyA9IHtcclxuICAgIG1hcDogbWFwMSxcclxuICAgIHBsYXllcl9zdGFydF9wb3NpdGlvbjogeyB4OiAxNywgeTogMTcgfSxcclxuICAgIGVuZW1pZXNfc3RhcnRfcG9zaXRpb246IFtcclxuICAgICAgICB7IHg6IDksIHk6IDkgfSxcclxuICAgICAgICB7IHg6IDksIHk6IDkgfSxcclxuICAgICAgICB7IHg6IDksIHk6IDkgfSxcclxuICAgICAgICB7IHg6IDksIHk6IDkgfSxcclxuICAgICAgICB7IHg6IDksIHk6IDkgfVxyXG4gICAgXVxyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5FbmVteSA9IHZvaWQgMDtcclxudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcclxudmFyIGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL21hcHMvY29uc3RhbnRzXCIpO1xyXG52YXIgdXRpbHNfMiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xyXG52YXIgY29udGV4dF8xID0gcmVxdWlyZShcIi4uL2NvbnRleHRcIik7XHJcbnZhciBFbmVteSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEVuZW15KGNvbCwgcm93LCBpZCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy54ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnkgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGN0eCA9IGNvbnRleHRfMVtcImRlZmF1bHRcIl0uZ2V0KCkuZ3JhcGhpY0NvbnRleHQ7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmFyYyhfdGhpcy54ICsgY29uc3RhbnRzXzEuVElMRV9TSVpFIC8gMiwgX3RoaXMueSArIGNvbnN0YW50c18xLlRJTEVfU0laRSAvIDIsIGNvbnN0YW50c18xLkVORU1ZX1NJWkUgLyAyLCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBfdGhpcy5jb2xvcjtcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oX3RoaXMueCArIDE4LCBfdGhpcy55ICsgMTEpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKF90aGlzLnggKyAyNywgX3RoaXMueSArIDYpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKF90aGlzLnggKyAyMCwgX3RoaXMueSArIDIwKTtcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oX3RoaXMueCArIDIwLCBfdGhpcy55ICsgMTApO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKF90aGlzLnggKyAyOSwgX3RoaXMueSArIDE1KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhfdGhpcy54ICsgMjAsIF90aGlzLnkgKyAyMCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKF90aGlzLnggKyAyMCwgX3RoaXMueSArIDE2KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhfdGhpcy54ICsgMjcsIF90aGlzLnkgKyAyNCk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oX3RoaXMueCArIDE4LCBfdGhpcy55ICsgMjIpO1xyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhfdGhpcy54ICsgMjAsIF90aGlzLnkgKyAyMCk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oX3RoaXMueCArIDE1LCBfdGhpcy55ICsgMjkpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKF90aGlzLnggKyAxMCwgX3RoaXMueSArIDIwKTtcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oX3RoaXMueCArIDEyLCBfdGhpcy55ICsgMjIpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKF90aGlzLnggKyAzLCBfdGhpcy55ICsgMjQpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKF90aGlzLnggKyAxMCwgX3RoaXMueSArIDE2KTtcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oX3RoaXMueCArIDEwLCBfdGhpcy55ICsgMTApO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKF90aGlzLnggKyAxLCBfdGhpcy55ICsgMTUpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKF90aGlzLnggKyAxMCwgX3RoaXMueSArIDIwKTtcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oX3RoaXMueCArIDEyLCBfdGhpcy55ICsgMTEpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKF90aGlzLnggKyAzLCBfdGhpcy55ICsgNik7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oX3RoaXMueCArIDEwLCBfdGhpcy55ICsgMjApO1xyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhfdGhpcy54ICsgMjAsIF90aGlzLnkgKyAxMCk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oX3RoaXMueCArIDE1LCBfdGhpcy55ICsgMSk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oX3RoaXMueCArIDEwLCBfdGhpcy55ICsgMTApO1xyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmVsbGlwc2UoX3RoaXMueCArIDE5LCBfdGhpcy55ICsgMTIsIDIsIDMsIE1hdGguUEkgLyA0LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmVsbGlwc2UoX3RoaXMueCArIDExLCBfdGhpcy55ICsgMTIsIDIsIDMsIChNYXRoLlBJICogNykgLyA0LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmFyYyhfdGhpcy54ICsgMTIsIF90aGlzLnkgKyAxMywgMSwgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5hcmMoX3RoaXMueCArIDE4LCBfdGhpcy55ICsgMTMsIDEsIDAsIE1hdGguUEkgKiAyKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubW92ZSA9IGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgdmFyIGF2YWlsYWJsZURpcmVjdGlvbnMgPSBfdGhpcy5nZXRBdmFpbGFibGVEaXJlY3Rpb25zKG1hcCk7XHJcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb25Ub01vdmUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoYXZhaWxhYmxlRGlyZWN0aW9ucy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvblRvTW92ZSA9IGF2YWlsYWJsZURpcmVjdGlvbnNbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYXZhaWxhYmxlRGlyZWN0aW9ucy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVEaXJlY3Rpb25zLmluY2x1ZGVzKF90aGlzLmRpcmVjdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25Ub01vdmUgPSBfdGhpcy5kaXJlY3Rpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25Ub01vdmUgPSBhdmFpbGFibGVEaXJlY3Rpb25zWygwLCB1dGlsc18yLmdldFJhbmRvbUludGVnZXIpKDEpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXZlcnNEaXJlY3Rpb25fMSA9ICgwLCB1dGlsc18yLmdldFJldmVyc2VEaXJlY3Rpb24pKF90aGlzLmRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlRGlyZWN0aW9ucy5pbmNsdWRlcyhfdGhpcy5kaXJlY3Rpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uVG9Nb3ZlID0gYXZhaWxhYmxlRGlyZWN0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7IHJldHVybiBlbCAhPT0gcmV2ZXJzRGlyZWN0aW9uXzE7IH0pWygwLCB1dGlsc18yLmdldFJhbmRvbUludGVnZXIpKGF2YWlsYWJsZURpcmVjdGlvbnMubGVuZ3RoIC0gMSldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uVG9Nb3ZlID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlRGlyZWN0aW9uc1soMCwgdXRpbHNfMi5nZXRSYW5kb21JbnRlZ2VyKShhdmFpbGFibGVEaXJlY3Rpb25zLmxlbmd0aCAtIDEpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvblRvTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnRG93bic6XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMueSA9IF90aGlzLnkgKyBjb25zdGFudHNfMS5QTEFZRVJfU1BFRUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdMZWZ0JzpcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy54ID0gX3RoaXMueCAtIGNvbnN0YW50c18xLlBMQVlFUl9TUEVFRDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1JpZ2h0JzpcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy54ID0gX3RoaXMueCArIGNvbnN0YW50c18xLlBMQVlFUl9TUEVFRDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1VwJzpcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy55ID0gX3RoaXMueSAtIGNvbnN0YW50c18xLlBMQVlFUl9TUEVFRDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25Ub01vdmU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdldEF2YWlsYWJsZURpcmVjdGlvbnMgPSBmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgIHZhciBhbGxEaXJlY3Rpb25zID0gWydVcCcsICdEb3duJywgJ0xlZnQnLCAnUmlnaHQnXTtcclxuICAgICAgICAgICAgcmV0dXJuIGFsbERpcmVjdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmNhblR1cm5Ub0RpcmVjdGlvbihtYXAsIGVsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNhblR1cm5Ub0RpcmVjdGlvbiA9IGZ1bmN0aW9uIChtYXAsIGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gISgwLCB1dGlsc18xLmhhc1dhbGxDb2xsaXNpb24pKHsgeDogX3RoaXMueCwgeTogX3RoaXMueSB9LCBtYXAsIGRpcmVjdGlvbik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdldENvb3JkaW5hdGVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgeDogX3RoaXMueCxcclxuICAgICAgICAgICAgICAgIHk6IF90aGlzLnlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ2V0RGlyZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuZGlyZWN0aW9uO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5nZXRJRCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmlkOyB9O1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnggPSBjb2wgKiBjb25zdGFudHNfMS5USUxFX1NJWkU7XHJcbiAgICAgICAgdGhpcy55ID0gcm93ICogY29uc3RhbnRzXzEuVElMRV9TSVpFO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSAoMCwgdXRpbHNfMi5nZXRSYW5kb21FbmVteUNvbG9yKSgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIEVuZW15O1xyXG59KCkpO1xyXG5leHBvcnRzLkVuZW15ID0gRW5lbXk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59O1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzLnJlbmRlckdhbWVGaW5pc2hlZCA9IHZvaWQgMDtcclxudmFyIGNvbnRleHRfMSA9IHJlcXVpcmUoXCIuLi9jb250ZXh0XCIpO1xyXG52YXIgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vbWFwcy9jb25zdGFudHNcIik7XHJcbnZhciBnYW1lU3RhdGVUeXBlXzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvZ2FtZVN0YXRlVHlwZVwiKTtcclxudmFyIHJlc3VsdHMgPSBbXHJcbiAgICB7IG5hbWU6ICdQYXZlbCcsIHNjb3JlczogMTAwMCB9LFxyXG4gICAgeyBuYW1lOiAnTWF4Jywgc2NvcmVzOiA1MDAgfSxcclxuICAgIHsgbmFtZTogJ0RpbW9uJywgc2NvcmVzOiAzMDAgfVxyXG5dO1xyXG52YXIgcmVuZGVyR2FtZUZpbmlzaGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIF9hID0gY29udGV4dF8xW1wiZGVmYXVsdFwiXS5nZXQoKSwgY3R4ID0gX2EuZ3JhcGhpY0NvbnRleHQsIHNjb3JlcyA9IF9hLnNjb3JlcywgZ2FtZVN0YXRlID0gX2EuZ2FtZVN0YXRlO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmZvbnQgPSBcImJvbGQgXCIuY29uY2F0KGdhbWVTdGF0ZSA9PT0gZ2FtZVN0YXRlVHlwZV8xLkdhbWVTdGF0ZS5HQU1FX09WRVIgPyA5MCA6IDUwLCBcInB4IHNhbnMtc2VyaWZcIik7XHJcbiAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XHJcbiAgICBjdHguc2hhZG93Q29sb3IgPSBnYW1lU3RhdGUgPT09IGdhbWVTdGF0ZVR5cGVfMS5HYW1lU3RhdGUuR0FNRV9PVkVSID8gJyNmNDQzMzYnIDogJyM3YjFmYTInO1xyXG4gICAgY3R4LnNoYWRvd0JsdXIgPSA1MDtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBnYW1lU3RhdGUgPT09IGdhbWVTdGF0ZVR5cGVfMS5HYW1lU3RhdGUuR0FNRV9PVkVSID8gJyNmNDQzMzYnIDogJyM3YjFmYTInO1xyXG4gICAgY3R4LmZpbGxUZXh0KGdhbWVTdGF0ZSA9PT0gZ2FtZVN0YXRlVHlwZV8xLkdhbWVTdGF0ZS5HQU1FX09WRVIgPyAnR0FNRSBPVkVSJyA6ICdZT1UgV09OIFRIRSBHQU1FJywgMjg1LCAxNTApO1xyXG4gICAgY3R4LnJlY3QoMjEwLCA1MDAsIDE1MCwgNDApO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGdhbWVTdGF0ZSA9PT0gZ2FtZVN0YXRlVHlwZV8xLkdhbWVTdGF0ZS5HQU1FX09WRVIgPyAnI2Y0NDMzNicgOiAnIzdiMWZhMic7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgY3R4LnNoYWRvd0NvbG9yID0gJ25vbmUnO1xyXG4gICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xyXG4gICAgY3R4LmZvbnQgPSAnYm9sZCAyMHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XHJcbiAgICBjdHguZmlsbFRleHQoJ1JFU1RBUlQnLCAyODUsIDUyMCk7XHJcbiAgICBjdHguZm9udCA9ICdib2xkIDMwcHggc2Fucy1zZXJpZic7XHJcbiAgICBjdHguZmlsbFRleHQoJ0Jlc3Qgc2NvcmVzOicsIDI4NSwgMjUwKTtcclxuICAgIGN0eC5mb250ID0gJ2JvbGQgMjBweCBzYW5zLXNlcmlmJztcclxuICAgIHZhciByZWNvcmRzID0gX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCByZXN1bHRzLCB0cnVlKSwgW3sgbmFtZTogJ1lvdScsIHNjb3Jlczogc2NvcmVzIH1dLCBmYWxzZSkuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYi5zY29yZXMgLSBhLnNjb3JlczsgfSk7XHJcbiAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24gKGVsLCBpbmRleCkge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBlbC5uYW1lID09PSAnWW91JyA/ICcjN2IxZmEyJyA6ICd3aGl0ZSc7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdsZWZ0JztcclxuICAgICAgICBjdHguZmlsbFRleHQoXCJcIi5jb25jYXQoaW5kZXggKyAxLCBcIi4gXCIpLmNvbmNhdChlbC5uYW1lKSwgMTAwLCAzMjAgKyBpbmRleCAqIDQwKTtcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gJ3JpZ2h0JztcclxuICAgICAgICBjdHguZmlsbFRleHQoXCJcIi5jb25jYXQobmV3IEFycmF5KDU0IC0gZWwubmFtZS5sZW5ndGggLSBlbC5zY29yZXMudG9TdHJpbmcoKS5sZW5ndGgpXHJcbiAgICAgICAgICAgIC5maWxsKG51bGwpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gJy4nOyB9KVxyXG4gICAgICAgICAgICAuam9pbignJyksIFwiIFwiKS5jb25jYXQoZWwuc2NvcmVzKSwgY29uc3RhbnRzXzEuU0NSRUVOX1NJWkUgLSAxMDAsIDMyMCArIGluZGV4ICogNDApO1xyXG4gICAgfSk7XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbn07XHJcbmV4cG9ydHMucmVuZGVyR2FtZUZpbmlzaGVkID0gcmVuZGVyR2FtZUZpbmlzaGVkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5yZW5kZXJHYW1lVG9vbGJhciA9IHZvaWQgMDtcclxudmFyIGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL21hcHMvY29uc3RhbnRzXCIpO1xyXG52YXIgY29udGV4dF8xID0gcmVxdWlyZShcIi4uL2NvbnRleHRcIik7XHJcbnZhciByZW5kZXJHYW1lVG9vbGJhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBfYSA9IGNvbnRleHRfMVtcImRlZmF1bHRcIl0uZ2V0KCksIGxpdmVzID0gX2EubGl2ZXMsIGN0eCA9IF9hLmdyYXBoaWNDb250ZXh0O1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LnJlY3QoMCwgY29uc3RhbnRzXzEuU0NSRUVOX1NJWkUsIGNvbnN0YW50c18xLlNDUkVFTl9TSVpFLCBjb25zdGFudHNfMS5UT09MQkFSX0hFSUdIVCk7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25zdGFudHNfMS5DT05DUkVURV9DT0xPUjtcclxuICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXZlczsgaSsrKSB7XHJcbiAgICAgICAgcmVuZGVySGVhcnQoaSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXJTY29yZXMoKTtcclxuICAgIHJlbmRlckxldmVsTnVtYmVyKCk7XHJcbn07XHJcbmV4cG9ydHMucmVuZGVyR2FtZVRvb2xiYXIgPSByZW5kZXJHYW1lVG9vbGJhcjtcclxudmFyIHJlbmRlckhlYXJ0ID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICB2YXIgY3R4ID0gY29udGV4dF8xW1wiZGVmYXVsdFwiXS5nZXQoKS5ncmFwaGljQ29udGV4dDtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoMTAgKyBpbmRleCAqIGNvbnN0YW50c18xLlRJTEVfU0laRSwgY29uc3RhbnRzXzEuU0NSRUVOX1NJWkUgKyAxMCwgNSwgMCwgTWF0aC5QSSwgdHJ1ZSk7XHJcbiAgICBjdHguYXJjKDIwICsgaW5kZXggKiBjb25zdGFudHNfMS5USUxFX1NJWkUsIGNvbnN0YW50c18xLlNDUkVFTl9TSVpFICsgMTAsIDUsIDAsIE1hdGguUEksIHRydWUpO1xyXG4gICAgY3R4Lm1vdmVUbygyNSArIGluZGV4ICogY29uc3RhbnRzXzEuVElMRV9TSVpFLCBjb25zdGFudHNfMS5TQ1JFRU5fU0laRSArIDEwKTtcclxuICAgIGN0eC5iZXppZXJDdXJ2ZVRvKDI1ICsgaW5kZXggKiBjb25zdGFudHNfMS5USUxFX1NJWkUsIGNvbnN0YW50c18xLlNDUkVFTl9TSVpFICsgMTQsIDIwICsgaW5kZXggKiBjb25zdGFudHNfMS5USUxFX1NJWkUsIGNvbnN0YW50c18xLlNDUkVFTl9TSVpFICsgMjIsIDE1ICsgaW5kZXggKiBjb25zdGFudHNfMS5USUxFX1NJWkUsIGNvbnN0YW50c18xLlNDUkVFTl9TSVpFICsgMjUpO1xyXG4gICAgY3R4LmJlemllckN1cnZlVG8oMTAgKyBpbmRleCAqIGNvbnN0YW50c18xLlRJTEVfU0laRSwgY29uc3RhbnRzXzEuU0NSRUVOX1NJWkUgKyAyMiwgNSArIGluZGV4ICogY29uc3RhbnRzXzEuVElMRV9TSVpFLCBjb25zdGFudHNfMS5TQ1JFRU5fU0laRSArIDE0LCA1ICsgaW5kZXggKiBjb25zdGFudHNfMS5USUxFX1NJWkUsIGNvbnN0YW50c18xLlNDUkVFTl9TSVpFICsgMTApO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxufTtcclxudmFyIHJlbmRlclNjb3JlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBfYSA9IGNvbnRleHRfMVtcImRlZmF1bHRcIl0uZ2V0KCksIGN0eCA9IF9hLmdyYXBoaWNDb250ZXh0LCBzY29yZXMgPSBfYS5zY29yZXM7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHguZm9udCA9ICdib2xkIDE4cHggc2Fucy1zZXJpZic7XHJcbiAgICBjdHgudGV4dEFsaWduID0gJ2VuZCc7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xyXG4gICAgY3R4LmZpbGxUZXh0KFwiU0NPUkVTOiBcIi5jb25jYXQoc2NvcmVzKSwgY29uc3RhbnRzXzEuU0NSRUVOX1NJWkUgLSA1LCBjb25zdGFudHNfMS5TQ1JFRU5fU0laRSArIGNvbnN0YW50c18xLlRJTEVfU0laRSAvIDIgKyAxKTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxufTtcclxudmFyIHJlbmRlckxldmVsTnVtYmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIF9hID0gY29udGV4dF8xW1wiZGVmYXVsdFwiXS5nZXQoKSwgY3R4ID0gX2EuZ3JhcGhpY0NvbnRleHQsIGxldmVsSW5kZXggPSBfYS5sZXZlbEluZGV4O1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmZvbnQgPSAnYm9sZCAxOHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcclxuICAgIGN0eC5maWxsVGV4dChcIkxFVkVMOiBcIi5jb25jYXQobGV2ZWxJbmRleCArIDEpLCBjb25zdGFudHNfMS5TQ1JFRU5fU0laRSAvIDIsIGNvbnN0YW50c18xLlNDUkVFTl9TSVpFICsgY29uc3RhbnRzXzEuVElMRV9TSVpFIC8gMiArIDEpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5yZW5kZXJNYXAgPSB2b2lkIDA7XHJcbnZhciBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9tYXBzL2NvbnN0YW50c1wiKTtcclxudmFyIGNvbnRleHRfMSA9IHJlcXVpcmUoXCIuLi9jb250ZXh0XCIpO1xyXG52YXIgcmVuZGVyTWFwID0gZnVuY3Rpb24gKG1hcERhdGEpIHtcclxuICAgIHZhciBjdHggPSBjb250ZXh0XzFbXCJkZWZhdWx0XCJdLmdldCgpLmdyYXBoaWNDb250ZXh0O1xyXG4gICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgY29uc3RhbnRzXzEuQlJJQ0tTX0NPVU5UOyByb3crKykge1xyXG4gICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IGNvbnN0YW50c18xLkJSSUNLU19DT1VOVDsgY29sKyspIHtcclxuICAgICAgICAgICAgaWYgKG1hcERhdGFbcm93XVtjb2xdID09PSBjb25zdGFudHNfMS5XQUxMX1pPTkUpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlcldhbGwocm93LCBjb2wsIGN0eCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobWFwRGF0YVtyb3ddW2NvbF0gPT09IGNvbnN0YW50c18xLkRPVF9aT05FKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJEb3Qocm93LCBjb2wsIGN0eCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMucmVuZGVyTWFwID0gcmVuZGVyTWFwO1xyXG52YXIgcmVuZGVyV2FsbCA9IGZ1bmN0aW9uIChyb3csIGNvbCwgY3R4KSB7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgucmVjdChjb2wgKiBjb25zdGFudHNfMS5USUxFX1NJWkUsIHJvdyAqIGNvbnN0YW50c18xLlRJTEVfU0laRSwgY29uc3RhbnRzXzEuVElMRV9TSVpFLCBjb25zdGFudHNfMS5USUxFX1NJWkUpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbnN0YW50c18xLkNPTkNSRVRFX0NPTE9SO1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uc3RhbnRzXzEuQ09OQ1JFVEVfQ09MT1I7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LnJlY3QoY29sICogY29uc3RhbnRzXzEuVElMRV9TSVpFLCByb3cgKiBjb25zdGFudHNfMS5USUxFX1NJWkUgKyAxLCBjb25zdGFudHNfMS5USUxFX1NJWkUgKiAwLjIsIDgpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbnN0YW50c18xLkJSSUNLX0NPTE9SO1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uc3RhbnRzXzEuQlJJQ0tfQ09MT1I7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LnJlY3QoY29sICogY29uc3RhbnRzXzEuVElMRV9TSVpFICsgY29uc3RhbnRzXzEuVElMRV9TSVpFICogMC4yICsgMiwgcm93ICogY29uc3RhbnRzXzEuVElMRV9TSVpFICsgMSwgY29uc3RhbnRzXzEuVElMRV9TSVpFICogMC44IC0gMiwgOCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gY29uc3RhbnRzXzEuQlJJQ0tfQ09MT1I7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25zdGFudHNfMS5CUklDS19DT0xPUjtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgucmVjdChjb2wgKiBjb25zdGFudHNfMS5USUxFX1NJWkUsIHJvdyAqIGNvbnN0YW50c18xLlRJTEVfU0laRSArIDExLCBjb25zdGFudHNfMS5USUxFX1NJWkUgLyAyIC0gMSwgOCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gY29uc3RhbnRzXzEuQlJJQ0tfQ09MT1I7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25zdGFudHNfMS5CUklDS19DT0xPUjtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgucmVjdChjb2wgKiBjb25zdGFudHNfMS5USUxFX1NJWkUgKyBjb25zdGFudHNfMS5USUxFX1NJWkUgLyAyICsgMSwgcm93ICogY29uc3RhbnRzXzEuVElMRV9TSVpFICsgMTEsIGNvbnN0YW50c18xLlRJTEVfU0laRSAvIDIgLSAxLCA4KTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBjb25zdGFudHNfMS5CUklDS19DT0xPUjtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbnN0YW50c18xLkJSSUNLX0NPTE9SO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5yZWN0KGNvbCAqIGNvbnN0YW50c18xLlRJTEVfU0laRSwgcm93ICogY29uc3RhbnRzXzEuVElMRV9TSVpFICsgY29uc3RhbnRzXzEuVElMRV9TSVpFIC0gOSwgY29uc3RhbnRzXzEuVElMRV9TSVpFICogMC44LCA4KTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBjb25zdGFudHNfMS5CUklDS19DT0xPUjtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbnN0YW50c18xLkJSSUNLX0NPTE9SO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5yZWN0KGNvbCAqIGNvbnN0YW50c18xLlRJTEVfU0laRSArIGNvbnN0YW50c18xLlRJTEVfU0laRSAqIDAuOCArIDIsIHJvdyAqIGNvbnN0YW50c18xLlRJTEVfU0laRSArIGNvbnN0YW50c18xLlRJTEVfU0laRSAtIDksIGNvbnN0YW50c18xLlRJTEVfU0laRSAqIDAuMiAtIDIsIDgpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbnN0YW50c18xLkJSSUNLX0NPTE9SO1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uc3RhbnRzXzEuQlJJQ0tfQ09MT1I7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG59O1xyXG52YXIgcmVuZGVyRG90ID0gZnVuY3Rpb24gKHJvdywgY29sLCBjdHgpIHtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoY29sICogY29uc3RhbnRzXzEuVElMRV9TSVpFICsgY29uc3RhbnRzXzEuVElMRV9TSVpFIC8gMiwgcm93ICogY29uc3RhbnRzXzEuVElMRV9TSVpFICsgY29uc3RhbnRzXzEuVElMRV9TSVpFIC8gMiwgMTAsIDAsIE1hdGguUEkgKiAyKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSAnI2VmZWY1ZCc7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gJyNDQzk5MzMnO1xyXG4gICAgY3R4LmFyYyhjb2wgKiBjb25zdGFudHNfMS5USUxFX1NJWkUgKyBjb25zdGFudHNfMS5USUxFX1NJWkUgLyAyLCByb3cgKiBjb25zdGFudHNfMS5USUxFX1NJWkUgKyBjb25zdGFudHNfMS5USUxFX1NJWkUgLyAyLCA5LCAwLCBNYXRoLlBJICogMik7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICBjdHguZm9udCA9ICdib2xkIDExcHggc2Fucy1zZXJpZic7XHJcbiAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJyNDQzk5MzMnO1xyXG4gICAgY3R4LmZpbGxUZXh0KCckJywgY29sICogY29uc3RhbnRzXzEuVElMRV9TSVpFICsgY29uc3RhbnRzXzEuVElMRV9TSVpFIC8gMiwgcm93ICogY29uc3RhbnRzXzEuVElMRV9TSVpFICsgY29uc3RhbnRzXzEuVElMRV9TSVpFIC8gMiArIDEpO1xyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5yZW5kZXJHYW1lU3RhcnQgPSB2b2lkIDA7XHJcbnZhciBjb250ZXh0XzEgPSByZXF1aXJlKFwiLi4vY29udGV4dFwiKTtcclxudmFyIGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL21hcHMvY29uc3RhbnRzXCIpO1xyXG52YXIgcmVuZGVyR2FtZVN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGN0eCA9IGNvbnRleHRfMVtcImRlZmF1bHRcIl0uZ2V0KCkuZ3JhcGhpY0NvbnRleHQ7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHguZm9udCA9ICdib2xkIDgwcHggc2Fucy1zZXJpZic7XHJcbiAgICBjdHgudGV4dEFsaWduID0gJ2xlZnQnO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xyXG4gICAgY3R4LnNoYWRvd0NvbG9yID0gJyM3YjFmYTInO1xyXG4gICAgY3R4LnNoYWRvd0JsdXIgPSA1MDtcclxuICAgIGN0eC5maWxsU3R5bGUgPSAnIzdiMWZhMic7XHJcbiAgICBjdHguZmlsbFRleHQoJ0MnLCA1MCwgY29uc3RhbnRzXzEuU0NSRUVOX1NJWkUgLyAyKTtcclxuICAgIGN0eC5maWxsVGV4dCgnSSBOIE0gQSBOJywgMTk1LCBjb25zdGFudHNfMS5TQ1JFRU5fU0laRSAvIDIpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYygxNTAsIGNvbnN0YW50c18xLlNDUkVFTl9TSVpFIC8gMiAtIDUsIDMwLCAwLCBNYXRoLlBJICogMik7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJyNlZmVmNWQnO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjQ0M5OTMzJztcclxuICAgIGN0eC5hcmMoMTUwLCBjb25zdGFudHNfMS5TQ1JFRU5fU0laRSAvIDIgLSA1LCAyNSwgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgY3R4LmZvbnQgPSAnYm9sZCA0NXB4IHNhbnMtc2VyaWYnO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjQ0M5OTMzJztcclxuICAgIGN0eC5maWxsVGV4dCgnJCcsIDE1MCwgY29uc3RhbnRzXzEuU0NSRUVOX1NJWkUgLyAyIC0gMik7XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgucmVjdCgyMjAsIDQwMCwgMTMwLCA0MCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJyM3YjFmYTInO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5zaGFkb3dDb2xvciA9ICdub25lJztcclxuICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcclxuICAgIGN0eC5mb250ID0gJ2JvbGQgMjBweCBzYW5zLXNlcmlmJztcclxuICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xyXG4gICAgY3R4LmZpbGxUZXh0KCdTVEFSVCcsIDI4NSwgNDIwKTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxufTtcclxuZXhwb3J0cy5yZW5kZXJHYW1lU3RhcnQgPSByZW5kZXJHYW1lU3RhcnQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzLlBsYXllciA9IHZvaWQgMDtcclxudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcclxudmFyIGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL21hcHMvY29uc3RhbnRzXCIpO1xyXG52YXIgY29udGV4dF8xID0gcmVxdWlyZShcIi4uL2NvbnRleHRcIik7XHJcbnZhciBQbGF5ZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQbGF5ZXIoY29sLCByb3cpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMueCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy55ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIHRoaXMubmV4dFR1cm4gPSBudWxsO1xyXG4gICAgICAgIHRoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY3R4ID0gY29udGV4dF8xW1wiZGVmYXVsdFwiXS5nZXQoKS5ncmFwaGljQ29udGV4dDtcclxuICAgICAgICAgICAgdmFyIHBsYXllckNvb3JkcyA9IGdldFBsYXllckRyYXdQYXJhbXMoZ2V0TW91dGhBbmdlbCgpLCBfdGhpcy5kaXJlY3Rpb24gfHwgJ0xlZnQnKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYXJjKF90aGlzLnggKyBjb25zdGFudHNfMS5USUxFX1NJWkUgLyAyLCBfdGhpcy55ICsgY29uc3RhbnRzXzEuVElMRV9TSVpFIC8gMiwgY29uc3RhbnRzXzEuUExBWUVSX1NJWkUgLyAyLCBwbGF5ZXJDb29yZHMuc3RhcnRBbmdsZSwgcGxheWVyQ29vcmRzLmVuZEFuZ2xlKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhfdGhpcy54ICsgY29uc3RhbnRzXzEuVElMRV9TSVpFIC8gMiwgX3RoaXMueSArIGNvbnN0YW50c18xLlRJTEVfU0laRSAvIDIpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5hcmMoX3RoaXMueCArIHBsYXllckNvb3Jkcy5leWVYLCBfdGhpcy55ICsgcGxheWVyQ29vcmRzLmV5ZVksIDMsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbnN0YW50c18xLlBMQVlFUl9DT0xPUjtcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jYW5Nb3ZlID0gZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKCEoMCwgdXRpbHNfMS5oYXNXYWxsQ29sbGlzaW9uKShfdGhpcy5nZXRDb29yZGluYXRlcygpLCBtYXAsIF90aGlzLmRpcmVjdGlvbikgfHxcclxuICAgICAgICAgICAgICAgIChCb29sZWFuKF90aGlzLm5leHRUdXJuKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICEoMCwgdXRpbHNfMS5oYXNXYWxsQ29sbGlzaW9uKShfdGhpcy5nZXRDb29yZGluYXRlcygpLCBtYXAsIF90aGlzLm5leHRUdXJuKSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5tb3ZlID0gZnVuY3Rpb24gKG1hcCwgb25FYXRpbmdEb3QpIHtcclxuICAgICAgICAgICAgaWYgKF90aGlzLmNhbk1vdmUobWFwKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmlzTW92aW5nICYmIEJvb2xlYW4oX3RoaXMuZGlyZWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChCb29sZWFuKF90aGlzLm5leHRUdXJuKSAmJiBfdGhpcy5jYW5UdXJuKG1hcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfdGhpcy5uZXh0VHVybikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnRG93bic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMueSA9IF90aGlzLnkgKyBjb25zdGFudHNfMS5QTEFZRVJfU1BFRUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdMZWZ0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy54ID0gX3RoaXMueCAtIGNvbnN0YW50c18xLlBMQVlFUl9TUEVFRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ1JpZ2h0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy54ID0gX3RoaXMueCArIGNvbnN0YW50c18xLlBMQVlFUl9TUEVFRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ1VwJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy55ID0gX3RoaXMueSAtIGNvbnN0YW50c18xLlBMQVlFUl9TUEVFRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5kaXJlY3Rpb24gPSBfdGhpcy5uZXh0VHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMubmV4dFR1cm4gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfdGhpcy5kaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0Rvd24nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnkgPSBfdGhpcy55ICsgY29uc3RhbnRzXzEuUExBWUVSX1NQRUVEO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnVXAnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnkgPSBfdGhpcy55IC0gY29uc3RhbnRzXzEuUExBWUVSX1NQRUVEO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnTGVmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMueCA9IF90aGlzLnggLSBjb25zdGFudHNfMS5QTEFZRVJfU1BFRUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdSaWdodCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMueCA9IF90aGlzLnggKyBjb25zdGFudHNfMS5QTEFZRVJfU1BFRUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHBvc3NpYmxlQ2VsbHNXaXRoRG90cyA9ICgwLCB1dGlsc18xLmdldENlbGxzQnlDb29yZGluYXRlcykoe1xyXG4gICAgICAgICAgICAgICAgeDogX3RoaXMueCxcclxuICAgICAgICAgICAgICAgIHk6IF90aGlzLnlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHBvc3NpYmxlQ2VsbHNXaXRoRG90cy5mb3JFYWNoKGZ1bmN0aW9uIChjZWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWFwW2NlbGwucm93XVtjZWxsLmNvbF0gPT09IGNvbnN0YW50c18xLkRPVF9aT05FKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25FYXRpbmdEb3QoY2VsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5nZXRDb29yZGluYXRlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IF90aGlzLngsXHJcbiAgICAgICAgICAgICAgICB5OiBfdGhpcy55XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdldERpcmVjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmRpcmVjdGlvbjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ2V0SXNNb3ZpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5pc01vdmluZztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ2V0VHVybkRpcmVjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzLm5leHRUdXJuO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEaXJlY3Rpb25DaGFuZ2UgPSBmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdSaWdodCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5kaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5uZXh0VHVybiA9ICdSaWdodCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5pc01vdmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGlyZWN0aW9uID0gJ1JpZ2h0JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdMZWZ0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm5leHRUdXJuID0gJ0xlZnQnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaXNNb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRpcmVjdGlvbiA9ICdMZWZ0JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdVcCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5kaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5uZXh0VHVybiA9ICdVcCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5pc01vdmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGlyZWN0aW9uID0gJ1VwJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdEb3duJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm5leHRUdXJuID0gJ0Rvd24nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaXNNb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRpcmVjdGlvbiA9ICdEb3duJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jYW5UdXJuID0gZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gISgwLCB1dGlsc18xLmhhc1dhbGxDb2xsaXNpb24pKHsgeDogX3RoaXMueCwgeTogX3RoaXMueSB9LCBtYXAsIF90aGlzLm5leHRUdXJuKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMueCA9IGNvbCAqIGNvbnN0YW50c18xLlRJTEVfU0laRTtcclxuICAgICAgICB0aGlzLnkgPSByb3cgKiBjb25zdGFudHNfMS5USUxFX1NJWkU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gUGxheWVyO1xyXG59KCkpO1xyXG5leHBvcnRzLlBsYXllciA9IFBsYXllcjtcclxudmFyIGdldFBsYXllckRyYXdQYXJhbXMgPSBmdW5jdGlvbiAobW91dGhBbmdsZSwgZGlyZWN0aW9uKSB7XHJcbiAgICB2YXIgaGFsZkFuZ2VsID0gbW91dGhBbmdsZSAvIDI7XHJcbiAgICB2YXIgY29uZmlnID0ge1xyXG4gICAgICAgIFJpZ2h0OiB7XHJcbiAgICAgICAgICAgIHN0YXJ0QW5nbGU6IDAsXHJcbiAgICAgICAgICAgIGVuZEFuZ2xlOiAzNjAsXHJcbiAgICAgICAgICAgIGV5ZVhNdWx0aXBsaWVyOiAxIC8gMixcclxuICAgICAgICAgICAgZXllWU11bHRpcGxpZXI6IDEgLyA0XHJcbiAgICAgICAgfSxcclxuICAgICAgICBMZWZ0OiB7XHJcbiAgICAgICAgICAgIHN0YXJ0QW5nbGU6IDE4MCxcclxuICAgICAgICAgICAgZW5kQW5nbGU6IDE4MCxcclxuICAgICAgICAgICAgZXllWE11bHRpcGxpZXI6IDEgLyAyLFxyXG4gICAgICAgICAgICBleWVZTXVsdGlwbGllcjogMSAvIDRcclxuICAgICAgICB9LFxyXG4gICAgICAgIFVwOiB7XHJcbiAgICAgICAgICAgIHN0YXJ0QW5nbGU6IDI3MCxcclxuICAgICAgICAgICAgZW5kQW5nbGU6IDI3MCxcclxuICAgICAgICAgICAgZXllWE11bHRpcGxpZXI6IDEgLyA0LFxyXG4gICAgICAgICAgICBleWVZTXVsdGlwbGllcjogMSAvIDJcclxuICAgICAgICB9LFxyXG4gICAgICAgIERvd246IHtcclxuICAgICAgICAgICAgc3RhcnRBbmdsZTogOTAsXHJcbiAgICAgICAgICAgIGVuZEFuZ2xlOiA5MCxcclxuICAgICAgICAgICAgZXllWE11bHRpcGxpZXI6IDEgLyA0LFxyXG4gICAgICAgICAgICBleWVZTXVsdGlwbGllcjogMSAvIDJcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdGFydEFuZ2xlOiAoY29uZmlnW2RpcmVjdGlvbl0uc3RhcnRBbmdsZSArIGhhbGZBbmdlbCkgKiAoTWF0aC5QSSAvIDE4MCksXHJcbiAgICAgICAgZW5kQW5nbGU6IChjb25maWdbZGlyZWN0aW9uXS5lbmRBbmdsZSAtIGhhbGZBbmdlbCkgKiAoTWF0aC5QSSAvIDE4MCksXHJcbiAgICAgICAgZXllWDogY29uc3RhbnRzXzEuVElMRV9TSVpFICogY29uZmlnW2RpcmVjdGlvbl0uZXllWE11bHRpcGxpZXIsXHJcbiAgICAgICAgZXllWTogY29uc3RhbnRzXzEuVElMRV9TSVpFICogY29uZmlnW2RpcmVjdGlvbl0uZXllWU11bHRpcGxpZXJcclxuICAgIH07XHJcbn07XHJcbnZhciBnZXRNb3V0aEFuZ2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKCk7XHJcbiAgICByZXR1cm4gbWlsbGlzZWNvbmRzIDwgNTAwID8gbWlsbGlzZWNvbmRzIC8gMTAgOiAoMTAwMCAtIG1pbGxpc2Vjb25kcykgLyAxMDtcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMucmVuZGVyUG9wdXAgPSB2b2lkIDA7XHJcbnZhciBjb250ZXh0XzEgPSByZXF1aXJlKFwiLi4vY29udGV4dFwiKTtcclxudmFyIGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL21hcHMvY29uc3RhbnRzXCIpO1xyXG52YXIgcmVuZGVyUG9wdXAgPSBmdW5jdGlvbiAodHlwZSwgbWVzc2FnZXMpIHtcclxuICAgIHZhciBjdHggPSBjb250ZXh0XzFbXCJkZWZhdWx0XCJdLmdldCgpLmdyYXBoaWNDb250ZXh0O1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LnJlY3QoNzAsIDE4NSwgY29uc3RhbnRzXzEuU0NSRUVOX1NJWkUgLSAxNDAsIDIwMCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gdHlwZSA9PSAnaW5mbycgPyAnIzdiMWZhMicgOiAnI2Y0NDMzNic7XHJcbiAgICBjdHguc2hhZG93Q29sb3IgPSAnYmxhY2snO1xyXG4gICAgY3R4LnNoYWRvd0JsdXIgPSA1MDtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgY3R4LnN0cm9rZVJlY3QoODAsIDE5NSwgY29uc3RhbnRzXzEuU0NSRUVOX1NJWkUgLSAxNjAsIDE4MCk7XHJcbiAgICBjdHguc2hhZG93Q29sb3IgPSAnbm9uZSc7XHJcbiAgICBjdHguc2hhZG93Qmx1ciA9IDA7XHJcbiAgICBjdHguZm9udCA9ICdib2xkIDI0cHggc2Fucy1zZXJpZic7XHJcbiAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xyXG4gICAgdmFyIHN0YXJ0WSA9IGNvbnN0YW50c18xLlNDUkVFTl9TSVpFIC8gMiAtXHJcbiAgICAgICAgKG1lc3NhZ2VzLmxlbmd0aCAtIDEpICogNDAgK1xyXG4gICAgICAgIChtZXNzYWdlcy5sZW5ndGggJSAyID4gMCA/IDAgOiAyMCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KG1lc3NhZ2VzW2ldLCBjb25zdGFudHNfMS5TQ1JFRU5fU0laRSAvIDIsIHN0YXJ0WSArIGkgKiA0MCk7XHJcbiAgICB9XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbn07XHJcbmV4cG9ydHMucmVuZGVyUG9wdXAgPSByZW5kZXJQb3B1cDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMubnVtYmVyT2ZEb3RzTGVmdE9uTWFwID0gZXhwb3J0cy5nZXRDZWxsc0J5Q29vcmRpbmF0ZXMgPSBleHBvcnRzLmRpc3RhbmNlQmV0d2VlbkRvdHMgPSBleHBvcnRzLmdldEVuZW15Q29sbGlzaW9uSUQgPSBleHBvcnRzLmhhc1dhbGxDb2xsaXNpb24gPSBleHBvcnRzLmdldFJldmVyc2VEaXJlY3Rpb24gPSBleHBvcnRzLmdldFJhbmRvbUVuZW15Q29sb3IgPSBleHBvcnRzLmdldFJhbmRvbUludGVnZXIgPSB2b2lkIDA7XHJcbnZhciBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9tYXBzL2NvbnN0YW50c1wiKTtcclxudmFyIGdldFJhbmRvbUludGVnZXIgPSBmdW5jdGlvbiAobikge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG59O1xyXG5leHBvcnRzLmdldFJhbmRvbUludGVnZXIgPSBnZXRSYW5kb21JbnRlZ2VyO1xyXG52YXIgZ2V0UmFuZG9tRW5lbXlDb2xvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBjb25zdGFudHNfMS5FTkVNWV9DT0xPUlNbKDAsIGV4cG9ydHMuZ2V0UmFuZG9tSW50ZWdlcikoY29uc3RhbnRzXzEuRU5FTVlfQ09MT1JTLmxlbmd0aCAtIDEpXTtcclxufTtcclxuZXhwb3J0cy5nZXRSYW5kb21FbmVteUNvbG9yID0gZ2V0UmFuZG9tRW5lbXlDb2xvcjtcclxudmFyIGdldFJldmVyc2VEaXJlY3Rpb24gPSBmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XHJcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgIGNhc2UgJ0Rvd24nOlxyXG4gICAgICAgICAgICByZXR1cm4gJ1VwJztcclxuICAgICAgICBjYXNlICdVcCc6XHJcbiAgICAgICAgICAgIHJldHVybiAnRG93bic7XHJcbiAgICAgICAgY2FzZSAnTGVmdCc6XHJcbiAgICAgICAgICAgIHJldHVybiAnUmlnaHQnO1xyXG4gICAgICAgIGNhc2UgJ1JpZ2h0JzpcclxuICAgICAgICAgICAgcmV0dXJuICdMZWZ0JztcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5nZXRSZXZlcnNlRGlyZWN0aW9uID0gZ2V0UmV2ZXJzZURpcmVjdGlvbjtcclxudmFyIGhhc1dhbGxDb2xsaXNpb24gPSBmdW5jdGlvbiAoY29vcmRzLCBtYXAsIGRpcmVjdGlvbikge1xyXG4gICAgdmFyIHggPSBjb29yZHMueCwgeSA9IGNvb3Jkcy55O1xyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ0Rvd24nKSB7XHJcbiAgICAgICAgLy9pcyBtYXAgZW5kIHJlYWNoZWRcclxuICAgICAgICBpZiAoY29uc3RhbnRzXzEuQlJJQ0tTX0NPVU5UICogY29uc3RhbnRzXzEuVElMRV9TSVpFIDw9IHkgKyBjb25zdGFudHNfMS5USUxFX1NJWkUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlzIG5leHQgcm93IHJlYWNoZWRcclxuICAgICAgICBpZiAoeSAlIGNvbnN0YW50c18xLlRJTEVfU0laRSAhPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXh0WSA9IE1hdGgudHJ1bmMoeSAvIGNvbnN0YW50c18xLlRJTEVfU0laRSkgKyAxO1xyXG4gICAgICAgIHZhciBuZXh0TGVmdFggPSBNYXRoLnRydW5jKHggLyBjb25zdGFudHNfMS5USUxFX1NJWkUpO1xyXG4gICAgICAgIHZhciBuZXh0UmlnaHRYID0gTWF0aC50cnVuYygoeCArIGNvbnN0YW50c18xLlRJTEVfU0laRSAtIDEpIC8gY29uc3RhbnRzXzEuVElMRV9TSVpFKTtcclxuICAgICAgICB2YXIgaGFzTGVmdENvbGxpc2lvbiA9IG1hcFtuZXh0WV1bbmV4dExlZnRYXSA9PT0gY29uc3RhbnRzXzEuV0FMTF9aT05FO1xyXG4gICAgICAgIHZhciBoYXNSaWdodENvbGxpc2lvbiA9IG1hcFtuZXh0WV1bbmV4dFJpZ2h0WF0gPT09IGNvbnN0YW50c18xLldBTExfWk9ORTtcclxuICAgICAgICByZXR1cm4gaGFzTGVmdENvbGxpc2lvbiB8fCBoYXNSaWdodENvbGxpc2lvbjtcclxuICAgIH1cclxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdVcCcpIHtcclxuICAgICAgICAvL2lzIG1hcCBlbmQgcmVhY2hlZFxyXG4gICAgICAgIGlmICh5IDw9IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlzIG5leHQgcm93IHJlYWNoZWRcclxuICAgICAgICBpZiAoeSAlIGNvbnN0YW50c18xLlRJTEVfU0laRSAhPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXh0WSA9IE1hdGgudHJ1bmMoeSAvIGNvbnN0YW50c18xLlRJTEVfU0laRSkgLSAxO1xyXG4gICAgICAgIHZhciBuZXh0TGVmdFggPSBNYXRoLnRydW5jKHggLyBjb25zdGFudHNfMS5USUxFX1NJWkUpO1xyXG4gICAgICAgIHZhciBuZXh0UmlnaHRYID0gTWF0aC50cnVuYygoeCArIGNvbnN0YW50c18xLlRJTEVfU0laRSAtIDEpIC8gY29uc3RhbnRzXzEuVElMRV9TSVpFKTtcclxuICAgICAgICB2YXIgaGFzTGVmdENvbGxpc2lvbiA9IG1hcFtuZXh0WV1bbmV4dExlZnRYXSA9PT0gY29uc3RhbnRzXzEuV0FMTF9aT05FO1xyXG4gICAgICAgIHZhciBoYXNSaWdodENvbGxpc2lvbiA9IG1hcFtuZXh0WV1bbmV4dFJpZ2h0WF0gPT09IGNvbnN0YW50c18xLldBTExfWk9ORTtcclxuICAgICAgICByZXR1cm4gaGFzTGVmdENvbGxpc2lvbiB8fCBoYXNSaWdodENvbGxpc2lvbjtcclxuICAgIH1cclxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdSaWdodCcpIHtcclxuICAgICAgICAvL2lzIG1hcCBlbmQgcmVhY2hlZFxyXG4gICAgICAgIGlmIChjb25zdGFudHNfMS5CUklDS1NfQ09VTlQgKiBjb25zdGFudHNfMS5USUxFX1NJWkUgPD0geCArIGNvbnN0YW50c18xLlRJTEVfU0laRSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaXMgbmV4dCByb3cgcmVhY2hlZFxyXG4gICAgICAgIGlmICh4ICUgY29uc3RhbnRzXzEuVElMRV9TSVpFICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5leHRYID0gTWF0aC50cnVuYyh4IC8gY29uc3RhbnRzXzEuVElMRV9TSVpFKSArIDE7XHJcbiAgICAgICAgdmFyIG5leHRUb3BZID0gTWF0aC50cnVuYyh5IC8gY29uc3RhbnRzXzEuVElMRV9TSVpFKTtcclxuICAgICAgICB2YXIgbmV4dEJvdHRvbVkgPSBNYXRoLnRydW5jKCh5ICsgY29uc3RhbnRzXzEuVElMRV9TSVpFIC0gMSkgLyBjb25zdGFudHNfMS5USUxFX1NJWkUpO1xyXG4gICAgICAgIHZhciBoYXNUb3BDb2xsaXNpb24gPSBtYXBbbmV4dFRvcFldW25leHRYXSA9PT0gY29uc3RhbnRzXzEuV0FMTF9aT05FO1xyXG4gICAgICAgIHZhciBoYXNCb3R0b21Db2xsaXNpb24gPSBtYXBbbmV4dEJvdHRvbVldW25leHRYXSA9PT0gY29uc3RhbnRzXzEuV0FMTF9aT05FO1xyXG4gICAgICAgIHJldHVybiBoYXNUb3BDb2xsaXNpb24gfHwgaGFzQm90dG9tQ29sbGlzaW9uO1xyXG4gICAgfVxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ0xlZnQnKSB7XHJcbiAgICAgICAgLy9pcyBtYXAgZW5kIHJlYWNoZWRcclxuICAgICAgICBpZiAoeCA8PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpcyBuZXh0IHJvdyByZWFjaGVkXHJcbiAgICAgICAgaWYgKHggJSBjb25zdGFudHNfMS5USUxFX1NJWkUgIT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV4dFggPSBNYXRoLnRydW5jKHggLyBjb25zdGFudHNfMS5USUxFX1NJWkUpIC0gMTtcclxuICAgICAgICB2YXIgbmV4dFRvcFkgPSBNYXRoLnRydW5jKHkgLyBjb25zdGFudHNfMS5USUxFX1NJWkUpO1xyXG4gICAgICAgIHZhciBuZXh0Qm90dG9tWSA9IE1hdGgudHJ1bmMoKHkgKyBjb25zdGFudHNfMS5USUxFX1NJWkUgLSAxKSAvIGNvbnN0YW50c18xLlRJTEVfU0laRSk7XHJcbiAgICAgICAgdmFyIGhhc1RvcENvbGxpc2lvbiA9IG1hcFtuZXh0VG9wWV1bbmV4dFhdID09PSBjb25zdGFudHNfMS5XQUxMX1pPTkU7XHJcbiAgICAgICAgdmFyIGhhc0JvdHRvbUNvbGxpc2lvbiA9IG1hcFtuZXh0Qm90dG9tWV1bbmV4dFhdID09PSBjb25zdGFudHNfMS5XQUxMX1pPTkU7XHJcbiAgICAgICAgcmV0dXJuIGhhc1RvcENvbGxpc2lvbiB8fCBoYXNCb3R0b21Db2xsaXNpb247XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn07XHJcbmV4cG9ydHMuaGFzV2FsbENvbGxpc2lvbiA9IGhhc1dhbGxDb2xsaXNpb247XHJcbnZhciBnZXRFbmVteUNvbGxpc2lvbklEID0gZnVuY3Rpb24gKHBsYXllciwgZW5lbWllcykge1xyXG4gICAgdmFyIHJlc3VsdCA9IG51bGw7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoKDAsIGV4cG9ydHMuZGlzdGFuY2VCZXR3ZWVuRG90cykocGxheWVyLmdldENvb3JkaW5hdGVzKCksIGVuZW1pZXNbaV0uZ2V0Q29vcmRpbmF0ZXMoKSkgPD0gY29uc3RhbnRzXzEuQ09MTElTSU9OX0RJU1RBTkNFKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGVuZW1pZXNbaV0uZ2V0SUQoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuZXhwb3J0cy5nZXRFbmVteUNvbGxpc2lvbklEID0gZ2V0RW5lbXlDb2xsaXNpb25JRDtcclxudmFyIGRpc3RhbmNlQmV0d2VlbkRvdHMgPSBmdW5jdGlvbiAoZmlyc3QsIHNlY29uZCkge1xyXG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdygoZmlyc3QueCAtIHNlY29uZC54KSwgMikgKyBNYXRoLnBvdygoZmlyc3QueSAtIHNlY29uZC55KSwgMikpO1xyXG59O1xyXG5leHBvcnRzLmRpc3RhbmNlQmV0d2VlbkRvdHMgPSBkaXN0YW5jZUJldHdlZW5Eb3RzO1xyXG52YXIgZ2V0Q2VsbHNCeUNvb3JkaW5hdGVzID0gZnVuY3Rpb24gKGNvb3JkaW5hdGVzKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAvL2xlZnRUb3BcclxuICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICBjb2w6IE1hdGgudHJ1bmMoY29vcmRpbmF0ZXMueCAvIGNvbnN0YW50c18xLlRJTEVfU0laRSksXHJcbiAgICAgICAgcm93OiBNYXRoLnRydW5jKGNvb3JkaW5hdGVzLnkgLyBjb25zdGFudHNfMS5USUxFX1NJWkUpXHJcbiAgICB9KTtcclxuICAgIC8vcmlnaHRUb3BcclxuICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICBjb2w6IE1hdGgudHJ1bmMoKGNvb3JkaW5hdGVzLnggKyBjb25zdGFudHNfMS5USUxFX1NJWkUgLSAxKSAvIGNvbnN0YW50c18xLlRJTEVfU0laRSksXHJcbiAgICAgICAgcm93OiBNYXRoLnRydW5jKGNvb3JkaW5hdGVzLnkgLyBjb25zdGFudHNfMS5USUxFX1NJWkUpXHJcbiAgICB9KTtcclxuICAgIC8vbGVmdEJvdHRvbVxyXG4gICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgIGNvbDogTWF0aC50cnVuYyhjb29yZGluYXRlcy54IC8gY29uc3RhbnRzXzEuVElMRV9TSVpFKSxcclxuICAgICAgICByb3c6IE1hdGgudHJ1bmMoKGNvb3JkaW5hdGVzLnkgKyBjb25zdGFudHNfMS5USUxFX1NJWkUgLSAxKSAvIGNvbnN0YW50c18xLlRJTEVfU0laRSlcclxuICAgIH0pO1xyXG4gICAgLy9yaWdodEJvdHRvbVxyXG4gICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgIGNvbDogTWF0aC50cnVuYygoY29vcmRpbmF0ZXMueCArIGNvbnN0YW50c18xLlRJTEVfU0laRSAtIDEpIC8gY29uc3RhbnRzXzEuVElMRV9TSVpFKSxcclxuICAgICAgICByb3c6IE1hdGgudHJ1bmMoKGNvb3JkaW5hdGVzLnkgKyBjb25zdGFudHNfMS5USUxFX1NJWkUgLSAxKSAvIGNvbnN0YW50c18xLlRJTEVfU0laRSlcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuZXhwb3J0cy5nZXRDZWxsc0J5Q29vcmRpbmF0ZXMgPSBnZXRDZWxsc0J5Q29vcmRpbmF0ZXM7XHJcbnZhciBudW1iZXJPZkRvdHNMZWZ0T25NYXAgPSBmdW5jdGlvbiAobWFwKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gMDtcclxuICAgIGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IG1hcC5sZW5ndGg7IHJvdysrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgbWFwW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xyXG4gICAgICAgICAgICBpZiAobWFwW3Jvd11bY29sXSA9PT0gY29uc3RhbnRzXzEuRE9UX1pPTkUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuZXhwb3J0cy5udW1iZXJPZkRvdHNMZWZ0T25NYXAgPSBudW1iZXJPZkRvdHNMZWZ0T25NYXA7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzLkdhbWVTdGF0ZSA9IHZvaWQgMDtcclxudmFyIEdhbWVTdGF0ZTtcclxuKGZ1bmN0aW9uIChHYW1lU3RhdGUpIHtcclxuICAgIEdhbWVTdGF0ZVtHYW1lU3RhdGVbXCJHQU1FX05PVF9TVEFSVEVEXCJdID0gMF0gPSBcIkdBTUVfTk9UX1NUQVJURURcIjtcclxuICAgIEdhbWVTdGF0ZVtHYW1lU3RhdGVbXCJHQU1FX0lOX1BST0dSRVNTXCJdID0gMV0gPSBcIkdBTUVfSU5fUFJPR1JFU1NcIjtcclxuICAgIEdhbWVTdGF0ZVtHYW1lU3RhdGVbXCJHQU1FX09WRVJcIl0gPSAyXSA9IFwiR0FNRV9PVkVSXCI7XHJcbiAgICBHYW1lU3RhdGVbR2FtZVN0YXRlW1wiR0FNRV9DT01QTEVURURcIl0gPSAzXSA9IFwiR0FNRV9DT01QTEVURURcIjtcclxufSkoR2FtZVN0YXRlID0gZXhwb3J0cy5HYW1lU3RhdGUgfHwgKGV4cG9ydHMuR2FtZVN0YXRlID0ge30pKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMuTGV2ZWxTdGF0ZSA9IHZvaWQgMDtcclxudmFyIExldmVsU3RhdGU7XHJcbihmdW5jdGlvbiAoTGV2ZWxTdGF0ZSkge1xyXG4gICAgTGV2ZWxTdGF0ZVtMZXZlbFN0YXRlW1wiTEVWRUxfTk9UX1NUQVJURURcIl0gPSAwXSA9IFwiTEVWRUxfTk9UX1NUQVJURURcIjtcclxuICAgIExldmVsU3RhdGVbTGV2ZWxTdGF0ZVtcIkxFVkVMX0lOX1BST0dSRVNTXCJdID0gMV0gPSBcIkxFVkVMX0lOX1BST0dSRVNTXCI7XHJcbiAgICBMZXZlbFN0YXRlW0xldmVsU3RhdGVbXCJQTEFZRVJfRElFRFwiXSA9IDJdID0gXCJQTEFZRVJfRElFRFwiO1xyXG4gICAgTGV2ZWxTdGF0ZVtMZXZlbFN0YXRlW1wiTEVWRUxfQ09NUExFVEVEXCJdID0gNF0gPSBcIkxFVkVMX0NPTVBMRVRFRFwiO1xyXG59KShMZXZlbFN0YXRlID0gZXhwb3J0cy5MZXZlbFN0YXRlIHx8IChleHBvcnRzLkxldmVsU3RhdGUgPSB7fSkpO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMuZ2FtZSA9IHZvaWQgMDtcclxudmFyIGNvbnRleHRfMSA9IHJlcXVpcmUoXCIuL2NvbnRleHRcIik7XHJcbnZhciBldmVudEhhbmRsZXJfMSA9IHJlcXVpcmUoXCIuL2V2ZW50cy9ldmVudEhhbmRsZXJcIik7XHJcbnZhciBsZXZlbF8xID0gcmVxdWlyZShcIi4vbGV2ZWwvbGV2ZWxcIik7XHJcbnZhciBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuL21hcHMvY29uc3RhbnRzXCIpO1xyXG52YXIgbGV2ZWxfMV8xID0gcmVxdWlyZShcIi4vbWFwcy9sZXZlbF8xXCIpO1xyXG52YXIgbGV2ZWxfMl8xID0gcmVxdWlyZShcIi4vbWFwcy9sZXZlbF8yXCIpO1xyXG52YXIgbGV2ZWxfM18xID0gcmVxdWlyZShcIi4vbWFwcy9sZXZlbF8zXCIpO1xyXG52YXIgZ2FtZUZpbmlzaGVkUmVuZGVyZXJfMSA9IHJlcXVpcmUoXCIuL3JlbmRlcnMvZ2FtZUZpbmlzaGVkUmVuZGVyZXJcIik7XHJcbnZhciBnYW1lVG9vbGJhcl8xID0gcmVxdWlyZShcIi4vcmVuZGVycy9nYW1lVG9vbGJhclwiKTtcclxudmFyIG5ld0dhbWVSZW5kZXJlcl8xID0gcmVxdWlyZShcIi4vcmVuZGVycy9uZXdHYW1lUmVuZGVyZXJcIik7XHJcbnZhciBnYW1lU3RhdGVUeXBlXzEgPSByZXF1aXJlKFwiLi90eXBlcy9nYW1lU3RhdGVUeXBlXCIpO1xyXG52YXIgbGV2ZWxTdGF0ZVR5cGVfMSA9IHJlcXVpcmUoXCIuL3R5cGVzL2xldmVsU3RhdGVUeXBlXCIpO1xyXG52YXIgR2FtZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEdhbWUoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmxldmVscyA9IFtsZXZlbF8xXzEubGV2ZWwxLCBsZXZlbF8yXzEubGV2ZWwyLCBsZXZlbF8zXzEubGV2ZWwzXTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRMZXZlbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5rZXlEb3duSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDM5KSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jdXJyZW50TGV2ZWwuaGFuZGxlRGlyZWN0aW9uQ2hhbmdlKCdSaWdodCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMzcpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmN1cnJlbnRMZXZlbC5oYW5kbGVEaXJlY3Rpb25DaGFuZ2UoJ0xlZnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM4KSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jdXJyZW50TGV2ZWwuaGFuZGxlRGlyZWN0aW9uQ2hhbmdlKCdVcCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gNDApIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmN1cnJlbnRMZXZlbC5oYW5kbGVEaXJlY3Rpb25DaGFuZ2UoJ0Rvd24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vbkVhcm5pbmdQb2ludHMgPSBmdW5jdGlvbiAocG9pbnRzKSB7XHJcbiAgICAgICAgICAgIHZhciBzY29yZXMgPSBjb250ZXh0XzFbXCJkZWZhdWx0XCJdLmdldCgpLnNjb3JlcztcclxuICAgICAgICAgICAgY29udGV4dF8xW1wiZGVmYXVsdFwiXS5zZXQoeyBzY29yZXM6IHBvaW50cyArIHNjb3JlcyB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25MZXZlbENvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF9hID0gY29udGV4dF8xW1wiZGVmYXVsdFwiXS5nZXQoKSwgbGV2ZWxJbmRleCA9IF9hLmxldmVsSW5kZXgsIHNjb3JlcyA9IF9hLnNjb3JlcztcclxuICAgICAgICAgICAgY29udGV4dF8xW1wiZGVmYXVsdFwiXS5zZXQoeyBzY29yZXM6IHNjb3JlcyArIDUwIH0pO1xyXG4gICAgICAgICAgICBpZiAobGV2ZWxJbmRleCArIDEgPT09IF90aGlzLmxldmVscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHRfMVtcImRlZmF1bHRcIl0uc2V0KHsgZ2FtZVN0YXRlOiBnYW1lU3RhdGVUeXBlXzEuR2FtZVN0YXRlLkdBTUVfQ09NUExFVEVEIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0xldmVsSW5kZXggPSBsZXZlbEluZGV4ICsgMTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHRfMVtcImRlZmF1bHRcIl0uc2V0KHtcclxuICAgICAgICAgICAgICAgICAgICBsZXZlbEluZGV4OiBuZXdMZXZlbEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIGxldmVsU3RhdGU6IGxldmVsU3RhdGVUeXBlXzEuTGV2ZWxTdGF0ZS5MRVZFTF9OT1RfU1RBUlRFRFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jdXJyZW50TGV2ZWwgPSBuZXcgbGV2ZWxfMS5MZXZlbChfdGhpcy5sZXZlbHNbbmV3TGV2ZWxJbmRleF0sIF90aGlzLm9uRWFybmluZ1BvaW50cywgX3RoaXMub25MZXZlbENvbXBsZXRlZCk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jdXJyZW50TGV2ZWwuc3RhcnRMZXZlbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBfYSA9IGNvbnRleHRfMVtcImRlZmF1bHRcIl0uZ2V0KCksIGdhbWVTdGF0ZSA9IF9hLmdhbWVTdGF0ZSwgY3R4ID0gX2EuZ3JhcGhpY0NvbnRleHQsIGNhbnZhcyA9IF9hLmNhbnZhcztcclxuICAgICAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICBpZiAoZ2FtZVN0YXRlID09PSBnYW1lU3RhdGVUeXBlXzEuR2FtZVN0YXRlLkdBTUVfSU5fUFJPR1JFU1MpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmN1cnJlbnRMZXZlbC5tb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jdXJyZW50TGV2ZWwucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAoMCwgZ2FtZVRvb2xiYXJfMS5yZW5kZXJHYW1lVG9vbGJhcikoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChnYW1lU3RhdGUgPT09IGdhbWVTdGF0ZVR5cGVfMS5HYW1lU3RhdGUuR0FNRV9OT1RfU1RBUlRFRCkge1xyXG4gICAgICAgICAgICAgICAgKDAsIG5ld0dhbWVSZW5kZXJlcl8xLnJlbmRlckdhbWVTdGFydCkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChnYW1lU3RhdGUgPT09IGdhbWVTdGF0ZVR5cGVfMS5HYW1lU3RhdGUuR0FNRV9PVkVSKSB7XHJcbiAgICAgICAgICAgICAgICAoMCwgZ2FtZUZpbmlzaGVkUmVuZGVyZXJfMS5yZW5kZXJHYW1lRmluaXNoZWQpKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZ2FtZVN0YXRlID09PSBnYW1lU3RhdGVUeXBlXzEuR2FtZVN0YXRlLkdBTUVfQ09NUExFVEVEKSB7XHJcbiAgICAgICAgICAgICAgICAoMCwgZ2FtZUZpbmlzaGVkUmVuZGVyZXJfMS5yZW5kZXJHYW1lRmluaXNoZWQpKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKF90aGlzLmRyYXcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdGFydEdhbWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHRfMVtcImRlZmF1bHRcIl0uc2V0KHsgZ2FtZVN0YXRlOiBnYW1lU3RhdGVUeXBlXzEuR2FtZVN0YXRlLkdBTUVfSU5fUFJPR1JFU1MgfSk7XHJcbiAgICAgICAgICAgIF90aGlzLmN1cnJlbnRMZXZlbC5zdGFydExldmVsKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnJlc3RhcnRHYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb250ZXh0XzFbXCJkZWZhdWx0XCJdLnNldCh7XHJcbiAgICAgICAgICAgICAgICBnYW1lU3RhdGU6IGdhbWVTdGF0ZVR5cGVfMS5HYW1lU3RhdGUuR0FNRV9OT1RfU1RBUlRFRCxcclxuICAgICAgICAgICAgICAgIGxldmVsSW5kZXg6IDAsXHJcbiAgICAgICAgICAgICAgICBsZXZlbFN0YXRlOiBsZXZlbFN0YXRlVHlwZV8xLkxldmVsU3RhdGUuTEVWRUxfTk9UX1NUQVJURUQsXHJcbiAgICAgICAgICAgICAgICBsaXZlczogY29uc3RhbnRzXzEuSU5JVElBTF9MSVZFU19DT1VOVCxcclxuICAgICAgICAgICAgICAgIHNjb3JlczogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgX3RoaXMuY3VycmVudExldmVsID0gbmV3IGxldmVsXzEuTGV2ZWwoX3RoaXMubGV2ZWxzWzBdLCBfdGhpcy5vbkVhcm5pbmdQb2ludHMsIF90aGlzLm9uTGV2ZWxDb21wbGV0ZWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteUNhbnZhcycpO1xyXG4gICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAoMCwgZXZlbnRIYW5kbGVyXzEubW91c2VDbGlja0hhbmRsZXIpKHtcclxuICAgICAgICAgICAgICAgIHg6IGV2ZW50Lm9mZnNldFgsXHJcbiAgICAgICAgICAgICAgICB5OiBldmVudC5vZmZzZXRZLFxyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IF90aGlzLnN0YXJ0R2FtZSxcclxuICAgICAgICAgICAgICAgIHJlc3RhcnQ6IF90aGlzLnJlc3RhcnRHYW1lXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBjb250ZXh0XzFbXCJkZWZhdWx0XCJdLmluaXRDb250ZXh0KHtcclxuICAgICAgICAgICAgZ2FtZVN0YXRlOiBnYW1lU3RhdGVUeXBlXzEuR2FtZVN0YXRlLkdBTUVfTk9UX1NUQVJURUQsXHJcbiAgICAgICAgICAgIGxldmVsU3RhdGU6IGxldmVsU3RhdGVUeXBlXzEuTGV2ZWxTdGF0ZS5MRVZFTF9OT1RfU1RBUlRFRCxcclxuICAgICAgICAgICAgZ3JhcGhpY0NvbnRleHQ6IGN0eCxcclxuICAgICAgICAgICAgbGl2ZXM6IGNvbnN0YW50c18xLklOSVRJQUxfTElWRVNfQ09VTlQsXHJcbiAgICAgICAgICAgIHNjb3JlczogMCxcclxuICAgICAgICAgICAgbGV2ZWxJbmRleDogMCxcclxuICAgICAgICAgICAgbGV2ZWxzQ291bnQ6IHRoaXMubGV2ZWxzLmxlbmd0aCxcclxuICAgICAgICAgICAgY2FudmFzOiBjYW52YXNcclxuICAgICAgICB9KTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuICAgICAgICB0aGlzLmN1cnJlbnRMZXZlbCA9IG5ldyBsZXZlbF8xLkxldmVsKHRoaXMubGV2ZWxzWzBdLCB0aGlzLm9uRWFybmluZ1BvaW50cywgdGhpcy5vbkxldmVsQ29tcGxldGVkKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlEb3duSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIEdhbWU7XHJcbn0oKSk7XHJcbnZhciBnYW1lID0gbmV3IEdhbWUoKTtcclxuZXhwb3J0cy5nYW1lID0gZ2FtZTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9