import { Player } from "./player"

const STATES = {
  IDLE: 0,
  WALK: 1,
  ATTACK: 2,
}

const MOVEMENT_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight'
];


export abstract class State {
  state: number;

  constructor(state: number) {
    this.state = state;
  }

  abstract enter(): void;
  abstract handleInput(input: string[], callback?: Function): void;
}


export class Idle extends State {
  player: Player;
  constructor(player: Player) {
    super(STATES.IDLE);
    this.player = player;
  }

  enter(): void {
    this.player.spriteAnimation.sprite = document.getElementById('warrior-armed-idle') as HTMLImageElement;
    this.player.spriteAnimation.maxFrames = 1;
    this.player.spriteAnimation.frameX = 0;
  }

  handleInput(input: string[]): void {
    if(input.includes('a')) {
      this.player.changeState(STATES.ATTACK);
    } else if (input.some((a) => MOVEMENT_KEYS.includes(a))) {
      this.player.changeState(STATES.WALK);
    }
  }
}

export class Walk extends State {
  player: Player;
  constructor(player: Player) {
    super(STATES.WALK);
    this.player = player;
  }

  enter(): void {
    this.player.spriteAnimation.sprite = document.getElementById('warrior-armed-walk') as HTMLImageElement;
    this.player.spriteAnimation.maxFrames = 8;
  }

  handleInput(input: string[]): void {

    if(input.includes('a')) {
      this.player.changeState(STATES.ATTACK);
      return;
    }

    if (input.includes('ArrowUp')) {
      this.player.position.vY = -this.player.position.maxSpeed;
    } else if (input.includes('ArrowDown')) {
      this.player.position.vY = this.player.position.maxSpeed;
    } else {
      this.player.position.vY = 0;
    }

    if (input.includes('ArrowLeft')) {
      this.player.position.vX = -this.player.position.maxSpeed;
    } else if (input.includes('ArrowRight')) {
      this.player.position.vX = this.player.position.maxSpeed;
    } else {
      this.player.position.vX = 0;
    }

    switch(true) {
      case this.player.position.vX > 0 && this.player.position.vY === 0:
        this.player.spriteAnimation.frameY = 6;
        break;
      case this.player.position.vX < 0 && this.player.position.vY === 0:
        this.player.spriteAnimation.frameY = 2;
        break;
      case this.player.position.vX === 0 && this.player.position.vY > 0:
        this.player.spriteAnimation.frameY = 4;
        break;
      case this.player.position.vX === 0 && this.player.position.vY < 0:
        this.player.spriteAnimation.frameY = 0;
        break;
      case this.player.position.vX > 0 && this.player.position.vY > 0:
        this.player.spriteAnimation.frameY = 5;
        break;
      case this.player.position.vX < 0 && this.player.position.vY > 0:
        this.player.spriteAnimation.frameY = 3;
        break;
      case this.player.position.vX > 0 && this.player.position.vY < 0:
        this.player.spriteAnimation.frameY = 7;
        break;
      case this.player.position.vX < 0 && this.player.position.vY < 0:
        this.player.spriteAnimation.frameY = 1;
        break;
    }

    if(input.length === 0) {
      this.player.changeState(STATES.IDLE);
    }
  }
}

export class Attack extends State {
  player: Player;
  sound = document.getElementById('sword') as HTMLAudioElement;
  constructor(player: Player) {
    super(STATES.ATTACK);
    this.player = player;
  }

  enter(): void {
    this.player.spriteAnimation.sprite = document.getElementById('warrior-armed-attack') as HTMLImageElement;
    this.player.spriteAnimation.maxFrames = 8;
    this.player.spriteAnimation.frameX = 0;
    this.player.position.vY = 0;
    this.player.position.vX = 0;
  }

  handleInput(input: string[], atkCallback: Function): void {
    if(this.player.spriteAnimation.frameX === 0) {
      this.sound.currentTime = 0;
      this.sound.play();
    }
    const attackEnded = this.player.spriteAnimation.frameX === (this.player.spriteAnimation.maxFrames - 1);
    if(attackEnded) {
      this.player.attack(atkCallback);
    }
    if( attackEnded && input.some(a => MOVEMENT_KEYS.includes(a))) {
      this.player.changeState(STATES.WALK);
    } else if (attackEnded) {
      this.player.changeState(STATES.IDLE);
    }
  }
}
