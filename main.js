import Phaser from "phaser";
import StartGame from "./src/scenes/StartGame";
import Color from "./src/scenes/Color";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [StartGame, Color],
//    scene: [Color],
//    scene: [StartGame],
    audio: {
        disableWebAudio: true,
    },
    backgroundColor: "#fff7b4",
});

