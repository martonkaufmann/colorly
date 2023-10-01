import Phaser from "phaser";
import { BACKGROUND_IMAGE_SIZE_DIVIDER, IMAGE_SIZE } from "../constants";
import i18next from "i18next";

export default class Color extends Phaser.Scene {
    //#MAX_STROKE_COUNT = 10;    
    #MAX_STROKE_COUNT = 30;

    /** @type Phaser.GameObjects.Layer */
    #drawingLayer;
    /** @type Phaser.GameObjects.Layer */
    #uiLayer;
    /** @type Phaser.GameObjects.Layer */
    #backgroundLayer;

    #assets = {
        "strawberry-outline": "public/assets/strawberry_outline.png",
    };

    constructor() {
        super("Color");
    }

    preload() {
        for (const [name, path] of Object.entries(this.#assets)) {
            this.load.image(name, path);
        }

        this.load.image("strawberry-outline-white", "public/assets/strawberry_outline_white.png");
        this.load.audio("strawberry", [
            "public/assets/audio/HU_strawberry.mp3",
            "public/assets/audio/HU_strawberry.ogg",
        ]);
    }

    create() {
        this.#backgroundLayer = this.add.layer();
        this.#drawingLayer = this.add.layer();
        this.#uiLayer = this.add.layer();

        this.#uiLayer.add(this.#createItemNameText());
        this.#uiLayer.add(this.#createItemOutlineImage());

        for (const image of this.#createBackground().getChildren()) {
            this.#backgroundLayer.add(image);
        }

        let strokeCount = 0;
        let isDrawing = false;
        /** @type Phaser.GameObjects.Graphics */
        let graphic;

        // TODO: move drawing to separate function
        const createGraphic = (x, y) => {
            // TODO: Create and add two graphics one
            // for future use and move preious future one
            // to be current one
            graphic = new Phaser.GameObjects.Graphics(this);
            graphic.lineStyle(24, 0xf44335, 1);
            graphic.beginPath();
            graphic.moveTo(x, y);

            this.#drawingLayer.add(graphic);

//            console.log("createGraphic")
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

                if (strokeCount === this.#MAX_STROKE_COUNT) {
                    createGraphic(pointer.x, pointer.y);
                    strokeCount = 0;
                }

                strokeCount++;

                console.log("pointermove")
            }
        });
    }

    #createBackground() {
        const backgroundImageSize = IMAGE_SIZE / BACKGROUND_IMAGE_SIZE_DIVIDER;
        const backgroundImageMargin = 10;
        const verticalCount = Math.ceil(window.innerHeight / backgroundImageSize);
        const horizontalCount = Math.ceil(window.innerWidth / backgroundImageSize);

        return new Phaser.GameObjects.Group(this, {
            key: "strawberry-outline-white",
            repeat: horizontalCount * verticalCount,
            setOrigin: {
                x: 0,
                y: 0,
            },
            setScale: {
                x: 1 / BACKGROUND_IMAGE_SIZE_DIVIDER,
                y: 1 / BACKGROUND_IMAGE_SIZE_DIVIDER,
            },
            setAlpha: {
                value: 0.5,
            },
            gridAlign: {
                width: horizontalCount,
                cellWidth: backgroundImageSize + backgroundImageMargin,
                cellHeight: backgroundImageSize + backgroundImageMargin,
            },
        });
    }

    #createItemNameText() {
        const name = i18next.t("strawberry");
        const itemNameText = new Phaser.GameObjects.Text(this, 0, 0, name.charAt(0).toUpperCase() + name.slice(1), {
            fontSize: "48px",
            fontStyle: "900",
            fill: "#fff",
            stroke: "#000",
            strokeThickness: 3,
        });
        itemNameText.setInteractive();
        itemNameText.setX(window.innerWidth / 2 - itemNameText.displayWidth / 2);
        itemNameText.setY(itemNameText.displayHeight - 20);
        itemNameText.on("pointerdown", () => {
            // TODO: Inspect if it can be done better
            this.sound.add("strawberry").play();
        });

        return itemNameText;
    }

    #createItemOutlineImage() {
        const itemOutlineImage = new Phaser.GameObjects.Image(
            this,
            window.innerWidth / 2,
            window.innerHeight / 2,
            "strawberry-outline",
        );
        itemOutlineImage.scale = 0.8;

        return itemOutlineImage;
    }
}
