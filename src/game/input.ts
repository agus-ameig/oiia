export class InputHandler {
  keys: string[] = [];
  controls: string[] = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'a'];

  constructor() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if(this.controls.includes(e.key) && this.keys.indexOf(e.key) < 0) {
        this.keys.push(e.key);
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if(this.controls.includes(e.key)) {
          const index = this.keys.indexOf(e.key);
          if(index > -1) {
            this.keys.splice(index,1);
          }
      }
    })
  }
}
