export function randInt(from, to) {
  return Math.floor(Math.random() * (to - from)) + from;
}

export function generateInitIndices(degree) {
  let a1 = generateIndices(degree),
    a2 = generateIndices(degree);

  while (a1[0] === a2[0] && a1[1] === a2[1]) {
    a2 = generateIndices(degree);
  }

  return [a1, a2];
}

export const generateIndices = (degree) => [randInt(0, degree), randInt(0, degree)];

export const initCells = (degree) => {
  const cells = [];
  const [a1, a2] = generateInitIndices(degree);// generate initial indices for 2 initial cells

  for (let i = 0; i < degree; i++) {
    cells[i] = [];

    for (let j = 0; j < degree; j++) {
      // check if the current cell index is equal to one of initial cells indices
      if ((i === a1[0] && j === a1[1]) || (i === a2[0] && j === a2[1])) {
        cells[i][j] = 2;
      }
      else {
        cells[i][j] = 0;
      }
    }
  }

  return cells;
}

export function createNewCell(cells, emptyIndices) {
  if (emptyIndices.length > 0) {
    const val = Math.random < 0.1 ? 4 : 2;
    const newCellIdx = emptyIndices[randInt(0, emptyIndices.length - 1)];

    cells[newCellIdx.i][newCellIdx.j] = val;
  }

  return cells;
}