import Phaser from "phaser"

class BaseScene extends Phaser.Scene {
	preload() {
		this.load.image("play", "public/assets/play.png");
		this.load.image("play-bg-icon", "public/assets/apple_outline_thic_white.png")
	}

	create() {
		console.log(window.innerWidth)
		console.log(window.innerHeight)
		const imgSize = 120*0.8;
		const imageMargin = 15;
		let verticalCount = Math.ceil(window.innerHeight / (imgSize+imageMargin)) + 1;
		let horizontalCount = Math.ceil(window.innerWidth / (imgSize + imageMargin)) + 1;

		console.log(horizontalCount)
		console.log(verticalCount)

		for (let i = 0; i < verticalCount; i++) {
			for (let x = 0; x < horizontalCount; x++) {
				const backgroundImage = this.add.image(
					(x * imgSize) + (x * imageMargin) + imgSize/2, 
					(i * imgSize) + (i * imageMargin) + imgSize/2, 
					"play-bg-icon"
				)
				backgroundImage.backgroundImage = "transparent"
				backgroundImage.scale=0.8
//				backgroundImage.scale = 0.1
			}
		}
		const playButtonImage = this.add.image(window.innerWidth/2, window.innerHeight/2,"play");
		playButtonImage.setInteractive();
		playButtonImage.scale = 0.08;
		console.log(playButtonImage.width)
		console.log(playButtonImage.width*0.05)
		console.log(playButtonImage.height)
		console.log(playButtonImage.height*0.05)
		playButtonImage.on("pointerdown", () => {
			console.log("start playing")
		})
	}
}

const game = new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	scene: BaseScene,
	backgroundColor: "#fff7b4",
})

console.log("Hello world")
