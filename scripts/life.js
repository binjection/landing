class Screen {
  constructor($document, $elem, unit) {
    this.elem = $elem[0];
    this.unit = unit;
    this.resizeCanvas($document.width(), $document.height());
  }

  resizeCanvas(w, h) {
    this.elem.width  = w;
    this.elem.height = h;
    this.cols = Math.ceil(w / this.unit);
    this.rows = Math.ceil(h / this.unit);
  }

  refresh(diff) {
    for (let change of diff) {
      change({
        populated: (cell) => {
          this.set(cell);
        },
        dead: (cell) => {
          this.del(cell);
        }
      });
    }
  }

  del(cell) {
    this.getContext(cell.x, cell.y, (ctx, x, y, size) => {
      ctx.clearRect(x, y, size, size);
      ctx.fillStyle = "#2D325A";
      ctx.globalAlpha = rand(0.15, 0.45);
      ctx.fillRect(x, y, size, size);
    });
  }

  set(cell) {
    this.getContext(cell.x, cell.y, (ctx, x, y, size) => {
      ctx.clearRect(x, y, size, size);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#56BDA2";
      ctx.fillRect(x, y, size, size);
    });
  }

  getContext(x, y, callback) {
    let ctx = this.elem.getContext("2d");
    callback(ctx, x * this.unit, y * this.unit, this.unit);
  }
}

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
    this.grid = new Grid(screen.rows, screen.cols);
    this.gen = 0;
  }

  insert(cartridge) {
    let diff = [];

    for (let cell of this.grid.data) {
      diff.push(cell.kill());
    }

    cartridge.read((x, y) => {
      this.cellAt(x, y, (cell) => {
        diff.push(cell.populate());
      });
    });

    this.screen.refresh(diff);
  }

  play(delay) {
    setTimeout(() => {
      this.recalculate((diff) => {
        this.screen.refresh(diff);
        this.gen++;
        this.play(delay);
      });
    }, delay);
  }

  cellAt(x, y, callback) {
    this.grid.get(x, y, callback);
  }

  recalculate(callback) {
    var diff = [];

    for (let x = 0; x < this.screen.cols; x++) {
      for (let y = 0; y < this.screen.rows; y++) {
        this.grid.get(x, y, (cell) => {
          this.grid.countAliveNeighboursOf(cell, (aliveNeighbours) => {
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
        });
      }
    }

    callback(diff);
  }
}

class Grid {
  constructor(rows, cols) {
    this.cols = cols;
    this.rows = rows;
    this.data = [];

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.data[y * this.cols + x] = new Cell(x, y, 0);
      }
    }
  }

  get(x, y, callback) {
    if (x < this.cols && y < this.rows && x > 0 && y > 0) {
      callback(this.data[y * this.cols + x]);
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
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
  }

  isAlive() {
    return this.value == 1;
  }

  populate() {
    return (callbacks) => {
      this.value = 1;
      callbacks.populated(this);
    };
  }

  kill() {
    return (callbacks) => {
      this.value = 0;
      callbacks.dead(this);
    };
  }
}
