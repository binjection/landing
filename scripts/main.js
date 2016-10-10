$(function() {
  loadSprite("/sprites/cell.svg", (sprite) => {
    var screen = new HoveringCanvasScreen($(document), $("#screen"));
    screen.themify(sprite);

    var life = new Life(screen);
    var cartridge = new RandomCartridge(50, screen.rows / 2, screen.cols / 2);

    setTimeout(() => {
      life.insert(cartridge);
      life.play(250);
    }, 500);
  });
});
