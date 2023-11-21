import Phaser from "phaser";
import { ASSETS } from "../constants";
import i18next from "i18next";

export default class StartGame extends Phaser.Scene {
    #backgroundImages = {
        "start-play-bg-apple": "coloring/fruits/apple-outline-white.svg",
        "start-play-bg-banan": "coloring/fruits/banana-outline-white.svg",
        "start-play-bg-pear": "coloring/fruits/pear-outline-white.svg",
        "start-play-bg-grapges": "coloring/fruits/grapes-outline-white.svg",
        "start-play-bg-mushroom": "coloring/fruits/mushroom-outline-white.svg",
        "start-play-bg-strawberry": "coloring/fruits/strawberry-outline-white.svg",
        "start-play-bg-pineapple": "coloring/fruits/pineapple-outline-white.svg",
        "start-play-bg-corn": "coloring/fruits/corn-outline-white.svg",
    };

    constructor() {
        super("StartGame");
    }

    preload() {
        this.load.image("start-play", "play.png");

        this.load.audio("menu", [
            "music/menu.ogg",
            "music/menu.mp3",
        ]);

        for (const [name, image] of Object.entries(this.#backgroundImages)) {
            this.load.svg(name, image);
        }
    }

    create() {
        const menuMusic = this.sound.add("menu");
        menuMusic.play({ loop: true });
        menuMusic.setVolume(0.6);

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
            menuMusic.stop();

            this.scene.start("Color", {
                assets: [...ASSETS],
            });
        });

        const { container: selectColorLevelButton } = this.#addSelectColorLevelButton();
        selectColorLevelButton.setY(window.innerHeight / 2 + playButtonImage.displayHeight / 2 + 20);
    }

    #addSelectColorLevelButton() {
        const name = i18next.t("select_level");
        const text = this.add.text(0, 0, name.toUpperCase(), {
            fontSize: `16px`,
            fontStyle: "900",
            fill: "#000",
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
            .fillRoundedRect(graphicsX, graphicsY, graphicsW, graphicsH, 12)
            .setInteractive(
                new Phaser.Geom.Rectangle(graphicsX, graphicsY, graphicsW, graphicsH),
                // TODO: Add type hinting
                (shape, x, y) => shape.contains(x, y),
            );

        const container = this.add.container();
        container.add(graphics);
        container.add(text);

        graphics.on("pointerdown", () => {
            this.scene.start("SelectColorLevel");
        });
        text.on("pointerdown", () => {
            this.scene.start("SelectColorLevel");
        });

        return { container };
    }
}
