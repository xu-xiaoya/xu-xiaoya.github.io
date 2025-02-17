//新建一400px宽、490px高的游戏实例
//Game对象用于管理启动、创建子系统、运行逻辑、渲染
//第三个参数表示要使用的渲染器
//第四个参数表示父级DOM元素
var game = new Phaser.Game(400, 490, Phaser.AUTO, "game_div");
var game_state = {};

// Creates a new 'main' state that will contain the game
game_state.main = function () {};
game_state.main.prototype = {
  // 预加载资源
  preload: function () {
    // 游戏背景
    this.game.stage.backgroundColor = "#FFB6C1";
    // 加载bird
    this.game.load.image("bird", "assets/bird1.png");
    // 加载pipe
    this.game.load.image("pipe", "assets/pipe1.png");
  },

  // 显示图像
  create: function () {
    // 展示bird精灵对象
    this.bird = this.game.add.sprite(100, 245, "bird");

    // 添加bird的重力，使其往下落
    this.bird.body.gravity.y = 1000;

    // 调用jump函数当按下空格键
    var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space_key.onDown.add(this.jump, this);

    // group对组中的元素进行统一操作
    this.pipes = game.add.group();
    this.pipes.createMultiple(20, "pipe");

    // 定时器：每1.5s 添加一行管子
    this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

    // 屏幕左上方是计分分数
    this.score = 0;
    var style = { font: "30px Arial", fill: "#ffffff" };
    this.label_score = this.game.add.text(20, 20, "0", style);
  },

  update: function () {
    // 如果bird超过可视界面，调用restart_game函数
    if (this.bird.inWorld == false) this.restart_game();

    //开启物理引擎：overlap无反弹碰撞，如果bird触碰到pipe就restart
    this.game.physics.overlap(
      this.bird,
      this.pipes,
      this.restart_game,
      null,
      this
    );
  },

  // bird jump
  jump: function () {
    //给bird加一个垂直的速度
    this.bird.body.velocity.y = -350;
  },

  // Restart游戏
  restart_game: function () {
    // 移除事件
    this.game.time.events.remove(this.timer);

    // 开始main状态，重新开始游戏
    this.game.state.start("main");
  },

  // 加一个管子
  add_one_pipe: function (x, y) {
    // Get the first dead pipe of our group
    var pipe = this.pipes.getFirstDead();

    // Set the new position of the pipe
    pipe.reset(x, y);

    // 给管子增加水平速度使其往左移动
    pipe.body.velocity.x = -200;

    // 当不可见时删除管子
    pipe.outOfBoundsKill = true;
  },

  //添加一行管子（6个） 且中间随机有一个缺口
  add_row_of_pipes: function () {
    var hole = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < 8; i++)
      if (i != hole && i != hole + 1) this.add_one_pipe(400, i * 60 + 10);

    this.score += 1;
    this.label_score.content = this.score;
  },
};

game.state.add("main", game_state.main);
game.state.start("main");
