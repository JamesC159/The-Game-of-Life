/**
 * Generates a new 2D array with custom width and height
 * @param {Number} rows Number of rows of the new 2D array
 * @param {Number} columns Number of columns of the new 2D array
 */
export const new2DArray = (rows, columns) => {
    let arr = [];
    for (let i = 0; i < columns; i++) {
        let row = [];
        for (let j = 0; j < rows; j++) {
            row.push(0);
        }
        arr.push(row);
    }
    return arr;
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