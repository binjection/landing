$(function() {
  var screen = new Screen($(document), $("#screen"), 15);
  var life = new Life(screen);

  var initials = [
    [10, 3],
    [11, 3],
    [12, 3],
    [20, 8],
    [21, 8],
    [22, 8],
    [22, 7],
    [21, 6]
  ]

  for (var i = 0; i < initials.length; i++) {
    var coordinates = initials[i];
    var x = coordinates[0];
    var y = coordinates[1];

    life.cellAt(x, y, (cell) => { cell.populate() });
  }

  life.init();
  life.play(25);
});
