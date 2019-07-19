var Player = /** @class */ (function() {
  /**
   * constructor: check validity of parameters and create player
   */
  function Player(_name, _symbol) {
    this._name = _name;
    this._symbol = _symbol;
    if (_name.length < Player.nameMinLen) {
      throw new Error("Player error: The player name cannot be empty!");
    }
    if (this.symbol.length !== Player.symbolLen) {
      throw new Error(
        "Player error: The player symbol length must be " +
          Player.nameMinLen +
          "!"
      );
    }
    if (this.symbol !== "X" && this.symbol !== "O") {
      throw new Error("Player error: The player symbol must be 'x' or 'o'");
    }
  }
  Object.defineProperty(Player.prototype, "name", {
    get: function() {
      return this._name;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Player.prototype, "symbol", {
    get: function() {
      return this._symbol.toUpperCase();
    },
    enumerable: true,
    configurable: true
  });
  Player.symbolLen = 1;
  Player.nameMinLen = 1;
  return Player;
})();
var Board = /** @class */ (function() {
  /**
   * constructor: create board by dimensions by <row,col> , not realy needed but for abstraction
   */
  function Board(_dim) {
    this._dim = _dim;
    this._symbolArray = new Array(this._dim);
    for (var i = 0; i < this._dim; i++) {
      this._symbolArray[i] = new Array(this._dim).fill("");
    }
  }
  Object.defineProperty(Board.prototype, "symbolArray", {
    get: function() {
      return this._symbolArray;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Board.prototype, "rows", {
    get: function() {
      return this._dim;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Board.prototype, "cols", {
    get: function() {
      return this._dim;
    },
    enumerable: true,
    configurable: true
  });
  Board.prototype.print = function() {
    console.log(this._symbolArray);
  };
  Board.prototype.isOccupied = function(row, col) {
    return this._symbolArray[row][col] !== "";
  };
  return Board;
})();
var GameStatus;
(function(GameStatus) {
  GameStatus[(GameStatus["InProgress"] = 0)] = "InProgress";
  GameStatus[(GameStatus["Completed"] = 1)] = "Completed";
})(GameStatus || (GameStatus = {}));
var Game = /** @class */ (function() {
  /**
   * constructor: check validy of cols and rows and create the game object
   */
  function Game(rows, cols) {
    this._players = [];
    this._status = 0;
    this._playerTurn = 0;
    this._history = [];
    if (rows !== cols) {
      throw new Error("Game Error: rows and cols values must be equal!");
    }
    if (rows < Game.minboardSize || cols < Game.minboardSize) {
      throw new Error(
        "Game Error: value of rows and cols must be greater or equal to " +
          Game.minboardSize +
          "!"
      );
    }
    this._board = new Board(rows);
  }
  Object.defineProperty(Game.prototype, "players", {
    get: function() {
      return this._players;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Game.prototype, "board", {
    get: function() {
      return this._board;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Game.prototype, "status", {
    get: function() {
      return this._status;
    },
    enumerable: true,
    configurable: true
  });
  Game.prototype.getHistory = function() {
    var history_copy = this._history.slice();
    return history_copy;
  };
  /**
   * addMoveToHistory: add the last move to the history array
   */
  Game.prototype.addMoveToHistory = function(row, col, playerName, status) {
    var record = playerName + " play at (" + row + "," + col + ")";
    if (status === GameStatus.Completed) {
      record += " and Won !";
    }
    this._history.push(record);
  };
  Game.prototype.printSummary = function() {
    var summary = "Game InProgress";
    if (this.status === GameStatus.Completed) {
      var playerIndex = (this._playerTurn + 1) % 2;
      var winnerPlayer = this.players[playerIndex];
      summary = winnerPlayer.name + " won!";
    }
    console.log(summary);
    console.log(this._history);
  };
  Game.prototype.addPlayer = function(newPlayer) {
    if (this.players.length === Game.numOfPlayer) {
      throw new Error(
        "Game error: The max number alloed of players is " +
          Game.numOfPlayer +
          "!"
      );
    }
    var player =
      this.players.length == 0 ? null : this.players[this.players.length - 1];
    if (
      player &&
      (player.name.toLowerCase() === newPlayer.name.toLowerCase() ||
        player.symbol === newPlayer.symbol)
    ) {
      throw new Error("Game Error: The players details must be distinct!");
    }
    this.players[this.players.length] = newPlayer;
  };
  /**
   *
   * @param row  row selected
   * @param col col selected
   * desc: find 3 same symbols for NXN matrix , change status game if we have a winner.
   * return : status game .
   *
   */
  Game.prototype.updateStatusGame = function(row, col) {
    var cnt = 0;
    var pSymbol = this.players[this._playerTurn].symbol;
    var r, c;
    //check horizontal
    for (c = 0; c < this.board.cols; c++) {
      cnt = this.board.symbolArray[row][c] === pSymbol ? cnt + 1 : 0;
      if (cnt >= 3) {
        return GameStatus.Completed;
      }
    }
    //check vertical
    cnt = 0;
    for (r = 0; r < this.board.rows; r++) {
      cnt = this.board.symbolArray[r][col] === pSymbol ? cnt + 1 : 0;
      if (cnt >= 3) {
        return GameStatus.Completed;
      }
    }
    //check primary diagonal
    cnt = 0;
    for (r = row, c = col; r > 0 && c > 0; c--, r--);
    for (; r < this.board.rows && this.board.cols; r++, c++) {
      cnt = this.board.symbolArray[r][c] === pSymbol ? cnt + 1 : 0;
      if (cnt >= 3) {
        return GameStatus.Completed;
      }
    }
    //check secondary diagonal
    cnt = 0;
    for (r = row, c = col; r > 0 && c < this.board.cols - 1; c++, r--);
    for (; r < this.board.rows && c > 0; r++, c--) {
      cnt = this.board.symbolArray[r][c] === pSymbol ? cnt + 1 : 0;
      if (cnt >= 3) {
        return GameStatus.Completed;
      }
    }
    return GameStatus.InProgress;
  };
  /**
   *
   * @param row  row selected
   * @param col col selected
   * desc: player move logic
   * return : true/false if succeed / fail
   *
   */
  Game.prototype.nextMove = function(row, col) {
    if (
      this.status === GameStatus.Completed ||
      col < 0 ||
      row < 0 ||
      col >= this.board.cols ||
      row >= this.board.rows ||
      this.board.isOccupied(row, col)
    ) {
      return false;
    }
    var curnentPlayer = this.players[this._playerTurn];
    this.board.symbolArray[row][col] = curnentPlayer.symbol;
    this._status = this.updateStatusGame(row, col);
    this.addMoveToHistory(row, col, curnentPlayer.name, this.status);
    this._playerTurn = (this._playerTurn + 1) % 2;
    return true;
  };
  Game.numOfPlayer = 2;
  Game.minboardSize = 3;
  return Game;
})();
//***************************** EX Requirements done *****************************
// ***************************** Code For UI (start) *****************************
// *****************************
var data = {
  playerOneName: "",
  playerTwoName: "",
  boardSize: 0
};
function initGame() {
  var player1Input = document.querySelector("#player1");
  var player2Input = document.querySelector("#player2");
  var boardSizeInput = document.querySelector("#bordSize");
  var ulHistory = document.querySelector("#history");
  if (player1Input && player2Input && boardSizeInput) {
    data.playerOneName = player1Input.value;
    data.playerTwoName = player2Input.value;
    data.boardSize = parseInt(boardSizeInput.value);
    if (data.playerOneName.length === 0 || data.playerTwoName.length === 0) {
      alert("Names are Empty , please enter name");
      return;
    }
  }
  var inputs = document.querySelector(".GameInitialInputs");
  if (inputs) inputs.style.display = "none";
  var ticTacToeBoardElement = document.createElement("div");
  if (ulHistory) {
    ulHistory.className = "history";
    var greet = document.createElement("li");
    greet.innerHTML = "Good luck!";
    ulHistory.appendChild(greet);
  }
  var game = new Game(data.boardSize, data.boardSize);
  game.addPlayer(new Player(data.playerOneName, "X"));
  game.addPlayer(new Player(data.playerTwoName, "O"));
  ticTacToeBoardElement.className = "ticTacToe";
  ticTacToeBoardElement.style.width = 135 * game.board.cols + "px";
  var _loop_1 = function(i) {
    var column = document.createElement("div");
    column.className = "column";
    var _loop_2 = function(j) {
      var span = document.createElement("span");
      span.className = "square";
      span.style.fontSize = 5 - game.board.cols / 1.5 + "em";
      span.onclick = function() {
        game.nextMove(i, j);
        var hist = game.getHistory();
        span.innerText = game.board.symbolArray[i][j];
        if (ulHistory) {
          var li = document.createElement("li");
          li.innerHTML = hist[hist.length - 1];
          ulHistory.appendChild(li);
        }
        if (game.status === GameStatus.Completed) {
          setTimeout(function() {
            var ans = window.confirm("Play again?");
            if (ans) {
              location.reload();
            }
          }, 100);
        }
      };
      column.appendChild(span);
    };
    for (var j = 0; j < game.board.rows; j++) {
      _loop_2(j);
    }
    ticTacToeBoardElement.appendChild(column);
  };
  for (var i = 0; i < game.board.cols; i++) {
    _loop_1(i);
  }
  document.body.appendChild(ticTacToeBoardElement);
}
//*****************************Code For UI (end) *****************************
// ***************************** SIMPLE TEST *****************************
// const game = new Game(3, 3);
// game.addPlayer(new Player("John wick", "X"));
// game.addPlayer(new Player("The rock", "O"));
// console.log(game.nextMove(0, 0));
// console.log(game.nextMove(0, 2));
// console.log(game.nextMove(1, 1));
// console.log(game.nextMove(1, 2));
// console.log(game.nextMove(2, 2));
// console.log(game.nextMove(2, 1));
// game.printSummary();
// const game = new Game(4, 4);
// game.addPlayer(new Player("John wick", "X"));
// game.addPlayer(new Player("The rock", "Y"));
// console.log(game.nextMove(1, 0));
// console.log(game.nextMove(0, 0));
// console.log(game.nextMove(2, 1));
// console.log(game.nextMove(1, 1));
// console.log(game.nextMove(3, 2));
// console.log(game.nextMove(2, 2));
// game.printSummary();
// const game = new Game(5, 5);
// game.addPlayer(new Player("John wick", "X"));
// game.addPlayer(new Player("The rock", "Y"));
// console.log(game.nextMove(3, 1));
// console.log(game.nextMove(3, 2));
// console.log(game.nextMove(2, 2));
// console.log(game.nextMove(2, 3));
// console.log(game.nextMove(1, 3));
// console.log(game.nextMove(1, 4));
// game.printSummary();
