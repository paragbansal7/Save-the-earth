var bg;
var earth,earthImg;
var earthLife = 500;
var helicopter,heliImg,heliAnim;
var heliLife = 100;
var enemy,enemyImg,enemyAnim,grp;
var countEnemy=0;
var bullet,bulletImg;
var bulletsLeft=50;
var enemyBullet,enemyBulletImg;
var gameState = "Start";

function preload(){
  bg = loadImage("img/bg.png");
  earthImg = loadImage("img/earth.jpg");
  heliImg = loadAnimation("img/h1.png")
  heliAnim = loadAnimation("img/h1.png","img/h2.png","img/h3.png","img/h4.png");
  enemyAnim = loadAnimation("img/eh1.png","img/eh2.png","img/eh3.png");
  enemyImg = loadAnimation("img/eh1.png");
  enemyBulletImg = loadImage("img/enemyBullet.jpg");
  bulletImg = loadImage("img/bullet.png");
}

function setup() {
  createCanvas(displayWidth,displayHeight);

  earth = createSprite(width-130,height/2+50);
  earth.addImage(earthImg);
  earth.scale = 0.5;

  helicopter = createSprite(width-400,height/2);
  helicopter.addAnimation("img",heliImg);
  helicopter.addAnimation("playing",heliAnim);
  helicopter.scale = 0.5;

  grp = createGroup();

}

function draw() {
  background(bg);

  if(gameState === "Start"){

    helicopter.changeAnimation("img",heliImg);


    textSize(40);
    fill("blue")
    text("SAVE THE EARTH",width/2-160,50);

    var start = createButton("Start");
    start.position(100,100);
    start.style('font-size','30px')
    start.style('background','yellow');

    var info = createButton("How To Play?");
    info.position(100,150);
    info.style('font-size','30px')
    info.style('background','yellow');

    start.mousePressed(() => {
      gameState = "Play";
      start.hide();
      info.hide();
    })

    info.mousePressed(() => {
      ret = createButton("Return");
      start.hide();
      info.hide();
      text("This is a game for pc users. You can also play the game in laptop.It is a single player game.In the game some opposition helicopters would try to destroy the earth. And you would be the one to save it.To start the game pres the spacebar. Then you can control your helicopter by the arrow keys and if u wanna fire then press space bar.",10,100)
    })
  }

  if(gameState === "Play"){

    helicopter.changeAnimation("playing",heliAnim);

  textSize(20);
  fill("white");
  text("Helicopter's Health left : " ,width-300,20);

  if(heliLife>50){
    fill("green");
    text(heliLife,width-80,20)
  }
  
  if(heliLife>20 && heliLife<50){
    fill("yellow");
    text(heliLife,width-80,20)
  }

  if(heliLife<20){
    fill("red");
    text(heliLife,width-80,20)
  }
  fill("white");
  text("Earth's Life left : ",width-300,40);

  if(earthLife>300){
    fill("green");
    text(earthLife,width-80,40)
  }
  
  if(earthLife>20 && earthLife<50){
    fill("yellow");
    text(earthLife,width-80,40)
  }

  if(earthLife<20){
    fill("red");
    text(earthLife,width-80,40)
  }

  fill("white");
  text("Bullets Left :" ,width-300,60)

  if(bulletsLeft>30){
    fill("green");
    text(bulletsLeft,width-80,60);
  }

  if(bulletsLeft>10 && bulletsLeft<30){
    fill("yellow");
    text(bulletsLeft,width-80,60);
  }

  if(bulletsLeft<10){
    fill("red");
    text(bulletsLeft,width-80,60);
  }

  if(bulletsLeft === 0){
    gameState="End"
  }



  if(keyIsDown(UP_ARROW)){
    helicopter.y -= 4;
  }

  if(keyIsDown(DOWN_ARROW)){
    helicopter.y += 4;
  }

  if(keyIsDown(RIGHT_ARROW)){
    helicopter.x += 4;
  }

  if(keyIsDown(LEFT_ARROW)){
    helicopter.x -= 4;
  }

  if(keyDown("SPACE") && frameCount%2===0){
  bullet = createSprite(helicopter.x,helicopter.y);
  bullet.addImage(bulletImg);
  bullet.scale = 0.1;
  bullet.velocityX = -30;
  bulletsLeft-=1;
  }

  spawnEnemies();
  //remove();



}

if(gameState === "End"){
 // helicopter.changeAnimation("img",heliImg);
  //enemy.changeAnimation("img",enemyImg);
  grp.setVelocityXEach(0);
  grp.setLifetimeEach(-1);


  fill("red");
  textSize(30)
  text("GAME OVER", width/2-80,height/2-100);

  restart = createButton('Restart');
  restart.position(width/2-50,height/2-50);
  restart.style('font-size','30px');

  if(frameCount%7===0){
  restart.style('background','yellow')
  } else if(frameCount&6===0){
    restart.style('background','blue')
  }
  
  restart.mousePressed( () => {
    gameState = "Start"
    restart.hide();
    enemy.destroy();
  })

}
  
  drawSprites();
}

function spawnEnemies(){

  var rand = Math.round(random(50,width-50));

  if(frameCount%100 === 0){
    enemy = createSprite(100,rand);
    countEnemy+=1;
    enemy.scale = 0.5;
    enemy.velocityX = 3;
    enemy.lifetime = width/enemy.velocityX;

    if(enemy.x===100){
      enemyBullet= createSprite(enemy.x+50,enemy.y);
      enemyBullet.addImage(enemyBulletImg);
      enemyBullet.scale = 0.2;
      enemyBullet.velocityX = 15;
      enemyBullet.lifetime = width/enemyBullet.velocityX
    }

    grp.add(enemy);

    enemy.addAnimation("img",enemyImg);
    enemy.addAnimation("alive",enemyAnim);

    if(gameState === "Play"){
      enemy.changeAnimation("alive",enemyAnim);
    } else if(gameState === "End"){
      enemy.changeAnimation("img",enemyImg);
  }

  }

}

function remove(){
   if(bullet.isTouching(enemy)){
    enemy.destroy();
    bullet.destroy();
   }
    
   if(bullet.isTouching(enemyBullet)){
    enemyBullet.destroy();
    bullet.destroy();
   }

  if(enemyBullet.isTouching(helicopter)){
    enemyBullet.destroy();
    heliLife -= 5;
  }

  if(enemyBullet.isTouching(earth)){
    enemyBullet.destroy();
    earthLife -= 10;
  }

  if(helicopter.isTouching(enemy)){
    enemy.destroy();
    heliLife -= 10;
  }

  if(enemy.isTouching(earth)){
    enemy.destroy();
    earthLife -=50;
  }







}