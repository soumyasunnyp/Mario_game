var PLAY = 1;
var END = 0;
var gameState = PLAY
var mario, marioAnim, collidedImage;
var bg, ground, bgImage, groundImage, invisibleGround;
var brick, brickImage, brickGroup;
var obstacle, obstacleImage, obstacleGroup;
var gameOver, gameoverImage;
var restart, restartImage;
var score = 0;

function preload() {
  bgImage = loadImage("bg.png");

  marioAnim = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");

  groundImage = loadImage("ground2.png");
  brickImage = loadImage("brick.png");
  obstacleImage = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");

  gameoverImage = loadImage("gameOver.png");
  collidedImage = loadAnimation("collided.png");
  restartImage = loadImage("restart.png");
  ckeckpointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");

}

function setup() {
  createCanvas(500, 300);
  mario = createSprite(50, 200, 10, 20);
  mario.addAnimation("m1", marioAnim);
  mario.addAnimation("collided", collidedImage);
  mario.scale = 1.8;

  ground = createSprite(250, 280, 500, 25);
  ground.addImage("m1", groundImage);


  invisibleGround = createSprite(250, 270, 500, 60);
  invisibleGround.visible = false;
  brickGroup = new Group();
  obstacleGroup = new Group();

  gameOver = createSprite(250, 150, 400, 60);
  gameOver.addImage("go1", gameoverImage);
  gameOver.scale = 0.5;
  restart = createSprite(250, 200, 500, 60);
  restart.addImage("r1", restartImage);

  restart.scale = 0.5;
  //mario.debug = true;
  mario.setCollider("circle", 0, 0, 15);
}

function draw() {
  background(bgImage);
  textSize(18);
  text("score: " + score, 420, 20);

  if (gameState === PLAY) {

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -8;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if (keyDown("space") && mario.y >= 200) {
      mario.velocityY = -13;
      jumpSound.play();
    }

    mario.velocityY = mario.velocityY + 0.8;
    spawnBricks();
    spawnObstacles();
    if (brickGroup.isTouching(mario)) {
      score = score + 1;
     
      brickGroup[0].destroy();
      
    }
    if (score > 0 && score % 10 === 0) {
      ckeckpointSound.play();
    }

  }
  if (obstacleGroup.isTouching(mario)) {
    gameState = END;
    dieSound.play();

  }
  if (gameState === END) {

    ground.velocityX = 0;
    mario.velocityY = 0;

    restart.visible = true;
    gameOver.visible = true;
    mario.changeAnimation("collided", collidedImage);

    obstacleGroup.setLifetimeEach(0);
    brickGroup.setLifetimeEach(0);

    obstacleGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    
    if (mousePressedOver(restart)) {
      reset();
    }

  }
  mario.collide(invisibleGround);
  drawSprites();
}


function spawnBricks() {
  var rand = Math.round(random(75, 175));
  if (frameCount % 30 === 0) {
    brick = createSprite(500, 100, 10, 20);
 
    brick.addImage("b1", brickImage);
    brick.velocityX = -5;
    brick.y = rand;
    brick.scale = 0.8;
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;
    brickGroup.add(brick);
  }
}

function spawnObstacles() {
  if (frameCount % 40 === 0) {
    obstacle = createSprite(500, 220, 10, 20);
    obstacle.addAnimation("o1", obstacleImage);
    obstacle.velocityX = -8;
    obstacle.scale = 0.8;
    obstacle.lifetime = 300;
    obstacleGroup.add(obstacle);
  }
}

function reset() {
  mario.changeAnimation("m1", marioAnim);
  gameState = PLAY;
  score = 0;
  obstacleGroup.destroyEach();
}