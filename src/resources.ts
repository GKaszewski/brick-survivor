import {ImageSource, SpriteSheet} from "excalibur";
import sword from "./images/sword.png";
import player from "./images/Player.png";
import enemy from "./images/Enemy2.png";
import tileset from "./images/tileset.png";
import {TiledMapResource} from "@excaliburjs/plugin-tiled";

let Resources = {
    Sword: new ImageSource(sword)
    , Player: new ImageSource(player)
    , Enemy: new ImageSource(enemy)
    , Tileset: new ImageSource(tileset),
    Map: new TiledMapResource("src/maps/map.tmx")
};

const spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.Tileset,
    grid: {
        rows: 7,
        columns: 10,
        spriteWidth: 16,
        spriteHeight: 16
    },
    spacing: {
        originOffset: {x: 0, y: 0},
        margin: {x: 0, y: 0},
    }
});

export {Resources, spriteSheet};
