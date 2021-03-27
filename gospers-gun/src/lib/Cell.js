class Cell {
  constructor(alive) {
    this.alive = alive;
    this.neighbors = [];
    this.nextState = null;
    this.previousState = null;
  }

  update() {
    this.previousState = this.alive;
    this.alive = this.nextState;
    this.nextState = null;
  }
}

export default Cell;