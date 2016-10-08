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
    for (var i = 0; i < diff.length; i++) {
      var cell = diff[i];
      cell.confirmNextGen();
      cell.isAlive() ? this.set(cell) : this.del(cell);
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
    var ctx = this.elem.getContext("2d");
    callback(ctx, x * this.unit, y * this.unit, this.unit);
  }
}

class Life {
  constructor(screen) {
    this.screen = screen;
    this.grid = new Grid(screen.rows, screen.cols);
    this.gen = 0;
  }

  init(initials) {
    for (var i = 0; i < initials.length; i++) {
      var coordinates = initials[i];
      var x = coordinates[0];
      var y = coordinates[1];

      this.cellAt(x, y, (cell) => { cell.populate() });
    }

    this.screen.refresh(this.grid.data);
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

    for (var x = 0; x < this.screen.cols; x++) {
      for (var y = 0; y < this.screen.rows; y++) {
        this.grid.get(x, y, (cell) => {
          var aliveNeighbours = 0;
          var neighbourCoordinates = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
            [x - 1, y - 1],
            [x - 1, y + 1],
            [x + 1, y - 1],
            [x + 1, y + 1],
          ]

          for (var i = 0; i < 8; i++) {
            var coordinates = neighbourCoordinates[i];
            var nx = coordinates[0];
            var ny = coordinates[1];

            this.grid.get(nx, ny, (neighbourCell) => {
              aliveNeighbours += neighbourCell.value;
            });
          }

          if (cell.isAlive()) {
            if (aliveNeighbours < 2 || aliveNeighbours > 3) {
              cell.kill();
              diff.push(cell);
            }
          } else {
            if (aliveNeighbours == 3) {
              cell.populate();
              diff.push(cell);
            }
          }
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

    for (var x = 0; x < this.cols; x++) {
      for (var y = 0; y < this.rows; y++) {
        this.data[y * this.cols + x] = new Cell(x, y, 0);
      }
    }
  }

  get(x, y, callback) {
    if (x < this.cols && y < this.rows && x > 0 && y > 0) {
      callback(this.data[y * this.cols + x]);
    }
  }
}

class Cell {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.nextGenValue = null;
  }

  isAlive() {
    return this.value == 1;
  }

  populate() {
    this.nextGenValue = 1;
  }

  kill() {
    this.nextGenValue = 0;
  }

  confirmNextGen() {
    this.value = this.nextGenValue;
    this.nextGenValue = null;
  }
}
