$(function() {
  var screen = new Screen($(document), $("#screen"), 10);
  screen.drawGrid();
  var life = new Life(screen);
  life.play(100);
});

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

class Screen {
  constructor($document, $elem, unit) {
    this.elem = $elem[0];
    this.unit = unit;
    this.resizeCanvas($document.width(), $document.height());
  }

  resizeCanvas(w, h) {
    this.elem.width  = w;
    this.elem.height = h;
    this.cols = w / this.unit;
    this.rows = h / this.unit;
  }

  drawGrid() {
    for (var x = 0; x < this.cols; x++) {
      for (var y = 0; y < this.rows; y++) {
        this.del(x, y);
      }
    }
  }

  refresh(diff) {

  }

  del(x, y) {
    this.getContext(x, y, (ctx, x, y, size) => {
      ctx.clearRect(x, y, size, size);
      ctx.fillStyle = "#2D325A";
      ctx.globalAlpha = rand(0.5, 0.25);
      ctx.fillRect(x, y, size, size);
    });
  }

  set(x, y) {
    this.getContext(x, y, (ctx, x, y, size) => {
      ctx.clearRect(x, y, size, size);
      ctx.fillStyle = "#56BDA2";
      ctx.globalAlpha = 1;
      ctx.fillRect(x, y, size, size);
    })
  }

  getContext(x, y, callback) {
    var ctx = this.elem.getContext("2d");
    callback(ctx, x * this.unit, y * this.unit, this.unit);
  }
}

class Life {
  constructor(screen) {
    this.screen = screen;
    this.gen = 0;
  }

  play(delay) {
    setTimeout(() => {
      var diff;
      this.screen.refresh(diff);
      this.gen++;
      this.play(delay);
    }, delay);
  }
}
