import {DisplayMode, Engine, Loader, Physics} from "excalibur";
import {Player} from "./player";
import {Resources} from "./resources";
import {Enemy} from "./enemy";
import {Gun} from "./gun";
import {WaveSpawner} from "./waveSpawner";
import {WaveUI} from "./waveUI";
import {PickupSpawner} from "./pickupSpawner";

class Game extends Engine {
    enemies: Enemy[] = [];
    waveSpawner: WaveSpawner;
    waveUI: WaveUI;

    constructor() {
        super({width: 1280, height: 720, maxFps: 60, displayMode: DisplayMode.FitScreen});
    }

    initialize() {
        const player = new Player(this);
        this.add(player);
        const gun = new Gun(player, this.enemies);
        this.add(gun);
        this.waveSpawner = new WaveSpawner(this, player, 5, 5, this.enemies, 30000, 4000);
        this.add(this.waveSpawner);
        this.waveUI = new WaveUI(this.waveSpawner.currentWave);
        this.add(this.waveUI);
        const pickupSpawner = new PickupSpawner(this, player, gun);
        this.add(pickupSpawner);

        const loader = new Loader([Resources.Player, Resources.Enemy, Resources.Tileset]);
        this.start(loader);
        this.currentScene.camera.strategy.radiusAroundActor(player, 200);
    }

    onPostUpdate(_engine: Engine, _delta: number) {
        super.onPostUpdate(_engine, _delta);
        this.enemies.forEach(enemy => {
            if (enemy.isKilled()) {
                this.remove(enemy);
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
            }
        })
        this.waveUI.wave = this.waveSpawner.currentWave;
    }
}
Physics.useArcadePhysics();
export const game = new Game();
game.initialize();
