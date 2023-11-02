import Phaser from "phaser";

export default class StartGame extends Phaser.Scene {
    #backgroundImages = {
        "start-play-bg-apple": "assets/apple-outline-white.svg",
        "start-play-bg-banan": "assets/banana-outline-white.svg",
        "start-play-bg-pear": "assets/pear-outline-white.svg",
        "start-play-bg-grapges": "assets/grapes-outline-white.svg",
        "start-play-bg-mushroom": "assets/mushroom-outline-white.svg",
        "start-play-bg-strawberry": "assets/strawberry-outline-white.svg",
        "start-play-bg-pineapple": "assets/pineapple-outline-white.svg",
        "start-play-bg-corn": "assets/corn-outline-white.svg",
    };

    constructor() {
        super("StartGame");
    }

    preload() {
        this.load.image("start-play", "assets/play.png");

        for (const [name, image] of Object.entries(this.#backgroundImages)) {
            this.load.svg(name, image);
        }
    }

    create() {
        const imgSize = 64;
        let verticalCount = Math.floor(window.innerHeight / imgSize);
        let horizontalCount = Math.floor(window.innerWidth / imgSize);
        let backgroundImageNames = Object.keys(this.#backgroundImages);
        let backgroundImageIndex = 0;

        for (let i = 0; i < verticalCount; i++) {
            for (let x = 0; x < horizontalCount; x++) {
                if (backgroundImageIndex >= backgroundImageNames.length) {
                    backgroundImageIndex = 0;
                }

                const backgroundImage = this.add.image(
                    x * imgSize + imgSize / 2 + x * 8,
                    i * imgSize + imgSize / 2 + i * 8,
                    backgroundImageNames[backgroundImageIndex],
                );
                backgroundImage.scale = 0.125; // 64
                backgroundImageIndex++;
            }
        }

        const playButtonImage = this.add.image(window.innerWidth / 2, window.innerHeight / 2, "start-play");
        playButtonImage.setInteractive();
        playButtonImage.scale = 0.08;
        playButtonImage.on("pointerdown", () => {
            this.scene.start("Color", {
                assets: [
                    "apple",
                    "banana",
                    "carrot",
                    "cauliflower",
                    "strawberry",
                    "corn",
                    "grapes",
                    "mushroom",
                    "orange",
                    "pear",
                    "peas",
                    "pineapple",
                    "plum",
                ],
            });
        });
    }
}
