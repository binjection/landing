class CanvasScreen {
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

  clear() {
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        this.del(col, row);
      }
    }
  }

  del(row, col) {
    this.getContext(row, col, (ctx, x, y, size) => {
      ctx.clearRect(x, y, size, size);
      ctx.fillStyle = "#2D325A";
      ctx.globalAlpha = rand(0.15, 0.45);
      ctx.fillRect(x, y, size, size);
    });
  }

  set(row, col) {
    this.getContext(row, col, (ctx, x, y, size) => {
      ctx.clearRect(x, y, size, size);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#56BDA2";
      ctx.fillRect(x, y, size, size);
    });
  }

  getContext(row, col, callback) {
    let ctx = this.elem.getContext("2d");
    callback(ctx, row * this.unit, col * this.unit, this.unit);
  }
}

class HoveringCanvasScreen extends CanvasScreen {
  constructor($document, $elem, unit) {
    super($document, $elem, unit);
    this.resizeCanvas($document.width() + 200, $document.height() * 2);
    this.$elem = $elem;
  }

  clear() {
    this.$elem.animate({
      left: - 100,
      top: - Math.ceil(this.elem.height / 2),
      opacity: 0,
    }, 0);

    super.clear();

    this.$elem.animate({ opacity: 1 }, { queue: false, duration: 1000 });
    this.$elem.animate({ top: 0 }, 5000);
  }
}
