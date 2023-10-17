import Phaser from "phaser";
import { BACKGROUND_IMAGE_SIZE_DIVIDER, IMAGE_SIZE } from "../constants";
import i18next from "i18next";

export default class Color extends Phaser.Scene {
    /** @type Phaser.GameObjects.Layer */
    #drawingLayer;
    /** @type Phaser.GameObjects.Layer */
    #uiLayer;
    /** @type Phaser.GameObjects.Layer */
    #backgroundLayer;

    #assets = {
        "strawberry-filled": "public/assets/strawberry_filled.svg",        
        "strawberry-outline": "public/assets/strawberry_outline.svg",
        "strawberry-outline-white": "public/assets/strawberry_outline_white.svg",
    };

    constructor() {
        super("Color");
    }

    preload() {
        for (const [name, path] of Object.entries(this.#assets)) {
            this.load.svg(name, path);
        }

        this.load.image("strawberry", "public/assets/strawberry.png");        
        this.load.image("corn", "public/assets/corn.png");
        this.load.image("brush", "public/assets/brush.png");
        this.load.image("brush-black", "public/assets/brush_black.png");

        this.load.audio("strawberry", [
            "public/assets/audio/HU_strawberry.mp3",
            "public/assets/audio/HU_strawberry.ogg",
        ]);
    }

    create() {
        this.#backgroundLayer = this.add.layer();
        this.#drawingLayer = this.add.layer();
        this.#uiLayer = this.add.layer();

        const background = this.#createBackground();
        const itemOutlineImage = this.#createItemOutlineImage();
        const itemNameText = this.#createItemNameText();
        const { renderTexture, image } = this.#createItemImage();

        let canvas = this.textures.createCanvas('c', window.innerWidth, window.innerHeight)
        canvas = canvas.drawFrame("strawberry-filled", undefined,
            (image.displayWidth - window.innerWidth) / 2 * -1,
            (image.displayHeight - window.innerHeight) / 2 * -1,
        )
        
        /** @type {Phaser.Geom.Point[]} */
        let pointsToColor = [];
        for (const rowPixels of canvas.getPixels()) {
            for (const pixel of rowPixels) {
                if (pixel.color === 11195392) {
                    pointsToColor.push(new Phaser.Geom.Point(pixel.x, pixel.y))
                }
            }
        }
        const totalPointsToColorCount = pointsToColor.length

        this.#uiLayer.add(itemOutlineImage);
        this.#uiLayer.add(itemNameText);

        for (const image of background.getChildren()) {
            this.#backgroundLayer.add(image);
        }

        this.#drawingLayer.add(image);

        itemNameText.on("pointerdown", () => {
            // TODO: Inspect if it can be done better
            this.sound.add("strawberry").play();
        });

        this.input.on("pointermove", (pointer) => {
            if (pointer.isDown) {
                renderTexture.draw("brush", pointer.x - 32, pointer.y - 32);                
                canvas.drawFrame("brush", undefined, pointer.x - 32, pointer.y - 32);
            }
        });

        this.input.on("pointerdown", (pointer) => {
            renderTexture.draw("brush", pointer.x - 32, pointer.y - 32);
            canvas.drawFrame("brush", undefined, pointer.x - 32, pointer.y - 32);

        })

        this.input.on("pointerup", (pointer) => {
            const pixels = canvas.getPixels()
            /** @type {Phaser.Geom.Point[]} */
            const remainingPointsToColor = []

            for (const point of pointsToColor) {
                if (pixels[point.x][point.y].color === 11195392) {
                    remainingPointsToColor.push(point)
                }
            }

            pointsToColor = remainingPointsToColor

            console.log(totalPointsToColorCount)
            console.log(pointsToColor.length)

            if (totalPointsToColorCount / 100 * 20 >= pointsToColor.length) {
                alert('COLORED')
            }

//            console.log(pointsToColor.length)
//            console.log(canvas.getCanvas().toDataURL())

            // TODO: Snapshow texture and check pixels one by one
        })
    }

    #createBackground() {
        const backgroundImageSize = IMAGE_SIZE / BACKGROUND_IMAGE_SIZE_DIVIDER;
        const backgroundImageMargin = 10;
        const verticalCount = Math.ceil(window.innerHeight / backgroundImageSize);
        const horizontalCount = Math.ceil(window.innerWidth / backgroundImageSize);

        // TODO: Group creates it's own layer, handle this
        const backgroundImageGroup = new Phaser.GameObjects.Group(this, {
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

        return backgroundImageGroup;
    }

    #createItemNameText() {
        const name = i18next.t("strawberry");
        const text = new Phaser.GameObjects.Text(this, 0, 0, name.charAt(0).toUpperCase() + name.slice(1), {
            fontSize: "48px",
            fontStyle: "900",
            fill: "#fff",
            stroke: "#000",
            strokeThickness: 3,
        });
        text.setInteractive();
        text.setX(window.innerWidth / 2 - text.displayWidth / 2);
        text.setY(text.displayHeight - 20);

        return text;
    }

    #createItemOutlineImage() {
        const image = new Phaser.GameObjects.Image(
            this,
            window.innerWidth / 2,
            window.innerHeight / 2,
            "strawberry-outline",
        );

        return image;
    }

    #createItemImage() {
        const image = new Phaser.GameObjects.Image(this, window.innerWidth / 2, window.innerHeight / 2, "strawberry");
        const renderTexture = new Phaser.GameObjects.RenderTexture(
            this,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerWidth,
            window.innerHeight,
        );

        image.setMask(renderTexture.createBitmapMask());

        return { renderTexture, image };
    }
}
