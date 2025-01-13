import { Game } from "./game/game";

// Startup
window.addEventListener("load", () => {
	const canvas = document.getElementById("my-canvas") as HTMLCanvasElement;
	canvas.style.display = "none";

	const playBtn = document.getElementById("play-button") as HTMLButtonElement;
	playBtn.onclick = () => startNewGame(0, canvas);

	const hs = localStorage.getItem("hs");
	const highscore = document.getElementById("highscore") as HTMLDivElement;
	highscore.textContent = `Highscore: ${hs}`;

	//AI Slop for mobile
	const buttons = document.querySelectorAll(".d-pad-button, .attack-button");
	// Simulate keypress events
	function simulateKey(key: string, type: string) {
		const event = new KeyboardEvent(type, {
			key: key,
			code: key,
			bubbles: true,
		});
		document.dispatchEvent(event);
	}

	// Handle both touch and mouse events
	function handleStart(e: TouchEvent | MouseEvent) {
		console.log(e);
		const button = e.target as HTMLButtonElement;
		if (
			button.classList.contains("d-pad-button") ||
			button.classList.contains("attack-button")
		) {
			button.classList.add("pressed");
			simulateKey(button.dataset.key!, "keydown");
		}
	}

	function handleEnd(e: TouchEvent | MouseEvent) {
		const button = e.target as HTMLButtonElement;
		if (
			button.classList.contains("d-pad-button") ||
			button.classList.contains("attack-button")
		) {
			button.classList.remove("pressed");
			simulateKey(button.dataset.key!, "keyup");
		}
	}

	// Add touch events
	buttons.forEach((el) => {
		const button = el as HTMLButtonElement;
		button.addEventListener("touchstart", handleStart, false);
		button.addEventListener("touchend", handleEnd, false);
		// Also add mouse events for testing on desktop
		button.addEventListener("mousedown", handleStart, false);
		button.addEventListener("mouseup", handleEnd, false);
		// Prevent default touch behaviors
		button.addEventListener("touchmove", (e) => e.preventDefault(), false);
	});
});

function startNewGame(initialTimestamp: number, canvas: HTMLCanvasElement) {
	canvas.style.display = "block";
	const ctx = canvas.getContext("2d");
	canvas.width = 2048;
	canvas.height = 2048;
	let backdrop = document.getElementById("backdrop") as HTMLImageElement;
	let backdropPattern = ctx?.createPattern(backdrop, "repeat")!;
	const game = new Game(canvas.width, canvas.height, backdropPattern);
	let requestId: number;

	function animate(timestamp: number) {
		if (!ctx) return;
		const deltaTime = timestamp - initialTimestamp;
		initialTimestamp = timestamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.update(deltaTime);
		game.draw(ctx);
		if (game.player.lives <= 0) {
			const hs = localStorage.getItem("hs");
			if (!hs || game.enemyGenerator.kills > parseInt(hs)) {
				localStorage.setItem("hs", game.enemyGenerator.kills.toString());
			}
			const highscore = document.getElementById("highscore") as HTMLDivElement;
			highscore.textContent = `Highscore: ${hs}`;
			canvas.style.display = "none";
			window.cancelAnimationFrame(requestId);
			return;
		}
		requestId = requestAnimationFrame(animate);
	}

	animate(initialTimestamp);
}

/*
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
*/
