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
        let g;

/*
setInterval(() => {
if (draw) {
                console.log(this.input.mousePointer.x, this.input.mouse.y)
            }
        }, 50)
*/

        const createGraphic = (x, y) => {
                 g = this.add.graphics()       
        g.lineStyle(16, 0xf44335, 1);
        g.beginPath();
            g.moveTo(x, y)
        }

    let moves = 0;
        const maxmoves = 20;

const coordinates = []

                this.input.on("pointerdown", (pointer) => {
                    draw = true;
            createGraphic(pointer.x, pointer.y);
                })
        
                this.input.on("pointerup", (pointer) => {
if (draw) {
            g.lineTo(pointer.x, pointer.y)
    //        g.closePath()
                g.strokePath()
            }
            draw = false;           
                })
        
                this.input.on("pointermove", (pointer) => {
                    if (draw) {
                console.log('move')
 //               console.log('move')
g.lineTo(pointer.x, pointer.y)
                g.strokePath()
 //               coordinates.push([pointer.x, pointer.y])
  //              g.fillPoint(pointer.x, pointer.y)
moves++
 //               console.log(moves)
                if (moves === maxmoves) {
                    // research what save does a bit more
                    // find out if save or createGraphic is responsible for performance
                    g.save()
                    createGraphic(pointer.x, pointer.y)
                    moves = 0
                }
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
