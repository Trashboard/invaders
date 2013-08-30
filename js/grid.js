var Grid = function(num) {
  this.numbers = [
    [1, 1, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 1, 1],

    [0, 1, 0,
    1, 1, 0,
    0, 1, 0,
    0, 1, 0,
    1, 1, 1],

    [1, 1, 1,
    0, 0, 1,
    1, 1, 1,
    1, 0, 0,
    1, 1, 1],

    [1, 1, 1,
    0, 0, 1,
    1, 1, 1,
    0, 0, 1,
    1, 1, 1],

    [1, 0, 1,
    1, 0, 1,
    1, 1, 1,
    0, 0, 1,
    0, 0, 1],

    [1, 1, 1,
    1, 0, 0,
    1, 1, 1,
    0, 0, 1,
    1, 1, 1],

    [1, 0, 0,
    1, 0, 0,
    1, 1, 1,
    1, 0, 1,
    1, 1, 1],

    [1, 1, 1,
    0, 0, 1,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0],

    [1, 1, 1,
    1, 0, 1,
    1, 1, 1,
    1, 0, 1,
    1, 1, 1],

    [1, 1, 1,
    1, 0, 1,
    1, 1, 1,
    0, 0, 1,
    0, 0, 1],
    ];

  if (num !== undefined) {
    this.setGrid(num);
  }
};

Grid.prototype.setGrid = function(num) {
  this.grid = [];
  var chars = ("" + num).split("");

  for (var c in chars) {
    var character = this.numbers[parseInt(chars[c])];
    for (var y = 0; y < 5; y ++ ) {
      this.grid[y] || (this.grid[y] = []);
      for (var x = 0; x < 3; x++) {
        this.grid[y].push(character[x + (y* 3)])
      }
      if (this.grid[y].length < 11) {
        this.grid[y].push(0);
      }
    }
  }
}

Grid.prototype.visible = function(x, y) {
  return(this.grid[y][x] === 1);
}

