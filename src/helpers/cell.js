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

  const isCombined = combineCells(direction, cells, x, y, val);

  if (!isCombined) cells[x][y] = val;
}

export function moveCells(direction, cells) {
  const dim = cells.length;

  if (direction === directions.DOWN) {
    for (let i = 0; i < dim; i++) {
      for (let j = dim - 1; j >= 0; j--) {
        if (!isEmpty(cells[j][i])) {
          moveCell(direction, cells, j, i);
        }
      }
    }
  }
  else if (direction === directions.UP) {
    for (let i = 0; i < dim; i++) {
      for (let j = 1; j < dim; j++) {
        if (!isEmpty(cells[j][i])) {
          moveCell(direction, cells, j, i);
        }
      }
    }
  }
  else if (direction === directions.LEFT) {
    for (let i = 0; i < dim; i++) {
      for (let j = 1; j < dim; j++) {
        if (!isEmpty(cells[i][j])) {
          moveCell(direction, cells, i, j);
        }
      }
    }
  }
  else if (direction === directions.RIGHT) {
    for (let i = 0; i < dim; i++) {
      for (let j = dim - 1; j >= 0; j--) {
        if (!isEmpty(cells[i][j])) {
          moveCell(direction, cells, i, j);
        }
      }
    }
  }

  return cells;
}

export function combineCells(direction, cells, x, y, val) {
  const dim = cells.length;

  if (direction === directions.DOWN && x + 1 < dim && cells[x + 1][y] === val) {
    cells[x + 1][y] = val * 2;
    return true;
  }
  else if (direction === directions.UP && x - 1 >= 0 && cells[x - 1][y] === val) {
    cells[x - 1][y] = val * 2;
    return true;
  }
  else if (direction === directions.LEFT && y - 1 >= 0 && cells[x][y - 1] === val) {
    cells[x][y - 1] = val * 2;
    return true;
  }
  else if (direction === directions.RIGHT && y + 1 < dim && cells[x][y + 1] === val) {
    cells[x][y + 1] = val * 2;
    return true;
  }
}

export function isEmpty(value) {
  return value === 0;
}