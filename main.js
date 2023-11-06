import Phaser from "phaser";
import StartGame from "./src/scenes/StartGame";
import Color from "./src/scenes/Color";
import i18next from "i18next";
import en from "./src/translations/en";
import hu from "./src/translations/hu";

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
        /*
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        autoRound: false,
        zoom:1,
    },
    */
        scene: [StartGame, Color],
        backgroundColor: "#fff7b4",
    });
});

/*
window.addEventListener("resize", () => {
    console.log('resize start')
    
    console.log(
        window.innerWidth,
        window.innerHeight,
        game.config.width,
        game.config.height,
        game.canvas.style.width,
        game.canvas.style.height
    )


    window.setTimeout(() => {
    game.scale.resize(
        window.innerWidth, 
        window.innerHeight
    );
    game.canvas.style.width = `${window.innerWidth}px`
    game.canvas.style.height= `${window.innerHeight}px`
        game.config.width = window.innerWidth
        game.config.height = window.innerHeight

        console.log('resized')
    }, 2000)
    
});
*/
