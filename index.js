const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

ctx.font = "48px serif";
ctx.textAlign = "center";
//ctx.fillStyle = "#ffffff"

const image = new Image();
const background = new Image();
let pattern;
image.addEventListener('load', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = pattern;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.drawImage(image,canvas.width/2 - image.width/2,0);
  ctx.fillStyle = "#ffffff";
  ctx.fillText("O I I A", canvas.width/2, canvas.height/2);
})
background.addEventListener('load', () => {
  pattern = ctx.createPattern(background, "repeat");
})

background.src = `./assets/ground_stone1.png`

let i = 0
setInterval(() => {
  image.src = `./assets/warrior_armed_idle_${i}.png`
  i = (i + 1) % 16;
}, 100);
