function randLife(x, y) {
  switch (randInt(0, 9)) {
  case 1, 2, 3, 4, 5, 6, 7:
    return glider(x, y);
  case 8, 9:
    return acorn(x, y);
  default:
    return [];
  }
}

function glider(x, y) {
  return [
    [x, y+2],
    [x+1, y],
    [x+1, y+2],
    [x+2, y+1],
    [x+2, y+2],
  ];
}

function acorn(x, y) {
  return [
    [x, y],
    [x+1, y],
    [x+2, y],
    [x+4, y],
    [x+5, y],
    [x+4, y+1],
    [x+5, y+1],
    [x+5, y+2]
  ];
}
