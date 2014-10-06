$(function() {

  // define variables
  var Map, keyboard_mappings, player, soundtrack;
  window.player_sprite = '/images/player/sprite_down_0010.png';

  // define and render map
  Map = {
    selector: '#game-map',
    blueprint: [
      [11,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
      [10, 0,10,11,11,11,10, 0,10, 0, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,10,11, 0, 0,10, 0,11, 0,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,12,10,13, 0,12, 0,12, 0,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0,10, 0,13, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,10,10,10,10,10, 0,10, 0,10, 0,13,12,12,12, 0, 0, 0, 0, 0,10],
      [13, 0, 0, 0, 0, 0, 0, 0,10, 0,10, 0,12, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10,10,10,10,13,10,10, 0,10, 0,10, 0,12, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0,12, 0,10, 0,10, 0,13,12,12,12, 0, 0, 0, 0, 0,10],
      [10, 0,10,13,10, 0,10, 0,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,10, 0,10, 0,10, 0,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,10, 0,10, 0,10, 0,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,10, 0,10, 0,12, 0,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,10, 0,10, 0, 0, 0,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,10, 0,10,10,10,13,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,13,13,13,13,13,13,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
    ],
    cell_width: 120,
    cell_height: 120,
    num_cols: 16,
    num_rows: 6,
    x: 0,
    y: 0,
    get_width: function()  { return (this.cell_width * this.num_cols) },
    get_height: function() { return (this.cell_height * this.num_rows) },
    move_up: function()    { this.y -= this.cell_height; },
    move_right: function() { this.x += this.cell_width; },
    move_down: function()  { this.y += this.cell_height; },
    move_left: function()  { this.x -= this.cell_width; },
    render: function() {
      var n = 0;
      this.num_cols = this.blueprint[0].length;
      this.num_rows = this.blueprint.length;
      var selector = this.selector;
      var sample_tile = $('.tile').first();
      $.each(this.blueprint, function(row_index) {
        var row = this;
        $.each(row, function(col_index) {
          if (this > 9) {
            $(selector).append('<div class="tile _00' + this + '0"></div>');
          } else {
            var r = Math.floor(Math.random() * 32) + 1;
            if (r < 10) r = '0' + r;
            $(selector).append('<div class="tile" style="background: transparent url(/images/floors/stone_0' + r + '0.png) 0 0 no-repeat"></div>');
          }
        });
        $(selector).append('<div class="defloat"></div>')
      });
    },
    redraw: function() {
      $(this.selector).stop();
      $(this.selector).animate({ 
        top: this.y+'px',
        left: this.x+'px'
      }, 100);
    }
  }
  Map.render();

  Player = {
    tile_width: 120,
    tile_height: 120,
    x: Map.tile_width * 4,
    y: Map.tile_height * 2,
    col: 4,
    row: 2,
    background_color: '#bab',
    render: function() {
      $('#game-fg').append('<div class="player"><img src="' + window.player_sprite + '" /></div>');
      $('.player').css({
        top: this.y,
        left: this.x
      })
    },
    redraw: function() {
      $('.player img').attr('src',window.player_sprite);
    }
  }
  Player.render();

  soundtrack = new Howl({
    urls: ['/sounds/sndtrk_catacombs.ogg'],
    autoplay: true,
    loop: true,
  });

  // define keyboard mappings
  keyboard_mappings = {
    up: 87,
    right: 68,
    down: 83,
    left: 65,
    attack: 75
  }

  $(window).keydown(function(e) {
    var key_pressed = parseInt(e.keyCode);
    console.log(key_pressed);
    var new_x, new_y;
    switch(key_pressed) {
      case keyboard_mappings.up:
        set_sprite('up');
        new_y = Player.row - 1;
        if (!is_collision(Map, Player.col, new_y)) {
          Player.row -= 1;
          Map.move_down();
        }
        Player.redraw();
        break;
      case keyboard_mappings.right:
        set_sprite('right');
        new_x = Player.col + 1;
        if (!is_collision(Map, new_x, Player.row)) {
          Player.col += 1;
          Map.move_left();
        }
        Player.redraw();
        break;
      case keyboard_mappings.down:
        set_sprite('down');
        new_y = Player.row + 1;
        if (!is_collision(Map, Player.col, new_y)) {
          Player.row += 1;
          Map.move_up();
        }
        Player.redraw();
        break;
      case keyboard_mappings.left:
        set_sprite('left');
        new_x = Player.col - 1;
        if (!is_collision(Map, new_x, Player.row)) {
          Player.col -= 1;
          Map.move_right();
        }
        Player.redraw();
        break;
      case keyboard_mappings.attack:
        attack();
      default:
        // do nothing
    }
    Map.redraw();
  })
});

function is_collision(Map,col,row) {
  var cell_value = Map.blueprint[row][col];
  if (cell_value > 9) return true;
  return false;
}

function set_sprite(direction) {
  window.player_sprite = '/images/player/sprite_' + direction + '_0010.png';
}

function attack() {
  swipe = new Howl({
    urls: [ '/sounds/ssword_swoosh.mp3' ],
    autoplay: true,
    loop: false
  });
}
