import Phaser from "phaser"

class BaseScene extends Phaser.Scene {
	preload() {
		this.load.image("play", "public/assets/play.png");
	}

	create() {
		const playButtonImage = this.add.image(60, 60, "play");
		playButtonImage.scale = 0.05;
	}
}

const game = new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	scene: BaseScene,
})

console.log("Hello world")
