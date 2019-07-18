class Player {
  private static readonly symbolLen = 1;
  private static readonly nameMinLen = 1;
  constructor(private _name: string, private _symbol: string) {
    if (_name.length < Player.nameMinLen) {
      throw new Error("Player error: The player name cannot be empty!");
    }
    if (this.symbol.length !== Player.symbolLen) {
      throw new Error(
        `Player error: The player symbol length must be ${Player.nameMinLen}!`
      );
    }
    if (this.symbol !== "X" && this.symbol !== "Y") {
      throw new Error(`Player error: The player symbol must be 'x' or 'y'`);
    }
  }

  get name(): string {
    return this._name;
  }

  get symbol(): string {
    return this._symbol.toUpperCase();
  }
}
class Square extends HTMLSpanElement {
  constructor(
    private _symbol: string,
    private _cb: Function,
    private _dimension: number,
    private _rowPos: number,
    private _colPos: number
  ) {
    super();
    this.onclick = () => {
      this.cb(this._rowPos, this._colPos);
    };
  }

  get symbol(): string {
    return this._symbol;
  }
  get cb(): Function {
    return this._cb;
  }
  get dimension(): number {
    return this._dimension;
  }
}
class Board {
  private _symbolArray: string[][];
  constructor(private _rows: number, private _cols: number) {
    this._symbolArray = new Array(this._rows);
    for (let i = 0; i < this._symbolArray.length; i++) {
      this._symbolArray[i] = new Array(this._cols).fill("");
    }
  }

  get symbolArray(): string[][] {
    return this._symbolArray;
  }

  get rows(): number {
    return this._rows;
  }
  get cols(): number {
    return this._cols;
  }
  print(): void {
    console.log(this._symbolArray);
  }

  isOccupied(row: number, col: number): boolean {
    return this._symbolArray[row][col] !== "";
  }
}
enum GameStatus {
  InProgress,
  Completed
}

class Game {
  private static readonly numOfPlayer = 2;
  private static readonly minboardSize = 3;

  private _board: Board;
  private _players = [] as Player[];
  private _status = 0 as GameStatus;
  private _playerTurn = 0;
  private _history = [] as string[];

  constructor(rows: number, cols: number) {
    if (rows !== cols) {
      throw new Error("Game Error: rows and cols values must be equal!");
    }
    if (rows < Game.minboardSize || cols < Game.minboardSize) {
      throw new Error(
        `Game Error: value of rows and cols must be greater or equal to ${
          Game.minboardSize
        }!`
      );
    }
    this._board = new Board(rows, cols);
  }

  get players(): Player[] {
    return this._players;
  }
  get board() {
    return this._board;
  }
  get status(): number {
    return this._status;
  }

  addMoveToHistory(
    row: number,
    col: number,
    playerName: string,
    status: GameStatus
  ): void {
    let record = `${playerName} play at (${row},${col})`;
    if (status === GameStatus.Completed) {
      record += " and Won !";
    }
    this._history.push(record);
  }
  printSummary(): void {
    let summary = "Game InProgress";
    if (this.status === GameStatus.Completed) {
      const playerIndex = (this._playerTurn + 1) % 2;
      const winnerPlayer = this.players[playerIndex];
      summary = `${winnerPlayer.name} won!`;
    }
    console.log(summary);
    console.log(this._history);
  }

  addPlayer(newPlayer: Player): void {
    if (this.players.length === Game.numOfPlayer) {
      throw new Error(
        `Game error: The max number alloed of players is ${Game.numOfPlayer}!`
      );
    }
    const player =
      this.players.length == 0 ? null : this.players[this.players.length - 1];

    if (
      player &&
      (player.name.toLowerCase() === newPlayer.name.toLowerCase() ||
        player.symbol === newPlayer.symbol)
    ) {
      throw new Error("Game Error: The players details must be distinct!");
    }
    this.players[this.players.length] = newPlayer;
  }

  private updateStatusGame(row: number, col: number): GameStatus {
    let cnt = 0;
    const pSymbol = this.players[this._playerTurn].symbol;
    let r, c;
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
  }

  nextMove(row: number, col: number): boolean {
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
    const curnentPlayer = this.players[this._playerTurn];
    this.board.symbolArray[row][col] = curnentPlayer.symbol;
    this._status = this.updateStatusGame(row, col);
    this.addMoveToHistory(row, col, curnentPlayer.name, this.status);
    this._playerTurn = (this._playerTurn + 1) % 2;
    return true;
  }
}
// const game = new Game(3, 3);
// game.addPlayer(new Player("John wick", "X"));
// game.addPlayer(new Player("The rock", "Y"));
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

const game = new Game(4, 4);
const ticTacToeBoardElement = document.createElement("div");
ticTacToeBoardElement.className = "ticTacToe";
ticTacToeBoardElement.style.width = 135 * game.board.cols + "";
document.body.appendChild(ticTacToeBoardElement);
for (let i = 0; i < game.board.cols; i++) {
  const column = document.createElement("div");
  column.className = "column";
  for (let j = 0; j < game.board.rows; j++) {
    const span = document.createElement("span");
    span.className = "square";
    column.appendChild(span);
  }
  ticTacToeBoardElement.appendChild(column);
}
