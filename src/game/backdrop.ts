import { Game } from "./game";

export class Backdrop {
  game: Game;
  backdropPattern: CanvasPattern;

  constructor(game: Game, backdropPattern: CanvasPattern) {
    this.game = game;
    this.backdropPattern = backdropPattern;
  }


  update() {

  }

  draw(context: CanvasRenderingContext2D) {
    let oldFillStyle = context.fillStyle;
    context.fillStyle = this.backdropPattern;
    context.fillRect(0,0,this.game.canvasWidth, this.game.canvasHeight);
    context.fillStyle = oldFillStyle;
  }
}
