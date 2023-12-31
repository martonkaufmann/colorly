import Phaser from "phaser";
import StartGame from "./src/scenes/StartGame";
import Color from "./src/scenes/Color";
import i18next from "i18next";
import en from "./src/translations/en";
import hu from "./src/translations/hu";
import SelectColorLevel from "./src/scenes/SelectColorLevel";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}serviceWorker.js`);
}

i18next.init({
    lng: "hu", // if you're using a language detector, do not define the lng option
    debug: true,
    resources: {
        en: { translation: en },
        hu: { translation: hu },
    },
});

window.addEventListener("load", () => {
    const game = new Phaser.Game({
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        scene: [StartGame, Color, SelectColorLevel],
        backgroundColor: "#fff7b4",
    });
});
