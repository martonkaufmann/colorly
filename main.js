import Phaser from "phaser";
import StartGame from "./src/scenes/StartGame";
import Color from "./src/scenes/Color";
import i18next from "i18next";
import en from "./src/translations/en";
import hu from "./src/translations/hu";

i18next.init({
    lng: "hu", // if you're using a language detector, do not define the lng option
    debug: true,
    resources: {
        en: { translation: en },
        hu: { translation: hu },
    },
});

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [StartGame, Color],
    audio: {
        disableWebAudio: true,
    },
    backgroundColor: "#fff7b4",
});
