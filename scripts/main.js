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

  life.init(initials);
  life.play(25);
});
