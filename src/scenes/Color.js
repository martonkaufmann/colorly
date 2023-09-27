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

        this.load.image("bg-strawberry", "public/assets/strawberry_outline_white.png")

        this.load.audio("strawberry", [
            "public/assets/audio/HU_strawberry.mp3",
            "public/assets/audio/HU_strawberry.ogg",
        ])
    }

    create() {
        this.#loadBackground();
        this.#drawAssetName()
        this.#drawAsset()
        
                let draw = false;
                 const g = this.add.graphics({fillStyle: {color: "#aaa"}})       
                this.input.on("pointerdown", (pointer) => {
                    draw = true
                })
        
                this.input.on("pointerup", (pointer) => {
                    draw = false;
                })
        
                this.input.on("pointermove", (pointer) => {
                    if (draw) {
//                        const p = new Phaser.Geom.Point(pointer.x, pointer.y)

                g.fillPoint(pointer.x, pointer.y)

                    }
                })
                
    }

    #loadBackground() {
        const imgSize = 64;
        let verticalCount = Math.ceil(window.innerHeight / imgSize);
        let horizontalCount = Math.ceil(window.innerWidth / imgSize);
        let backgroundImageIndex = 0;

        for (let i = 0; i < verticalCount; i++) {
            for (let x = 0; x < horizontalCount; x++) {
                const backgroundImage = this.add.image(
                    x * imgSize + imgSize / 2 + (x * 8),
                    i * imgSize + imgSize / 2 + (i * 8),
                    "bg-strawberry",
                );

                backgroundImage.scale = 0.125; // 80
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
        backgroundImage.scale = 0.8
    }
}
