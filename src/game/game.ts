import { Backdrop } from "./backdrop";
import { Enemy, EnemyGenerator } from "./enemy";
import { InputHandler } from "./input";
import { Map } from "./map";
import { Player } from "./player";

export class Game {
	canvasWidth: number;
	canvasHeight: number;
	player: Player;
	input: InputHandler;
	backdrop: Backdrop;
	enemyGenerator: EnemyGenerator;
	map: Map;
	fps: number = 0;

	constructor(
		canvasWidth: number,
		canvasHeight: number,
		backdrop: CanvasPattern,
	) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.player = new Player(this);
		this.input = new InputHandler();
		this.backdrop = new Backdrop(this, backdrop);
		this.enemyGenerator = new EnemyGenerator(
			this.player.position.x,
			this.player.position.y,
		);
		this.map = new Map(this);
	}

	update(deltaTime: number) {
		this.player.update(
			deltaTime,
			this.enemyGenerator.performAttack.bind(this.enemyGenerator),
		);
		this.enemyGenerator.update(
			deltaTime,
			this.player.position.x + this.player.size.width / 2,
			this.player.position.y + this.player.size.height / 2,
      this.player.reduceHp.bind(this.player)
		);
		this.fps = Math.ceil(1000 / deltaTime);
	}

	draw(context: CanvasRenderingContext2D) {
		this.backdrop.draw(context);
		this.map.draw(
			context,
			this.player.position.x + this.player.size.width / 2,
			this.player.position.y + this.player.size.height / 2,
			false,
		);
		this.player.draw(context);
		this.enemyGenerator.draw(context);
		context.fillStyle = "#ffffff";
		context.font = "100px serif";
		context.fillText(`Puntos: ${this.enemyGenerator.kills}`, 100, 100);
		context.fillText(`Vidas: ${this.player.lives}`, 1600, 100);
	}
}
