const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  backgroundColor: '#000',
  physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let snake;
let food;
let snakeLength = 1;
let snakeBody = [];
let direction = {
  x: 20,
  y: 0
};
let gameOver = false;

function preload() {
  this.load.image('food', 'bomb.png'); // Замените на свою картинку еды
  this.load.image('body', 'bomb.png'); // Замените на свою картинку еды
}

function create() {
  console.log(this);
  snake = this.physics.add.group();
  snake.create(200, 200, 'body');
  food = this.physics.add.image(340, 200, 'food');
  //food = this.physics.add.image(Phaser.Math.Between(0, 19) * 20, Phaser.Math.Between(0, 19) * 20, 'food');

  this.physics.add.overlap(snake, food, eatFood, null, this);

  // Запускаем автоматическое движение змейки
  this.time.addEvent({
    delay: 500,
    callback: moveSnake,
    callbackScope: this,
    loop: true
  });

  // Создаем кнопки для управления
  createControlButtons();
}

function update() {
  if (gameOver) return;
}

function createControlButtons() {
  const upButton = document.createElement('button');
  upButton.innerText = '↑';
  upButton.onclick = () => changeDirection(0, -20);
  document.body.appendChild(upButton);

  const downButton = document.createElement('button');
  downButton.innerText = '↓';
  downButton.onclick = () => changeDirection(0, 20);
  document.body.appendChild(downButton);

  const leftButton = document.createElement('button');
  leftButton.innerText = '←';
  leftButton.onclick = () => changeDirection(-20, 0);
  document.body.appendChild(leftButton);

  const rightButton = document.createElement('button');
  rightButton.innerText = '→';
  rightButton.onclick = () => changeDirection(20, 0);
  document.body.appendChild(rightButton);
}

function changeDirection(x, y) {
  // Изменяем направление, если оно не противоположное
  if ((x === -20 && direction.x !== 20) || (x === 20 && direction.x !== -20) ||
    (y === -20 && direction.y !== 20) || (y === 20 && direction.y !== -20)) {
    direction = {
      x: x,
      y: y
    };
  }
}

function moveSnake() {
  const head = snake.getChildren()[snake.getChildren().length-1];
  const newHead = this.physics.add.image(head.x + direction.x, head.y + direction.y, 'body');

  snake.add(newHead);
  snakeBody.push(newHead);

  if (snakeBody.length > snakeLength) {
    const tail = snakeBody.shift();
    tail.destroy();
  }

  // Проверка на столкновение со стенами или с самой собой
  
  if (newHead.x < 0 || newHead.x >= 400 || newHead.y < 0 || newHead.y >= 400 /* || checkCollision(newHead)*/) {
    gameOver = true;
    alert('Game Over!');
    this.scene.restart();
  }
}

function checkCollision(head) {
  for (let i = 1; i < snakeBody.length; i++) {
    if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
      return true;
    }
  }
  return false;
}

function eatFood(food, snake) {
  food.x = Phaser.Math.Between(0, 19) * 20;
  food.y = Phaser.Math.Between(0, 19) * 20;
  snakeLength++;
}