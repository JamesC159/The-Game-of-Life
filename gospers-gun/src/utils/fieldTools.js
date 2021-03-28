import Cell from "../lib/Cell";

/**
 * Generates a new 2D array filled with Cells
 * @param {Number} rows Number of rows of the new 2D array
 * @param {Number} columns Number of columns of the new 2D array
 * @param {Number} oldFieldState The dead/alive state of a previous game field
 * @returns New game field with cells initialized to dead, or a previous field state
 */
export const newField = (rows, columns, oldFieldState = null) => {
  let arr = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      oldFieldState ? row.push(new Cell(oldFieldState[i][j])) : row.push(new Cell(0));
    }
    arr.push(row);
  }
  return arr;
}

/**
 * Generates an array of Cell states from the game field
 * @param {number} rows Number of rows in the game field
 * @param {number} columns Number of columns in the game field
 * @param {[]} field The game field
 * @returns Array of Cell states
 */
export const getFieldState = (rows, columns, field) => {
  let stateField = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      row.push(field[i][j].alive);
    }
    stateField.push(row);
  }
  return stateField;
}

/**
 * Calculates toroidal array indecies
 * @param {*} index The array index
 * @param {*} length The size of the array dimension
 */
export const wrapAround = (index, length) => {
  index = Number(index);
  length = Number(length);
  if (index === -1) {
     return length - 1;
  } else if (index === length) {
    return 0;
  } else {
    return index;
  }
}
