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
    /** @type string[] */
    #assets;
    /** @type int */
    #imageScale;

    get #REFERENCE_COLOR() {
        return 11195392;
    }

    constructor() {
        super("Color");
    }

    init({ assets }) {
        this.#assets = assets;
        this.#imageScale = window.innerWidth / IMAGE_SIZE;
    }

    preload() {
        this.load.svg(`${this.#assets[0]}-filled`, `public/assets/${this.#assets[0]}-filled.svg`, {
            scale: this.#imageScale,
        });
        this.load.svg(`${this.#assets[0]}-outline`, `public/assets/${this.#assets[0]}-outline.svg`, {
            scale: this.#imageScale,
        });
        this.load.svg(`${this.#assets[0]}-outline-white`, `public/assets/${this.#assets[0]}-outline-white.svg`, {
            scale: this.#imageScale,
        });

        this.load.image(this.#assets[0], `public/assets/${this.#assets[0]}.png`);
        this.load.image("brush", "public/assets/brush.png");

        this.load.audio(this.#assets[0], [`public/assets/audio/hu/${this.#assets[0]}.mp3`]);
        if (null === this.sound.get("background")) {
            this.load.audio("background", ["public/assets/music/background.ogg"]);
        }
    }

    create() {
        if (null === this.sound.get("background")) {
            this.sound.add("background").play({ loop: true });
        }

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
            this.sound.add(this.#assets[0]).play();
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

            // 75% of the image has to be colored
            if ((totalPointsToColorCount / 100) * 25 >= pointsToColor.length) {
                const image = new Phaser.GameObjects.Image(
                    this,
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    this.#assets[0],
                );
                image.scale = this.#imageScale;

                this.#uiLayer.add(image);
                this.#drawingLayer.remove(itemMaskedImage);
                this.#uiLayer.remove(itemOutlineImage);
                this.textures.remove("c");

                this.tweens.add({
                    targets: image,
                    ease: "Linear",
                    props: {
                        scaleX: { value: this.#imageScale + 0.05, duration: 1000, yoyo: true },
                        scaleY: { value: this.#imageScale + 0.05, duration: 1000, yoyo: true },
                    },
                    onComplete: () => {
                        const assets = this.#assets;

                        assets.push(assets.shift());

                        this.scene.start("Color", { assets });
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
            key: `${this.#assets[0]}-outline-white`,
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
        const name = i18next.t(this.#assets[0]);
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
            `${this.#assets[0]}-outline`,
        );

        return image;
    }

    #createItemImage() {
        const image = new Phaser.GameObjects.Image(
            this,
            window.innerWidth / 2,
            window.innerHeight / 2,
            this.#assets[0],
        );
        image.scale = this.#imageScale;

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
            `${this.#assets[0]}-filled`,
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
