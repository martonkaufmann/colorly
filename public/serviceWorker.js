// TODO: Specify return type
const getCache = () => caches.open("colorly-global-cache");

// TODO: Read assets from global/common variable
const assets = [
    "coloring/fruits/apple",
    "coloring/fruits/banana",
    "coloring/fruits/carrot",
    "coloring/fruits/cauliflower",
    "coloring/fruits/strawberry",
    "coloring/fruits/corn",
    "coloring/fruits/grapes",
    "coloring/fruits/mushroom",
    "coloring/fruits/orange",
    "coloring/fruits/pear",
    "coloring/fruits/peas",
    "coloring/fruits/pineapple",
    "coloring/fruits/plum",
    "coloring/fruits/aubergine",
    "coloring/fruits/blueberries",
    "coloring/fruits/broccoli",
    "coloring/fruits/cherries",
    "coloring/fruits/coconut",
    "coloring/fruits/tomato",
    "coloring/critters/butterfly",
    "coloring/critters/caterpillar",
    "coloring/critters/dragonfly",
    "coloring/critters/ladybug",
    "coloring/critters/scorpion",
    "coloring/critters/snail",
    "coloring/critters/spider",
    "coloring/critters/worm",
];

const cacheAssets = async () => {
    const cache = await getCache();
    const assetsToCache = ["music/background.ogg", "audio/hooray.ogg", "brush.png", "play.png", "star.png"];

    for (const asset of assets) {
        assetsToCache.push(
            `${asset}.png`,
            `${asset}-outline.svg`,
            `${asset}-outline-white.svg`,
            `${asset}-filled.svg`,
            `audio/hu/${asset}.ogg`,
        );
    }

    await cache.addAll(assetsToCache);
};

// TODO: Specify request and response types
const cachedResponse = async (request) => {
    let response = await caches.match(request);

    if (response) {
        return response;
    }

    response = await fetch(request);

    const cache = await getCache();

    cache.put(request, response.clone());

    return response;
};

// TODO: Specify event type
self.addEventListener("install", (event) => {
    event.waitUntil(cacheAssets());
});

// TODO: Specify event type
self.addEventListener("fetch", (event) => {
    if (event.request.method === "POST") {
        return event.respondWith(fetch(event.request));
    }

    event.respondWith(cachedResponse(event.request));
});
