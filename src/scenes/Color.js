import Phaser from "phaser";
import { BACKGROUND_IMAGE_SIZE_DIVIDER, IMAGE_SIZE } from "../constants";
import i18next from "i18next";
import { w } from "phaser/src/gameobjects/components/Transform";

export default class Color extends Phaser.Scene {
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

    /**
     * @param {Object} obj
     * @param {string[]} obj.assets
     */
    init({ assets }) {
        this.#assets = assets;
        this.#imageScale = window.innerWidth / IMAGE_SIZE;
    }

    preload() {
        this.load.svg(`${this.#assets[0]}-filled`, `${this.#assets[0]}-filled.svg`, {
            scale: this.#imageScale,
        });
        this.load.svg(`${this.#assets[0]}-outline`, `${this.#assets[0]}-outline.svg`, {
            scale: this.#imageScale,
        });
        this.load.svg(`${this.#assets[0]}-outline-white`, `${this.#assets[0]}-outline-white.svg`, {
            scale: this.#imageScale,
        });

        this.load.image(this.#assets[0], `${this.#assets[0]}.png`);

        this.load.audio(this.#assets[0], [
            `audio/hu/${this.#assets[0]}.ogg`,
            `audio/hu/${this.#assets[0]}.mp3`,
        ]);

        if (false === this.textures.exists("star")) {
            this.load.image("star", "star.png");
        }

        if (false === this.textures.exists("brush")) {
            this.load.image("brush", "brush.png");
        }

        if (null === this.sound.get("background")) {
            this.load.audio("background", [
                "music/background.ogg",
                "music/background.mp3",
            ]);
        }

        if (null === this.sound.get("hooray")) {
            this.load.audio("hooray", [
                "audio/hooray.ogg",
                "audio/hooray.mp3",
            ]);
        }

        if (null === this.sound.get("pop")) {
            this.load.audio("pop", [
                "audio/pop.ogg",
                "audio/pop.mp3",
            ]);
        }

        this.load.atlas("stars", "stars.png", "stars.json");
    }

    create() {
        if (this.sound.get("background") === null) {
            const backgroundMusic = this.sound.add("background");
            backgroundMusic.setVolume(0.6);
            backgroundMusic.play({ loop: true });
        }

        const background = this.#addBackground();
        const {
            renderTexture: itemImageDrawingTexture,
            image: itemMaskedImage,
            canvasTexture: itemImageReferenceTexture,
        } = this.#addItemImage();
        const itemOutlineImage = this.#addItemOutlineImage();
        const { container: itemNameButton } = this.#addItemNameButton();
        let pointsToColor = this.#getPointsToColor(itemImageReferenceTexture);
        const totalPointsToColorCount = pointsToColor.length;

        // TODO: Remove resize later
        itemImageDrawingTexture.resize(window.innerWidth, window.innerHeight);
        // TODO: Check is this a hacky way to avoid render texture issue?
        itemImageDrawingTexture.beginDraw();
        itemImageDrawingTexture.draw();

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

            // 98% of the image has to be colored
            const percentageToFill = (totalPointsToColorCount / 100) * (import.meta.env.PROD ? 2 : 90);
            if (percentageToFill < pointsToColor.length) {
                return;
            }

            this.input.off("pointermove");
            this.input.off("pointerup");
            this.input.off("pointerdown");

            itemImageReferenceTexture.destroy();
            itemImageDrawingTexture.destroy();
            itemMaskedImage.destroy();
            itemOutlineImage.destroy();
            itemNameButton.destroy();

            this.#onComplete();
        });
    }

    #onComplete() {
        const image = this.add.image(window.innerWidth / 2, window.innerHeight / 2, this.#assets[0]);
        image.setScale(this.#imageScale);

        this.sound.add("hooray").play();
        const popSound = this.sound.add("pop");

        const starEmitter = this.add.particles(0, 0, "star", {
            lifespan: 4000,
            angle: 90,
            x: { min: 0, max: window.innerWidth },
            y: { start: 0, end: window.innerHeight * 1.1 },
            scale: 0.15,
            frequency: 200,
        });

        const starPopEmitter = this.add.particles(0, 0, "stars", {
            frame: ["red", "green", "blue", "purple", "azure"],
            lifespan: 1000,
            speed: 250,
            scale: 0.03,
            gravityY: 600,
            emitting: false,
        });

        this.input.on("pointerdown", (pointer) => {
            const overlappingParticles = starEmitter.overlap(
                new Phaser.Geom.Rectangle(pointer.x, pointer.y, IMAGE_SIZE * 0.1, IMAGE_SIZE * 0.1),
            );

            if (overlappingParticles.length === 0) {
                return;
            }

            const overlappingParticle = overlappingParticles.shift();
            overlappingParticle.kill();

            starPopEmitter.emitParticleAt(overlappingParticle.worldPosition.x, overlappingParticle.worldPosition.y, 12);

            popSound.play();
        });

        this.tweens.add({
            targets: image,
            ease: "Linear",
            props: {
                scaleX: { value: this.#imageScale + 0.05, duration: 1000, yoyo: true },
                scaleY: { value: this.#imageScale + 0.05, duration: 1000, yoyo: true },
            },
        });

        setTimeout(() => {
            const assets = this.#assets;

            assets.push(assets.shift());

            this.input.off("pointerdown");
            starEmitter.destroy();
            starPopEmitter.destroy();
            popSound.destroy();
            image.destroy();

            this.scene.start("Color", { assets });
        }, 5000);
    }

    #addBackground() {
        const backgroundImageSize = IMAGE_SIZE / BACKGROUND_IMAGE_SIZE_DIVIDER;
        const backgroundImageMargin = 10;
        const verticalCount = Math.ceil(window.innerHeight / backgroundImageSize);
        const horizontalCount = Math.ceil(window.innerWidth / backgroundImageSize);

        const backgroundImageGroup = this.add.group({
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

    #addItemNameButton() {
        const audio = this.sound.add(this.#assets[0]);
        const name = i18next.t(this.#assets[0].replaceAll("/", "."));
        const text = this.add.text(0, 0, name.toUpperCase(), {
            fontSize: "36px",
            fontStyle: "900",
            fill: "#fff",
        });

        text.setLetterSpacing(2);
        text.setInteractive();

        const textWidth = text.displayWidth;
        const textHeight = text.displayHeight;
        const textPositionX = window.innerWidth / 2 - textWidth / 2;
        const textPositionY = textHeight + 10;

        text.setX(textPositionX);
        text.setY(textPositionY);

        const graphicsMarginLR = 40;
        const graphicsMarginTB = 20;
        const graphicsX = textPositionX - graphicsMarginLR / 2;
        const graphicsY = textPositionY - graphicsMarginTB / 2;
        const graphicsW = textWidth + graphicsMarginLR;
        const graphicsH = textHeight + graphicsMarginTB;
        const graphics = this.add
            .graphics()
            .fillStyle(Phaser.Display.Color.GetColor(131, 183, 247), 1)
            .fillRoundedRect(graphicsX, graphicsY, graphicsW, graphicsH, 16)
            .setInteractive(
                new Phaser.Geom.Rectangle(graphicsX, graphicsY, graphicsW, graphicsH),
                // TODO: Add type hinting
                (shape, x, y) => shape.contains(x, y),
            );

        const container = this.add.container();
        container.add(graphics);
        container.add(text);

        graphics.on("pointerdown", () => {
            audio.play();
        });
        text.on("pointerdown", () => {
            audio.play();
        });

        return { container };
    }

    #addItemOutlineImage() {
        const image = this.add.image(window.innerWidth / 2, window.innerHeight / 2, `${this.#assets[0]}-outline`);

        return image;
    }

    #addItemImage() {
        const renderTexture = this.add.renderTexture(
            window.innerWidth / 2,
            window.innerHeight / 2,
            // TODO: Add texture height/width here and remove resize
        );
        renderTexture.setVisible(false);

        const mask = renderTexture.createBitmapMask();

        const image = this.add.image(window.innerWidth / 2, window.innerHeight / 2, this.#assets[0]);
        image.setScale(this.#imageScale);
        image.setMask(mask);

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
