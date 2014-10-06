$(function() {

  // define variables
  var Map, keyboard_mappings, player;

  // define and render map
  Map = {
    selector: '#game-map',
    blueprint: [
      [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
      [10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,10, 0, 0, 0, 0, 0, 0, 0,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0,10,10,10, 0, 0, 0, 0, 0,10, 0,10, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
      [10, 0, 0, 0, 0, 0, 0, 0, 10,0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
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
          n++
          $(selector).append('<div class="tile _00' + this + '0"></div>');
        });
        $(selector).append('<div class="defloat"></div>')
      });
    },
    redraw: function() {
      $(this.selector).stop();
      $(this.selector)
        .animate({ 
          top: this.y+'px',
          left: this.x+'px'
        }, 200);
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
      $('#game-fg').append('<div class="player"></div>');
      $('.player').css({
        top: this.y,
        left: this.x
      })
    }
  }
  Player.render();

  // define keyboard mappings
  keyboard_mappings = {
    up: 87,
    right: 68,
    down: 83,
    left: 65
  }

  $(window).keydown(function(e) {
    var key_pressed = parseInt(e.keyCode);
    var new_x, new_y;
    switch(key_pressed) {
      case keyboard_mappings.up:
        new_y = Player.row - 1;
        if (!is_collision(Map, Player.col, new_y)) {
          Player.row -= 1;
          Map.move_down();
        }
        break;
      case keyboard_mappings.right:
        new_x = Player.col + 1;
        if (!is_collision(Map, new_x, Player.row)) {
          Player.col += 1;
          Map.move_left();
        }
        break;
      case keyboard_mappings.down:
        new_y = Player.row + 1;
        if (!is_collision(Map, Player.col, new_y)) {
          Player.row += 1;
          Map.move_up();
        }
        break;
      case keyboard_mappings.left:
        new_x = Player.col - 1;
        if (!is_collision(Map, new_x, Player.row)) {
          Player.col -= 1;
          Map.move_right();
        }
        break;
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
