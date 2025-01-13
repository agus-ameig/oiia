import { SpriteAnimation } from "./player";

export class Enemy {
  width: number;
  height: number;
  x: number;
  y: number;
  sprite: HTMLImageElement;
  maxSpeed: number = .05;
  hp = 100;
	spriteAnimation: SpriteAnimation = {
		width: 256,
		height: 256,
		sprite: null,
		fps: 15,
		maxFrames: 8,
		frameX: 0,
		frameY: 0,
		frameTimer: 0,
	};
  constructor(x: number, y: number, width: number = 256, height: number = 256) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.sprite = document.getElementById('enemy') as HTMLImageElement;
  }

  update(deltaTime: number, playerX: number, playerY: number) {
    const directionX = (playerX - this.x);
    const directionY = (playerY - this.y);
    const length = Math.sqrt(directionX * directionX + directionY * directionY);
    this.x = this.x +  directionX / length * this.maxSpeed * deltaTime;
    this.y = this.y +  directionY / length * this.maxSpeed * deltaTime;
		//Animation
		this.spriteAnimation.frameTimer += deltaTime;
		if (this.spriteAnimation.frameTimer > 1000 / this.spriteAnimation.fps) {
			this.spriteAnimation.frameTimer = 0;
			this.spriteAnimation.frameX =
				(this.spriteAnimation.frameX + 1) % this.spriteAnimation.maxFrames;
		}
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.sprite,
    ...this.getSpriteFrame(),
    this.x, this.y, this.width, this.height);
    context.save();
    context.fillStyle = "#ffffff";
    context.fillRect(this.x + this.width/2, this.y + this.height/2, 10, 10);
    context.restore();
  }

	getSpriteFrame(): [number, number, number, number] {
		const x =
			this.spriteAnimation.frameX * this.spriteAnimation.width;
		const y =
			this.spriteAnimation.frameY * this.spriteAnimation.height;
		const width = this.spriteAnimation.width;
		const height = this.spriteAnimation.height;
		return [x, y, width, height];
	}

  damage(dmgAmount: number): boolean {
    this.hp-=dmgAmount;
    if(this.hp <= 0) return false;
    return true;
  }
}


export class EnemyGenerator {
  timer: number = 0;
  maxChance: number = .75;
  chance: number = .000005;
  scalingRate: number = .0000001;
  enemies: Enemy[] = [];
  playerX: number;
  playerY: number;
  currentX: number = 0;
  currentY: number = 0;
  atkRange = 200;
  dmgRange = 100;
  timeSinceLastDmg = 0;
  dmgCooldown = 1000;
  kills = 0;
  orientationMap: Record<string,number[]> = {
    '00':   [0,1,2,3,4,5,6,7],
    '0-1':   [0,1,7],
    '01':  [3,4,5],
    '-10':   [1,2,3],
    '10':  [5,6,7],
    '1-1':   [0,7,6],
    '-1-1':  [0,1,2],
    '-11':  [2,3,4],
    '11': [4,5,6]
  }

  constructor(playerX: number,playerY: number) {
    this.playerX = playerX;
    this.playerY = playerY;
  }

  update(deltaTime: number, playerX: number, playerY: number, callback: Function) {
    this.timer+= deltaTime;
    this.chance+=this.scalingRate*deltaTime;

    if(this.currentX < 2048 - 256 && this.currentY <= 0) {
      this.currentX+= 256;
    } else if(this.currentX >= 2048 - 256 && this.currentY < 2048 - 256){
      this.currentX = 2048 - 256;
      this.currentY += 256;
    } else if(this.currentX >= 0 && this.currentY >= 2048 - 256) {
      this.currentX-= 256;
      this.currentY === 256;
    } else if(this.currentX <= 0 && this.currentY > 0 ) {
      this.currentX = 0
      this.currentY-=256;
    }

    if(Math.random() < this.chance) {
      this.enemies.push(new Enemy(this.currentX, this.currentY))
    }
    this.playerY = playerY;
    this.playerX = playerX;
    this.timeSinceLastDmg +=deltaTime;
    this.enemies.forEach(e => {
      e.update(deltaTime, playerX, playerY);
      const directionX = (e.x + e.width/2) - this.playerX;
      const directionY = (e.y + e.width/2) - this.playerY;
      const length = Math.sqrt(directionX * directionX + directionY * directionY);
      if(length < this.dmgRange && this.timeSinceLastDmg > this.dmgCooldown) {
        this.timeSinceLastDmg = 0
        //Reduce a life
        callback();
      }
    });
  }

  draw(context: CanvasRenderingContext2D) {
    this.enemies.forEach((e) => e.draw(context));
    context.save();
    context.fillStyle = "#ffffff";
    context.fillRect(this.playerX, this.playerY, 10, 10);
    context.restore();
  }

  performAttack(atkDamage: number, x: number, y: number, orientation: number) {
    this.enemies = this.enemies.filter((e) => {
      const directionX = (e.x + e.width/2) - x;
      const directionY = (e.y + e.width/2) - y;
      const length = Math.sqrt(directionX * directionX + directionY * directionY);
      const index = `${Math.round(directionX/length)}${Math.round(directionY/length)}`
      //console.log(directionX/length, directionX/length);
      //console.log(length, index, this.orientationMap[index], orientation);

      if(length < this.atkRange && this.orientationMap[index].includes(orientation)) {
        const alive = e.damage(atkDamage);
        if(!alive) this.kills++;
        return alive;
      }
      return true;
    });
  }
}
