import Phaser from "phaser";

export default class Color extends Phaser.Scene {
    #assets = {
        "strawberry": "public/assets/strawberry_outline.png",
    }

    constructor() {
        super("Color")
    }

    preload() {
        for (const [name, path] of Object.entries(this.#assets)) {
            console.log(name)
            console.log(path)
            this.load.image(name, path)
        }

        this.load.image("bg-strawberry", "public/assets/strawberry_outline_thic_white.png")

        this.load.audio("strawberry", [
            "public/assets/audio/HU_strawberry.mp3",
            "public/assets/audio/HU_strawberry.ogg",
        ])
    }

    create() {
        this.#loadBackground();
        this.#drawAssetName()
        this.#drawAsset()
        /*
                let draw = false;
                const drawings = [];
         //       const drawing = this.add.graphics()
        //        let sx = 0
        //        let sy = 0
                let currentCoordinates = []
                const coordinates = []
        
                this.input.on("pointerdown", (pointer) => {
                    draw = true
                    currentCoordinates.push([pointer.x, pointer.y])
                })
        
                this.input.on("pointerup", (pointer) => {
                    draw = false;
                    currentCoordinates.push([pointer.x, pointer.y])
                    coordinates.push(currentCoordinates)
                    currentCoordinates = []
                })
        
                this.input.on("pointermove", (pointer) => {
                    if (draw) {
                        drawing.clear()
                        drawing.lineStyle(2, "#000", 1)
                        drawing.pa
                    }
                })
                */
    }

    #loadBackground() {
        const imgSize = 80;
        let verticalCount = Math.ceil(window.innerHeight / imgSize);
        let horizontalCount = Math.ceil(window.innerWidth / imgSize);
        let backgroundImageIndex = 0;

        for (let i = 0; i < verticalCount; i++) {
            for (let x = 0; x < horizontalCount; x++) {
                const backgroundImage = this.add.image(
                    x * imgSize + imgSize / 2,
                    i * imgSize + imgSize / 2,
                    "bg-strawberry",
                );

                backgroundImage.scale = 0.4; // 80
                backgroundImage.setAlpha(0.5)
                backgroundImageIndex++;
            }
        }
    }

    #drawAssetName() {
        const assetNameText = this.add.text(0, 0, "Eper", {
            fontSize: "48px",
            fontStyle: "900",
            fill: '#fff',
            stroke: "#000",
            strokeThickness: 3,
        });
        assetNameText.setInteractive()
        assetNameText.setX(
            (window.innerWidth / 2) -
            (assetNameText.displayWidth / 2)
        )
        assetNameText.setY(assetNameText.displayHeight - 20)
        assetNameText.on("pointerdown", () => {
            this.sound.add("strawberry").play()
        })
    }

    #drawAsset() {
        const backgroundImage = this.add.image(
            window.innerWidth / 2, window.innerHeight / 2,
            "strawberry"
        );
        backgroundImage.scale = 2
    }
}
