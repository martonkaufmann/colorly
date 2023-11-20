import Phaser from "phaser";
import { ASSETS, IMAGE_SIZE } from "../constants";

export default class SelectColorLevel extends Phaser.Scene {
    constructor() {
        super("SelectColorLevel");
    }

    preload() {
        for (const asset of ASSETS) {
            this.load.image(asset, `${asset}.png`);
        }
    }

    create() {
        let initialPositionY = 0;
        let totalDistanceY = 0;
        const cellPerRow = 3;
        const cellSize = window.innerWidth / cellPerRow;
        const imageMargin = 15;
        const imageScale = (cellSize - imageMargin * 2) / IMAGE_SIZE;
        const camera = this.cameras.main;
        const itemList = this.add.group({
            key: ASSETS,
            repeat: 0,
            setOrigin: {
                x: 0,
                y: 0,
            },
            setScale: {
                x: imageScale,
                y: imageScale,
            },
            gridAlign: {
                x: imageMargin,
                y: imageMargin,
                width: 3,
                cellWidth: cellSize,
                cellHeight: cellSize,
            },
        });
        const maxCameraScrollY =
            Math.ceil(itemList.children.entries.length / cellPerRow) * cellSize - window.innerHeight;

        // TODO: Add type hinting
        itemList.children.each((item, index) => {
            item.setInteractive();
            // Fires before the global pointer up event listener
            item.on(Phaser.Input.Events.POINTER_UP, () => {
                if (totalDistanceY !== camera.scrollY) {
                    return;
                }

                this.sound.get("menu").stop();

                this.scene.start("Color", {
                    assets: [...ASSETS.slice(index, -1), ...ASSETS.slice(0, index)],
                });
            });
        });

        // TODO: Add type hinting
        this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
            initialPositionY = pointer.position.y;
        });

        // TODO: Add type hinting
        this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer) => {
            if (false === pointer.isDown) {
                return;
            }

            const distanceY = totalDistanceY + initialPositionY - pointer.position.y;

            camera.scrollY = distanceY;
        });

        // TODO: Add type hinting
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            console.log("input pu");
            if (camera.scrollY < 0) {
                camera.scrollY = 0;
            }

            if (camera.scrollY > maxCameraScrollY) {
                camera.scrollY = maxCameraScrollY;
            }

            totalDistanceY = camera.scrollY;
            initialPositionY = 0;
        });
    }
}
