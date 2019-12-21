
import { initCells, createNewCell } from "./gererator";

export const directions = {
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
}

export default function Cells(dim, shouldRestart) {
  let scoreUpdate = 0, didPlayerWin = false, didMoveOrMerge = false, didMoveOrMergeInLoop = false;
  let cells = shouldRestart ? initCells(dim) : JSON.parse(localStorage.getItem("cells")) || initCells(dim);
  localStorage.setItem("cells", JSON.stringify(cells));

  return {
    getCells: () => cells,

    getScoreUpdate: () => scoreUpdate,

    checkPlayerWin: () => didPlayerWin,

    moveCell: function (direction, x, y) {
      const val = cells[x][y];
      cells[x][y] = 0;
      const initX = x, initY = y;

      if (direction === directions.RIGHT) {
        while (y < dim - 1 && isEmpty(cells[x][y + 1])) y++;
      }
      else if (direction === directions.LEFT) {
        while (y > 0 && isEmpty(cells[x][y - 1])) y--;
      }
      else if (direction === directions.UP) {
        while (x > 0 && isEmpty(cells[x - 1][y])) x--;
      }
      else if (direction === directions.DOWN) {
        while (x < dim - 1 && isEmpty(cells[x + 1][y])) x++;
      }

      cells[x][y] = val;

      if (initX !== x || initY !== y) {
        didMoveOrMerge = true;
        didMoveOrMergeInLoop = true;
      }
    },

    moveCells: function (direction, mode) {
      scoreUpdate = 0, didPlayerWin = false, didMoveOrMerge = false;

      if (mode === 'Normal') {
        this.movementNormalMode(direction);
      }
      else if (mode === 'Rapid') {
        this.movementRapidMode(direction);
      }

      return didMoveOrMerge;
    },

    movementNormalMode: function (direction) {
      this.traverseAndActOnCells(direction, this.moveCell);
      this.traverseAndActOnCells(direction, this.mergeCells);
      this.traverseAndActOnCells(direction, this.moveCell);
    },

    movementRapidMode: function (direction) {
      do {
        didMoveOrMergeInLoop = false;
        this.traverseAndActOnCells(direction, this.mergeCells);
        this.traverseAndActOnCells(direction, this.moveCell);
      } while (didMoveOrMergeInLoop);
    },

    traverseAndActOnCells: function (direction, callback) {
      if (direction === directions.DOWN) {
        for (let i = 0; i < dim; i++) {
          for (let j = dim - 2; j >= 0; j--) {
            if (!isEmpty(cells[j][i]) && callback.call(this, direction, j, i)) {
              return true;
            }
          }
        }
      }
      else if (direction === directions.UP) {
        for (let i = 0; i < dim; i++) {
          for (let j = 1; j < dim; j++) {
            if (!isEmpty(cells[j][i]) && callback.call(this, direction, j, i)) {
              return true;
            }
          }
        }
      }
      else if (direction === directions.LEFT) {
        for (let i = 0; i < dim; i++) {
          for (let j = 1; j < dim; j++) {
            if (!isEmpty(cells[i][j]) && callback.call(this, direction, i, j)) {
              return true;
            }
          }
        }
      }
      else if (direction === directions.RIGHT) {
        for (let i = 0; i < dim; i++) {
          for (let j = dim - 2; j >= 0; j--) {
            if (!isEmpty(cells[i][j]) && callback.call(this, direction, i, j)) {
              return true;
            }
          }
        }
      }

      return false;
    },

    getMergeStatus: function (direction, x, y) {
      let val = cells[x][y];

      if (direction === directions.DOWN && x + 1 < dim && cells[x + 1][y] === val) {
        val *= 2;
        x++;
      }
      else if (direction === directions.UP && x - 1 >= 0 && cells[x - 1][y] === val) {
        val *= 2;
        x--;
      }
      else if (direction === directions.LEFT && y - 1 >= 0 && cells[x][y - 1] === val) {
        val *= 2;
        y--;
      }
      else if (direction === directions.RIGHT && y + 1 < dim && cells[x][y + 1] === val) {
        val *= 2;
        y++;
      }

      return { x, y, val };
    },

    mergeCells: function (direction, _x, _y) {
      const { x, y, val } = this.getMergeStatus(direction, _x, _y);
      const isMerged = val !== cells[_x][_y];

      scoreUpdate += isMerged ? val : 0;

      if (isMerged && val % 2048 === 0) didPlayerWin = true;
      if (isMerged) {
        didMoveOrMerge = true;
        didMoveOrMergeInLoop = true;
      }

      cells[_x][_y] = 0;
      cells[x][y] = val;
    },

    canMergeCells: function (direction, _x, _y) {
      const { val } = this.getMergeStatus(direction, _x, _y);
      return val !== cells[_x][_y];
    },

    canMergeAnyCells() {
      for (let direction in directions) {
        const canMerge = this.traverseAndActOnCells(directions[direction], this.canMergeCells);
        if (canMerge) return true;
      }

      return false;
    },

    checkGameOver: function () {
      return !this.hasAnyEmptyCell() && !this.canMergeAnyCells();
    },

    hasAnyEmptyCell: function () {
      for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
          if (cells[i][j] === 0) return true;
        }
      }

      return false;
    },

    getEmptyIndices: function () {
      const emptyIndices = [];
      const dim = cells.length;

      for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
          if (cells[i][j] === 0) emptyIndices.push({ i, j });
        }
      }

      return emptyIndices;
    },

    generate: function () {
      const emptyIndices = this.getEmptyIndices();

      cells = createNewCell(cells, emptyIndices);
      localStorage.setItem("cells", JSON.stringify(cells));
    },
  }
}

export function isEmpty(value) {
  return value === 0;
}