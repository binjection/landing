$(function() {
  loadSprite("/sprites/cell.svg", (sprite) => {
    var screen = new HoveringCanvasScreen($(document), $("#screen"));
    screen.themify(sprite);

    var life = new Life(screen);
    var cartridge = new Cartridge([
      [10, 3],
      [11, 3],
      [12, 3],
      [20, 8],
      [21, 8],
      [22, 8],
      [22, 7],
      [21, 6],
      [32, 11],
      [33, 11],
      [34, 11],
      [35, 11],
      [32, 12],
    ]);

    setTimeout(() => {
      life.insert(cartridge);
      life.play(100);
    }, 500);
  });
});
