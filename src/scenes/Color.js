import Phaser from "phaser";
import { BACKGROUND_IMAGE_SIZE_DIVIDER, IMAGE_SIZE } from "../constants";
import i18next from "i18next";

export default class Color extends Phaser.Scene {
    //#MAX_STROKE_COUNT = 10;
    #MAX_STROKE_COUNT = 30;

    /** @type Phaser.GameObjects.Layer */
    #drawingLayer;
    /** @type Phaser.GameObjects.Layer */
    #uiLayer;
    /** @type Phaser.GameObjects.Layer */
//    #backgroundLayer;

    #assets = {
        "strawberry-detect": "public/assets/strawberry_detect.svg",        
        "strawberry-outline": "public/assets/strawberry_outline.svg",
        "strawberry-colors": "public/assets/strawberry_colors.svg",
        "strawberry-outline-white": "public/assets/strawberry_outline_white.svg",
    };

    constructor() {
        super("Color");
    }

    preload() {
        for (const [name, path] of Object.entries(this.#assets)) {
            this.load.svg(name, path);
        }

        this.load.image("strawberry", "public/assets/strawberry.png")
        this.load.image("corn", "public/assets/corn.png")
        this.load.image("brush", "public/assets/brush.png")

//        this.load.svg("strawberry-outline-white", "public/assets/strawberry_outline_white.svg");
        this.load.audio("strawberry", [
            "public/assets/audio/HU_strawberry.mp3",
            "public/assets/audio/HU_strawberry.ogg",
        ]);
    }

    create() {

this.#createBackground()
//        this.#backgroundLayer = this.add.layer();
        this.#drawingLayer = this.add.layer();
        this.#uiLayer = this.add.layer();

        const rope = new Phaser.GameObjects.Rope(
            this,
            window.innerWidth / 2,
            window.innerHeight / 2,
            "strawberry",
        )


        const mask = new Phaser.GameObjects.Image(
            this,
            window.innerWidth / 2,
            window.innerHeight / 2,
            "corn",
        );
 //       mask.setAlpha(0)
//        mask.scale = 0.8;

        rope.setMask(rope.createBitmapMask(mask))


//        const mask = new 

        this.#uiLayer.add(mask)
        this.#uiLayer.add(rope)
//        this.#uiLayer.add(mask)

return;



        const outlineImage = this.#createItemOutlineImage()

        this.#uiLayer.add(this.#createItemNameText());
        this.#uiLayer.add(outlineImage);
        /*
        for (const image of this.#createBackground().getChildren()) {
          this.#backgroundLayer.add(image);
        }
        */

/*
console.log(outlineImage.displayWidth)
console.log(outlineImage.displayHeight)
console.log(outlineImage.width)
console.log(outlineImage.height)
*/

//console.log(outlineImage.x)
//console.log(outlineImage.y)
//console.log(outlineImage.getTopRight())
//console.log(outlineImage.getTopLeft())
//console.log(outlineImage.getBottomRight())

        const tl = outlineImage.getTopLeft()
        const br = outlineImage.getBottomRight()    
        /*
        const tl = outlineImage.getTopLeft()
        console.log(tl)
        console.log(tl.x, tl.y)
        const graphics1 = new Phaser.GameObjects.Graphics(this);
        graphics1.fillStyle(0x2266aa)
        graphics1.fillPointShape(new Phaser.Geom.Point(tl.x, tl.y), 25)
        this.#uiLayer.add(graphics1)

        const br = outlineImage.getBottomRight()    
        console.log(br)
        console.log(br.x, br.y)
        const graphics2 = new Phaser.GameObjects.Graphics(this);
        graphics2.fillStyle(0x2266aa)
        graphics2.fillPointShape(new Phaser.Geom.Point(br.x, br.y), 25)
        this.#uiLayer.add(graphics2)
        */

        console.log(tl)
        console.log(br)
        console.log(new Date())


        const pixels = [];
        const renderer = this.sys.renderer;

//        for (let x = tl.x; x < br.x; x++) {
//            for (let y = tl.y; y < br.y; y++) {
//                outlineImage.getPix
//                console.log(x, y)
//                this.imag
                //
 //               this.textures.get                
//                const pixelColor = this.textures.getPixel(x, y, "strawberry-detect")

//                if (pixelColor === )

   //             if (pixelColor?.red === 255 && pixelColor?.blue === 255) {
//                    console.log('Detected at: ', x, y)
       //         }

//                console.log(this.textures.getPixel(x, y, "strawberry-detect"))
                /*
                renderer.snapshotPixel(x, y, function(p) {
                    console.log(p)
                })
                */
                
//            }
//        }

        console.log(new Date())
  
/*
                const renderer = this.sys.renderer

                renderer.snapshotArea(tl.x, tl.y, outlineImage.displayWidth, outlineImage.displayHeight, function(image) {
                    console.log('area snapshot created')
                    console.log(image)
            console.log(image.src)
                })
*/                
        /*
                renderer.snapshotPixel(200, 200, function(pixel) {
                    console.log('pixel snapshot created')
                    console.log(pixel)
                })
                */

        let strokeCount = 0;
        let isDrawing = false;
        /** @type Phaser.GameObjects.Graphics */
        let graphic;
        let coordinates = [];

        // TODO: move drawing to separate function
        const createGraphic = (x, y) => {
            // TODO: Create and add two graphics one
            // for future use and move previous future one
            // to be current one
            graphic = new Phaser.GameObjects.Graphics(this);
            graphic.lineStyle(24, 0xf44335, 1);
            //           graphic.lineStyle(4, 0xf44335, 1);
            graphic.beginPath();
            graphic.moveTo(x, y);

            this.#drawingLayer.add(graphic);

            //            console.log("createGraphic")
        };

        this.input.on("pointerdown", (pointer) => {
            isDrawing = true;

            coordinates.push(new Phaser.Geom.Point(pointer.x, pointer.y));

            createGraphic(pointer.x, pointer.y);
        });

        this.input.on("pointerup", (pointer) => {
            if (isDrawing) {
                // coordinates.push([pointer.x, pointer.y])

                coordinates.push(new Phaser.Geom.Point(pointer.x, pointer.y));

                graphic.lineTo(pointer.x, pointer.y);
                graphic.strokePath();

                //            console.log(coordinates)

                //                const g = new Phaser.GameObjects.Graphics(this);
                //                g.moveTo(0, 0);
                //                g.beginPath();
                //                g.lineStyle(2, 0xfff, 1);
                //                g.fillStyle(0xfff)
                //           g.strokePoints(coordinates)

                //                const p = new Phaser.Geom.Polygon(coordinates);
                //                console.log("coordinates", coordinates);
                //                console.log("area", p.area);
                //              console.log(p.calculateArea())
                //                console.log(p.area)

                //                const simplified = Phaser.Geom.Polygon.Simplify(p);

                //                console.log("perimiter", Phaser.Geom.Polygon.Perimeter(p));
                //                console.log("smoothed", Phaser.Geom.Polygon.Smooth(p));
                //                console.log("simplified", simplified);
                //                console.log("simplified perimiter", Phaser.Geom.Polygon.Perimeter(simplified));
                //                console.log(simplified.points)
                //               console.log(sim)

                //                g.strokePoints(simplified.points);
                //                g.cal
                //                g.fillPoint(coordinates)
                //                this.#drawingLayer.add(g);
            }

            coordinates = [];
            isDrawing = false;
        });

        this.input.on("pointermove", (pointer) => {
            if (isDrawing) {
                graphic.lineTo(pointer.x, pointer.y);
                graphic.strokePath();

                coordinates.push(new Phaser.Geom.Point(pointer.x, pointer.y));

                //   coordinates.push([pointer.x, pointer.y])

                if (strokeCount === this.#MAX_STROKE_COUNT) {
                    createGraphic(pointer.x, pointer.y);
                    strokeCount = 0;
                }

                //const bm = new Phaser.Display.Masks.BitmapMask(this, graphic) 
  //              const texture = graphic.generateTexture('graphic')

//                this.sys.renderer.snapshotArea
/*
                const dt = new Phaser.Textures.DynamicTexture(
                    this.sys.textures,
                    'graphic',
                )
                */
//                const img = new Phaser.GameObjects.Image(this, 0, 0, 'graphic')

  //              const sprite = new Phaser.GameObjects.Sprite(this, x, y, 'graphic')

    //            console.log(bm); 
//                console.log(img.createBitmapMask())
//                console.log(img.createBitmapMask().bitmapMask)

//                console.log(dt)
//                console.log(dt.getDataSourceImage('graphic'))
//                console.log(bm.bitmapMask);


                strokeCount++;

//                console.log("pointermove");
            }
        });
    }

    #createBackground() {
        const backgroundImageSize = IMAGE_SIZE / BACKGROUND_IMAGE_SIZE_DIVIDER;
        const backgroundImageMargin = 10;
        const verticalCount = Math.ceil(window.innerHeight / backgroundImageSize);
        const horizontalCount = Math.ceil(window.innerWidth / backgroundImageSize);

        // TODO: Group creates it's own layer, handle this
        return new Phaser.GameObjects.Group(this, {
            key: "strawberry-outline-white",
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
    }

    #createItemNameText() {
        const name = i18next.t("strawberry");
        const itemNameText = new Phaser.GameObjects.Text(this, 0, 0, name.charAt(0).toUpperCase() + name.slice(1), {
            fontSize: "48px",
            fontStyle: "900",
            fill: "#fff",
            stroke: "#000",
            strokeThickness: 3,
        });
        itemNameText.setInteractive();
        itemNameText.setX(window.innerWidth / 2 - itemNameText.displayWidth / 2);
        itemNameText.setY(itemNameText.displayHeight - 20);
        itemNameText.on("pointerdown", () => {
            // TODO: Inspect if it can be done better
            this.sound.add("strawberry").play();
        });

        return itemNameText;
    }

    #createItemOutlineImage() {
        const itemOutlineImage = new Phaser.GameObjects.Image(
            this,
            window.innerWidth / 2,
            window.innerHeight / 2,
            "strawberry-outline",
        );
        itemOutlineImage.scale = 0.8;
//        itemOutlineImage.

        return itemOutlineImage;
    }
}
