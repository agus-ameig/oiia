import { Game } from "./game";

export class Map {
  tiles: Tile[];
  game: Game;
  map: number[];

  constructor(game: Game) {
    this.tiles = [];
    for(let i = 0;i<8*8;i++) {
      this.tiles.push(new Tile('map-tiles', i));
    }
    this.map = [
      0,  1,  1,  1,  1,  1,  1,  2,
      8,  9,  9,  9,  9,  9,  9,  10,
      8,  9,  9,  9,  9,  9,  9,  10,
      8,  9,  9,  9,  9,  9,  9,  10,
      8,  9,  9,  9,  9,  9,  9,  10,
      8,  9,  9,  9,  9,  9,  9,  10,
      8,  9,  9,  9,  9,  9,  9,  10,
      16, 17, 17, 17, 17, 17, 17, 18,
    ]
    this.game = game;
  }

  update() {}

  draw(context: CanvasRenderingContext2D, playerX: number, playerY: number, fow: boolean = false) {
    this.map.forEach((tileNumber, index) => {
      context.drawImage(
        ...this.tiles[tileNumber].drawTile(
           (index % 8) * 256,
           Math.floor(index / 8) * 256
        )
      )
    })

    //FoW
    if(fow) {
      context.save();
      const radius = 256;

      // Transparent Circle
      context.beginPath();
      context.rect(0,0,this.game.canvasWidth, this.game.canvasHeight);
      context.arc(playerX, playerY, radius, 0, Math.PI * 2);
      context.clip('evenodd');

      // Draw dark overlay for the entire canvas
      //const gradient = context.createRadialGradient(
      //  playerX, playerY, radius,
      //  playerX, playerY, radius + 256
      //);

      //gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      //gradient.addColorStop(1, 'rgba(0, 0, 0, 0.75)');
      //context.fillStyle = gradient;
      context.fillStyle = 'rgba(0,0,0,0.75)'
      context.fillRect(0, 0, this.game.canvasWidth, this.game.canvasHeight);

      // Reset
      context.restore();
    }
  }
}

type DrawImageParams =
  [HTMLImageElement,
    number, //sx
    number, //sy
    number, //sw
    number, //sh
    number, //cx
    number, //cy
    number, //cw
    number  //ch
]

class Tile {
  tileSheet: HTMLImageElement;
  tileX: number;
  tileY: number;
  tileWidth: number;
  tileLength: number;

  constructor(tileSheet:string, tileNumber: number, tileWidth: number = 256, tileLength: number = 256) {
    this.tileX = (tileNumber % 8) * tileWidth;
    this.tileY = Math.floor(tileNumber / 8) * tileLength;
    this.tileWidth = tileWidth;
    this.tileLength = tileLength;
    this.tileSheet = document.getElementById(tileSheet) as HTMLImageElement;
  }

  drawTile(x:number, y:number): DrawImageParams {
    return [
      this.tileSheet,
      this.tileX, this.tileY, this.tileWidth, this.tileLength,
      x,y, this.tileWidth, this.tileLength,
    ]
  }
}
