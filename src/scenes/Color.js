import Phaser from "phaser";

export default class Color extends Phaser.Scene {
    #MAX_STROKES = 10;
    #DEFAULT_ASSET_SIZE = 512;

    /** @type Phaser.GameObjects.Layer */
    #drawingLayer;
    /** @type Phaser.GameObjects.Layer */
    #uiLayer;
    /** @type Phaser.GameObjects.Layer */
    #backgroundLayer;

    #assets = {
        strawberry: "public/assets/strawberry_outline.png",
    };

    constructor() {
        super("Color");
    }

    preload() {
        for (const [name, path] of Object.entries(this.#assets)) {
            this.load.image(name, path);
        }

        this.load.image("bg-strawberry", "public/assets/strawberry_outline_white.png");
        this.load.audio("strawberry", [
            "public/assets/audio/HU_strawberry.mp3",
            "public/assets/audio/HU_strawberry.ogg",
        ]);
    }

    create() {
        this.#backgroundLayer = this.add.layer()
        this.#drawingLayer = this.add.layer()
        this.#uiLayer = this.add.layer()

        this.#drawBackground();
        this.#drawAssetName();
        this.#drawAsset();

        let strokeCount = 0;
        let isDrawing = false;
        /** @type Phaser.GameObjects.Graphics */
        let graphic;

        const createGraphic = (x, y) => {
//            graphic = this.#drawingLayer.add.graphics();
            graphic = new Phaser.GameObjects.Graphics(this)
            graphic.lineStyle(24, 0xf44335, 1);
            graphic.beginPath();
            graphic.moveTo(x, y);

            this.#drawingLayer.add(graphic)
        };

        this.input.on("pointerdown", (pointer) => {
            isDrawing = true;
            createGraphic(pointer.x, pointer.y);
        });

        this.input.on("pointerup", (pointer) => {
            if (isDrawing) {
                graphic.lineTo(pointer.x, pointer.y);
                graphic.strokePath();
            }

            isDrawing = false;
        });

        this.input.on("pointermove", (pointer) => {
            if (isDrawing) {
                graphic.lineTo(pointer.x, pointer.y);
                graphic.strokePath();

                if (strokeCount === this.#MAX_STROKES) {
                    createGraphic(pointer.x, pointer.y);
                    strokeCount = 0;
                }

                strokeCount++
            }
        });
    }

    #drawBackground() {
        const imgSize = this.#DEFAULT_ASSET_SIZE / 8;
        const margin = 8;
        const verticalCount = Math.ceil(window.innerHeight / imgSize);
        const horizontalCount = Math.ceil(window.innerWidth / imgSize);
        let backgroundImageIndex = 0;

        for (let i = 0; i < verticalCount; i++) {
            for (let x = 0; x < horizontalCount; x++) {
                const backgroundImage = new Phaser.GameObjects.Image(
                    this,
                    x * imgSize + imgSize / 2 + x * margin,
                    i * imgSize + imgSize / 2 + i * margin,
                    "bg-strawberry",
                );

                backgroundImage.scale = imgSize / this.#DEFAULT_ASSET_SIZE; // 80
                backgroundImage.setAlpha(0.5);
    
                this.#backgroundLayer.add(backgroundImage)

                backgroundImageIndex++;
            }
        }
    }

    #drawAssetName() {
        const assetNameText = new Phaser.GameObjects.Text(this, 0, 0, "Eper", {
            fontSize: "48px",
            fontStyle: "900",
            fill: "#fff",
            stroke: "#000",
            strokeThickness: 3,
        });
        assetNameText.setInteractive();
        assetNameText.setX(window.innerWidth / 2 - assetNameText.displayWidth / 2);
        assetNameText.setY(assetNameText.displayHeight - 20);
        assetNameText.on("pointerdown", () => {
            // TODO: Inspect if it can be done better
            this.sound.add("strawberry").play();
        });

        this.#uiLayer.add(assetNameText)
    }

    #drawAsset() {
        const asset = new Phaser.GameObjects.Image(
            this, 
            window.innerWidth / 2, 
            window.innerHeight / 2, 
            "strawberry"
        )
        asset.scale = 0.8;

        this.#uiLayer.add(asset)
    }
}
