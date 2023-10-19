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

    get #REFERENCE_COLOR() {
        return 11195392;
    }

    constructor() {
        super("Color");
    }

    preload() {
        for (const [name, path] of Object.entries(this.#assets)) {
            this.load.svg(name, path);
        }

        this.load.image("strawberry", "public/assets/strawberry.png");
        this.load.image("brush", "public/assets/brush.png");

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
        const {
            renderTexture: itemImageDrawingTexture,
            image: itemMaskedImage,
            canvasTexture: itemImageReferenceTexture,
        } = this.#createItemImage();
        let pointsToColor = this.#getPointsToColor(itemImageReferenceTexture);
        const totalPointsToColorCount = pointsToColor.length;

        for (const image of background.getChildren()) {
            this.#backgroundLayer.add(image);
        }

        this.#drawingLayer.add(itemMaskedImage);
        this.#uiLayer.add(itemOutlineImage);
        this.#uiLayer.add(itemNameText);

        itemNameText.on("pointerdown", () => {
            // TODO: Inspect if it can be done better
            this.sound.add("strawberry").play();
        });

        this.input.on("pointermove", (pointer) => {
            if (pointer.isDown) {
                itemImageDrawingTexture.draw("brush", pointer.x - 32, pointer.y - 32);
                itemImageReferenceTexture.drawFrame("brush", undefined, pointer.x - 32, pointer.y - 32);
            }
        });

        this.input.on("pointerdown", (pointer) => {
            itemImageDrawingTexture.draw("brush", pointer.x - 32, pointer.y - 32);
            itemImageReferenceTexture.drawFrame("brush", undefined, pointer.x - 32, pointer.y - 32);
        });

        this.input.on("pointerup", () => {
            pointsToColor = this.#getUnColoredPoints(itemImageReferenceTexture, pointsToColor);

            if ((totalPointsToColorCount / 100) * 2 >= pointsToColor.length) {
                const image = new Phaser.GameObjects.Image(
                    this,
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    "strawberry",
                );

                this.#uiLayer.add(image);
                this.#drawingLayer.remove(itemMaskedImage);
                this.#uiLayer.remove(itemOutlineImage);

                this.tweens.add({
                    targets: image,
                    ease: "Linear",
                    props: {
                        scaleX: { value: 1.05, duration: 1000, yoyo: true },
                        scaleY: { value: 1.05, duration: 1000, yoyo: true },
                    },
                });
            }
        });
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
        const text = new Phaser.GameObjects.Text(this, 0, 0, name.toUpperCase(), {
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

        let canvasTexture = this.textures.createCanvas("c", window.innerWidth, window.innerHeight);
        canvasTexture = canvasTexture.drawFrame(
            "strawberry-filled",
            undefined,
            ((image.displayWidth - window.innerWidth) / 2) * -1,
            ((image.displayHeight - window.innerHeight) / 2) * -1,
        );

        return { renderTexture, image, canvasTexture };
    }

    /**
     * @param {Phaser.Textures.CanvasTexture} referenceTexture
     */
    #getPointsToColor(referenceTexture) {
        const columnPixels = referenceTexture.getPixels();
        /** @type {Phaser.Geom.Point[]} */
        let pointsToColor = [];
        for (const rowPixels of columnPixels) {
            for (const pixel of rowPixels) {
                if (pixel.color === this.#REFERENCE_COLOR) {
                    pointsToColor.push(new Phaser.Geom.Point(pixel.x, pixel.y));
                }
            }
        }

        return pointsToColor;
    }

    /**
     * @param {Phaser.Textures.CanvasTexture} referenceTexture
     * @param {Phaser.Geom.Point[]} pointsToColor
     */
    #getUnColoredPoints(referenceTexture, pointsToColor) {
        const columnPixels = referenceTexture.getPixels();
        /** @type {Phaser.Geom.Point[]} */
        const unColoredPoints = [];
        for (const point of pointsToColor) {
            if (columnPixels[point.y][point.x].color === this.#REFERENCE_COLOR) {
                unColoredPoints.push(point);
            }
        }

        return unColoredPoints;
    }
}
