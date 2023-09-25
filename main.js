import Phaser from "phaser"

class BaseScene extends Phaser.Scene {
	preload() {
		this.load.image("start-play", "public/assets/play.png");
		this.load.image("start-play-bg-apple", "public/assets/apple_outline_thic_white.png") // 200 x 200	
		this.load.image("start-play-bg-banan", "public/assets/banana_outline_thic_white.png") 		
		this.load.image("start-play-bg-cherry", "public/assets/cherry_outline_thic_white.png") 
		this.load.image("start-play-bg-grapges", "public/assets/grapes_outline_thic_white.png") 
		this.load.image("start-play-bg-mushroom", "public/assets/mushroom_outline_thic_white.png")
	}

	create() {
		const imgSize = 120*0.8;
		const imageMargin = 15;
		let verticalCount = Math.ceil(window.innerHeight / (imgSize+imageMargin)) + 1;
		let horizontalCount = Math.ceil(window.innerWidth / (imgSize + imageMargin)) + 1;

		let backgroundImages = [
			"start-play-bg-apple", 
			"start-play-bg-banan", 
			"start-play-bg-cherry",
			"start-play-bg-grapges",
			"start-play-bg-mushroom"
		]

		let backgroundImageIndex = 0;
		for (let i = 0; i < verticalCount; i++) {
			for (let x = 0; x < horizontalCount; x++) {
				if (backgroundImageIndex >= backgroundImages.length) {
					backgroundImageIndex = 0;
				}

				const backgroundImage = this.add.image(
					(x * imgSize) + imgSize/2, 
					(i * imgSize) + imgSize/2, 
					backgroundImages[backgroundImageIndex]
				)
				backgroundImage.backgroundImage = "transparent"
				backgroundImage.scale=0.4 // 80
				backgroundImageIndex++
			}

			backgroundImages = backgroundImages.reverse()
		}
		const playButtonImage = this.add.image(window.innerWidth/2, window.innerHeight/2,"start-play");
		playButtonImage.setInteractive();
		playButtonImage.scale = 0.08;
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

