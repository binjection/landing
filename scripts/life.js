class Cartridge {
  constructor(points) {
    this.points = points;
  }

  read(callback) {
    for (let point of this.points) {
      let x = point[0];
      let y = point[1];

      callback(x, y);
    }
  }
}

class Life {
  constructor(screen) {
    this.screen = screen;
    this.grid = new Grid(screen);
    this.gen = 0;
  }

  insert(cartridge) {
    this.screen.clear();

    cartridge.read((row, col) => {
      this.grid.get(row, col, (cell) => {
        let change = cell.populate();
        change();
      });
    });
  }

  play(delay) {
    setTimeout(() => {
      this.grid.tick();
      this.gen++;
      this.play(delay);
    }, delay);
  }
}

class Grid {
  constructor(screen) {
    this.cols = screen.cols;
    this.rows = screen.rows;
    this.cells = [];

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.cells[y * this.cols + x] = new Cell(x, y, {
          populated: () => {
            screen.set(x, y);
          },
          dead: () => {
            screen.del(x, y);
          }
        });
      }
    }
  }

  get(x, y, callback) {
    if (x < this.cols && y < this.rows && x > 0 && y > 0) {
      callback(this.cells[y * this.cols + x]);
    }
  }

  tick() {
    let diff = [];

    for (let cell of this.cells) {
      this.countAliveNeighboursOf(cell, (aliveNeighbours) => {
        if (cell.isAlive()) {
          if (aliveNeighbours < 2 || aliveNeighbours > 3) {
            diff.push(cell.kill());
          }
        } else {
          if (aliveNeighbours == 3) {
            diff.push(cell.populate());
          }
        }
      });
    }

    for (let change of diff) {
      change();
    }
  }

  countAliveNeighboursOf(cell, callback) {
    let neighbourCoordinates = orthogonalNeighboursOf(cell.x, cell.y);
    let result = 0;

    for (let point of neighbourCoordinates) {
      let x = point[0];
      let y = point[1];

      this.get(x, y, (neighbourCell) => {
        result += neighbourCell.value;
      });
    }

    callback(result);
  }
}

class Cell {
  constructor(x, y, tangles) {
    this.x = x;
    this.y = y;
    this.tangles = tangles;
    this.value = 0;
  }

  isAlive() {
    return this.value == 1;
  }

  populate() {
    return () => {
      this.value = 1;
      this.tangles.populated();
    };
  }

  kill() {
    return () => {
      this.value = 0;
      this.tangles.dead();
    };
  }
}
