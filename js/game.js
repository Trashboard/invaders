var Numbers = function(val) {
  this.value = val;
  this.canvas = document.createElement("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.digits = new Image();
  var self = this;
  this.digits.onload = function() {
    self.render();
  };
  this.digits.src = "/assets/numbers.png";
  this.digitWidth = 10;
  this.digitHeight = 14;
  this.digitPadding = 5;
}

Numbers.prototype.render = function() {
  if (this.value === void 0) {
    return;
  }

  var str = ("0000" + this.value.toString()).slice(-4)

  this.canvas.width = str.length * (this.digitWidth + this.digitPadding);
  this.canvas.height = this.digitHeight;

  for (var i=0;i<str.length;i++) {
    var digit = parseInt(str.charAt(i), 10);
    this.ctx.drawImage(this.digits, this.digitWidth * digit, 0, this.digitWidth, this.digitHeight, i * (this.digitWidth + this.digitPadding), 0, this.digitWidth, this.digitHeight);
  }
}

Numbers.prototype.set = function(val) {
  this.value = val;
  this.render();
}

Numbers.prototype.get = function() {
  return this.value;
}

Numbers.prototype.incr = function(amount) {
  this.value += amount;
  this.render();
}


var Invaders = function() {
  this.frameWidth = 24;
  this.frameHeight = 16;
  this.padding = 20;
  this.sprite = new Image();
  this.splat = new Image();
  this.splat.src = "/assets/splat.png";
};

Invaders.prototype = {
  load: function(callback) {
    this.sprite.onload = callback;
    this.sprite.src = "/assets/invaders.png";
    this.invaderTypes = [0, 1, 1, 2, 2];
    this.cols = 11;
    this.rows = 5;
    this.width = this.cols * (this.frameWidth + this.padding);
    this.height = this.rows * (this.frameHeight + this.padding);
    this.x = 0;
    this.y = 0;
    this.$el = $(".invaders");
    this.mask = this.createCanvas();
    $(this.mask).addClass("mask");
    this.maskCtx = this.mask.getContext("2d");
    this.$el.append(this.mask);
    this.killList = [];
  },

  drawSprite: function(ctx, x, y, index) {
    ctx.drawImage(this.sprite, this.frameWidth * index, 0, this.frameWidth, this.frameHeight, x, y, this.frameWidth, this.frameHeight);
  },

  hitTest: function(hitX, hitY, frame) {
    var pos = this.getPosition(frame);

    hitX -= pos.x;
    hitY -= pos.y;

    for (var x=0; x < this.cols; x++) {
      for (var y=this.rows - 1; y >= 0; y--) {
        var invaderX = x * (this.frameWidth + this.padding);
        var invaderY = y * (this.frameHeight + this.padding);
        if (hitX > invaderX && hitX < invaderX + this.frameWidth && hitY > invaderY && hitY < invaderY + this.frameHeight) {
          if (!game.grid.visible(x, y)) {
            if (this.killList.indexOf(x + "_" + y) === -1) {
              this.killList.push(x + "_" + y);
              return {
                x: x,
                y: y
              };
            } else {
              return undefined;
            }
          }
          return false;
        }
      }
    }
  },

  createCanvas: function() {
    var canvas = document.createElement("canvas");
    canvas.width = this.cols * (this.frameWidth + this.padding) - this.padding;
    canvas.height = this.rows * (this.frameHeight + this.padding) - this.padding;
    return canvas;
  },

  renderFrame: function(frameNumber) {
    frameNumber || (frameNumber = 0);
    var frame = this.createCanvas();
    var ctx = frame.getContext("2d");

    for (var x=0; x < this.cols; x++) {
      for (var y=0; y < this.rows; y++) {
        this.drawSprite(ctx, x * (this.frameWidth + this.padding), y * (this.frameHeight + this.padding), (this.invaderTypes[y] * 2) + frameNumber);
      }
    }
    return frame;
  },

  kill: function(x, y) {
    this.maskCtx.fillStyle = "#000000";
    this.maskCtx.drawImage(this.splat, x * (this.frameWidth + this.padding), y * (this.frameHeight + this.padding));
    var self = this;
    setTimeout(function() {
      self.maskCtx.fillRect(x * (self.frameWidth + self.padding), y * (self.frameHeight + self.padding), self.frameWidth + 4, self.frameHeight);
    }, 300);
    game.addScore(10);
  },

  startAnimation: function(container) {
    var frame1 = this.renderFrame(0);
    var frame2 = this.renderFrame(1);

    this.$el.css({
      width: frame1.width,
      height: frame1.height
    });

    $(frame2).hide();
    this.$el.append(frame1);
    this.$el.append(frame2);
    setInterval(function() {
      $(".invaders canvas:not(.mask)").toggle();
    }, 500);
  },

  updatePosition: function(frame) {
    var pos = this.getPosition(frame);
    this.x = pos.x | 0;
    this.y = pos.y | 0;

    this.$el.css({
      "top": pos.y + "px",
      "left": pos.x + "px"
    });
  },

  getPosition: function(frame) {
    var framesPerRow = 90;

    var direction = Math.floor(frame / framesPerRow) % 2;
    var hMoveAmount = 140;
    var left = (frame / framesPerRow % 1);
    if (direction === 0) {
      left = 30 + hMoveAmount * left;
    } else {
      left = 30 + hMoveAmount * (1 - left);
    }

    return {
      x: left,
      y: Math.floor(frame / framesPerRow) * 18
    };
  }
};

var Ship = function() {
  this.x = 0;
  this.y = 450;
};

Ship.prototype.position = function(frame) {
  var invadersPosition = game.invaders.getPosition(frame);

  var framesPerRow = 75;
  var direction = Math.floor(frame / framesPerRow) % 2;
  var hMoveAmount = game.invaders.width + 30;
  var left = (frame / framesPerRow % 1);
  if (direction === 0) {
    left = -30 + invadersPosition.x + hMoveAmount * left;
  } else {
    left = -30 + invadersPosition.x + hMoveAmount * (1 - left);
  }
  this.x = left;
  return left;
}

var Bullet = function(x, y, frame) {
  this.x = x;
  this.startY = y;
  this.speed = 15;
  this.startingFrame = frame;
}

Bullet.prototype = {
  getPosition: function(frame) {
    var frameOffset = frame - this.startingFrame;
    return {
      x: this.x,
      y: this.startY - (frameOffset * this.speed)
    }
  },

  updatePosition: function(frame) {
    if (!this.$el) {
      this.$el = $("<div class='bullet'></div>");
      $(".game").append(this.$el);
    }

    if (frame < this.life) {
      var pos = this.getPosition(frame);

      this.$el.css({
        left: pos.x,
        top: pos.y
      });
    } else {
      game.boom(this);
    }
  }
}

var Game = function(frameRate) {
  this.startingFrame = 405;
  this.frameNumber = 0;
  this.ship = new Ship();
  this.bullets = [];
  this.nextValidShot = 0;
  this.invaders = new Invaders();
  this.grid = new Grid();
  this.round = 0;

  this.score = new Numbers(0);
  this.score.render();
  $(this.score.canvas).addClass("score");
  $(".game").append(this.score.canvas);

  this.highscore = new Numbers();
  this.highscore.render();
  $(this.highscore.canvas).addClass("highscore");
  $(".game").append(this.highscore.canvas);

  this.setNumber();

}

Game.prototype.setNumber = function(num) {
  var number = function() {
    return (Math.random() * 10 | 0).toString();
  }

  //var num = number() + number() + number();
  num = ("000" + this.round).slice(-3);
  this.grid.setGrid(num);
  this.highscore.set(parseInt(num, 10));
}

Game.prototype.start = function() {
  var self = this;
  this.loop = setInterval(function() {
    self.setFrame(self.frameNumber + 1);
    game.fire();
  }, 1000 / 25);
}

Game.prototype.addScore = function(points) {
  this.score.incr(points);
}

Game.prototype.boom = function(bullet) {
  this.invaders.kill(bullet.target.x, bullet.target.y);
  this.bullets.splice(this.bullets.indexOf(bullet), 1);
  bullet.$el.remove();
}

Game.prototype.setFrame = function(frame) {
  this.frameNumber = frame;
  this.invaders.updatePosition(this.frameNumber);
  for (var i=0;i<this.bullets.length;i++) {
    this.bullets[i].updatePosition(frame);
  }

  $(".ship").css({
    "left": this.ship.position(this.frameNumber) + "px"
  });
  if (this.invaders.y + this.invaders.height > 450) {
    game.reset();
  }
}


Game.prototype.fire = function() {
  if (this.frameNumber < this.nextValidShot) {
    return;
  }
  var xPos = this.ship.x + 10;
  var yPos = this.ship.y;
  var bullet = new Bullet(xPos, yPos, this.frameNumber);

  for (var i = this.frameNumber; i < this.frameNumber + 30; i++) {
    var bulletPos = bullet.getPosition(i);
    var target = this.invaders.hitTest(bulletPos.x, bulletPos.y, i);
    if (target) {
      bullet.life = i;
      bullet.target = target;
      this.bullets.push(bullet);
      this.nextValidShot = this.frameNumber + 5 + (Math.random() * 8);
      return;
    } else if (target === false) {
      return;
    }
  }

};

Game.prototype.stop = function() {
  clearInterval(this.loop);
}

Game.prototype.reset = function() {
  this.round ++;
  this.stop();
  this.setFrame(this.startingFrame);
  this.score.set(0);
  this.setNumber();
  this.invaders.killList = [];
  this.nextValidShot = 0;
  this.invaders.mask.width = this.invaders.mask.width;
  this.start();
}


$(function() {
  window.game = new Game();

  game.invaders.load(function() {
    game.invaders.startAnimation();
  });

  game.setFrame(game.startingFrame);
  game.start();
  $(window).on("mousemove", function(e) {
    var x = e.pageX;
    var y = e.pageY;
  });

/*
  $(window).on("mousemove", function(e) {
    var frameNumber = e.pageX / 7 | 0;
    game.setFrame(frameNumber);
  });
*/

});
