class CanvasScreen {
  constructor($document, $elem) {
    this.elem = $elem[0];
    this.unit = 18;
    this.resizeCanvas($document.width(), $document.height());
  }

  themify(sprite) {
    this.sprite = sprite;
  }

  adjustPixelSize() {
    this.unit = unit;
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
      ctx.globalAlpha = 1;
      ctx.clearRect(x, y, size, size);
      ctx.globalAlpha = rand(0.25, 0.65);
      ctx.drawImage(this.sprite, 0, 150, 150, 150, x, y, size, size);
    });
  }

  set(row, col) {
    this.getContext(row, col, (ctx, x, y, size) => {
      ctx.globalAlpha = 1;
      ctx.clearRect(x, y, size, size);
      ctx.drawImage(this.sprite, 0, 0, 150, 150, x, y, size, size);
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
    super.clear();
    this.$elem.addClass("ready");
  }
}
