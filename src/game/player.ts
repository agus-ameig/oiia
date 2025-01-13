import { Game } from "./game";
import { Attack, Idle, State, Walk } from "./state";

type Size = {
	height: number;
	width: number;
  boundX: number;
  boundY: number;
};

type Position = {
	x: number;
	y: number;
	vX: number;
	vY: number;
	maxSpeed: number;
};

export type SpriteAnimation = {
	width: number;
	height: number;
	maxFrames: number;
	fps: number;
	sprite: HTMLImageElement | null;
	frameX: number;
	frameY: number;
	frameTimer: number;
};

export class Player {
	game: Game;
	size: Size;
	position: Position;
	states: State[];
	currentState: State;
  lives = 10;
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

	constructor(game: Game) {
		this.game = game;
		this.size = {
			height: 768,
			width: 768,
      boundX: 512 - 768,
      boundY: 512 - 768
		};
		this.position = {
			x: this.game.canvasWidth/2 - this.size.width/2,
			y: this.game.canvasHeight/2 - this.size.height/2,
			vX: 0,
			vY: 0,
			maxSpeed: .5,
		};
		this.states = [new Idle(this), new Walk(this), new Attack(this)];
		this.currentState = this.states[0];
		this.changeState(0);
	}

	update(deltaTime: number, atkCallback: Function) {
		this.position.x += (this.position.vX * deltaTime);
		this.position.y += (this.position.vY * deltaTime);

		//bounds
		if (this.position.x < this.size.boundX) {
			this.position.x = this.size.boundX;
		}
		if (this.position.x > this.game.canvasWidth - this.size.width - this.size.boundX) {
			this.position.x = this.game.canvasWidth - this.size.width - this.size.boundX;
		}

		if (this.position.y < this.size.boundY) {
			this.position.y = this.size.boundY;
		}
		if (this.position.y > this.game.canvasHeight - this.size.height - this.size.boundY) {
			this.position.y = this.game.canvasHeight - this.size.height - this.size.boundY;
		}

		// Input handling
		this.currentState.handleInput(this.game.input.keys, atkCallback);

		//Animation
		this.spriteAnimation.frameTimer += deltaTime;
		if (this.spriteAnimation.frameTimer > 1000 / this.spriteAnimation.fps) {
			this.spriteAnimation.frameTimer = 0;
			this.spriteAnimation.frameX =
				(this.spriteAnimation.frameX + 1) % this.spriteAnimation.maxFrames;
		}
	}

	draw(context: CanvasRenderingContext2D) {
		if (!this.spriteAnimation.sprite) return;
		context.drawImage(
			this.spriteAnimation.sprite,
			...this.getSpriteFrame(), //source
			this.position.x,
			this.position.y,
			this.size.width,
			this.size.height, //canvas
		);
	}

	changeState(state: number) {
		this.currentState = this.states[state];
		this.currentState.enter();
	}

  attack(callback: Function) {
    const atkDamage = 30 + Math.random()*25;
    callback(atkDamage, this.position.x + (this.size.width/2), this.position.y + this.size.height/2, this.spriteAnimation.frameY);
  }

  reduceHp() {
    this.lives--;
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
}
