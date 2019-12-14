let scoreUpdate = 0, didPlayerWin = false;

export const directions = {
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
}

export function moveCell(direction, cells, x, y) {
  const dim = cells.length;
  const val = cells[x][y];
  cells[x][y] = 0;

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
}

export function moveCells(direction, cells) {
  scoreUpdate = 0, didPlayerWin = false;
  traverseAndActOnCells(direction, cells, moveCell);
  traverseAndActOnCells(direction, cells, mergeCells);
  traverseAndActOnCells(direction, cells, moveCell);
  return { cells, scoreUpdate, didPlayerWin };
}

export function traverseAndActOnCells(direction, cells, callback) {
  const dim = cells.length;

  if (direction === directions.DOWN) {
    for (let i = 0; i < dim; i++) {
      for (let j = dim - 1; j >= 0; j--) {
        if (!isEmpty(cells[j][i]) && callback(direction, cells, j, i)) {
          return true;
        }
      }
    }
  }
  else if (direction === directions.UP) {
    for (let i = 0; i < dim; i++) {
      for (let j = 1; j < dim; j++) {
        if (!isEmpty(cells[j][i]) && callback(direction, cells, j, i)) {
          return true;
        }
      }
    }
  }
  else if (direction === directions.LEFT) {
    for (let i = 0; i < dim; i++) {
      for (let j = 1; j < dim; j++) {
        if (!isEmpty(cells[i][j]) && callback(direction, cells, i, j)) {
          return true;
        }
      }
    }
  }
  else if (direction === directions.RIGHT) {
    for (let i = 0; i < dim; i++) {
      for (let j = dim - 1; j >= 0; j--) {
        if (!isEmpty(cells[i][j]) && callback(direction, cells, i, j)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function getMergeStatus(direction, cells, x, y) {
  const dim = cells.length;
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
}

export function mergeCells(direction, cells, _x, _y) {
  const { x, y, val } = getMergeStatus(direction, cells, _x, _y);
  const isMerged = val !== cells[_x][_y];

  scoreUpdate += isMerged ? val : 0;

  if (isMerged && val % 2048 === 0) didPlayerWin = true;

  cells[_x][_y] = 0;
  cells[x][y] = val;
}

export function canMergeCells(direction, cells, _x, _y) {
  const { val } = getMergeStatus(direction, cells, _x, _y);
  return val !== cells[_x][_y];
}

export function canMergeAnyCells(cells) {
  for (let direction in directions) {
    const canMerge = traverseAndActOnCells(directions[direction], cells, canMergeCells);
    if (canMerge) return true;
  }

  return false;
}

export function isEmpty(value) {
  return value === 0;
}