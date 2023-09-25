import Phaser from "phaser";

export default class StartGame extends Phaser.Scene {
    #backgroundImages = {
        "start-play-bg-apple": "public/assets/apple_outline_thic_white.png",
        "start-play-bg-banan": "public/assets/banana_outline_thic_white.png",
        "start-play-bg-cherry": "public/assets/cherry_outline_thic_white.png",
        "start-play-bg-grapges": "public/assets/grapes_outline_thic_white.png",
        "start-play-bg-mushroom": "public/assets/mushroom_outline_thic_white.png",
        "start-play-bg-strawberry": "public/assets/strawberry_outline_thic_white.png",
    };

    constructor() {
        super("StartGame")
    }

    preload() {
        this.load.image("start-play", "public/assets/play.png");

        for (const [name, image] of Object.entries(this.#backgroundImages)) {
            this.load.image(name, image);
        }
    }

    create() {
        const imgSize = 80;
        let verticalCount = Math.ceil(window.innerHeight / imgSize);
        let horizontalCount = Math.ceil(window.innerWidth / imgSize);
        let backgroundImageNames = Object.keys(this.#backgroundImages);
        let backgroundImageIndex = 0;

        for (let i = 0; i < verticalCount; i++) {
            for (let x = 0; x < horizontalCount; x++) {
                if (backgroundImageIndex >= backgroundImageNames.length) {
                    backgroundImageIndex = 0;
                }

                const backgroundImage = this.add.image(
                    x * imgSize + imgSize / 2,
                    i * imgSize + imgSize / 2,
                    backgroundImageNames[backgroundImageIndex],
                );
                backgroundImage.scale = 0.4; // 80
                backgroundImageIndex++;
            }
        }

        const playButtonImage = this.add.image(window.innerWidth / 2, window.innerHeight / 2, "start-play");
        playButtonImage.setInteractive();
        playButtonImage.scale = 0.08;
        playButtonImage.on("pointerdown", () => {
            this.scene.start("Color")
        });
    }
}

