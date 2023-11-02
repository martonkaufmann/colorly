import { defineConfig } from "vite";

export default defineConfig(({command, mode, ssrBuild}) => {
    if (command === "build") {
        return {
            base: "/colorly/"
        }
    }

    return {}
})
