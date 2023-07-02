import {Actor, Engine, Logger, Timer} from "excalibur";
import {Pickup, PickupType} from "./pickup";
import {Player} from "./player";
import {Gun} from "./gun";

export class PickupSpawner extends Actor {
    private spawnTimer: Timer;
    constructor(private game: Engine, private player: Player, private gun: Gun) {
        super();

        this.spawnTimer = new Timer({
            interval: 2500,
            fcn: () => {
                const randomNumber = Math.random();
                if (randomNumber < 0.1) {
                    this.spawnPickup();
                }
            },
            repeats: true,
        });

        this.game.currentScene.add(this.spawnTimer);
    }

    private getRandomPickupType(): PickupType {
        return Math.floor(Math.random() * 3);
    }

    private spawnPickup() {
        Logger.getInstance().info("Spawning pickup");
        const pickupType = this.getRandomPickupType();
        const pickup = new Pickup(pickupType, this.player, this.gun);
        this.game.add(pickup);
    }

    public onInitialize() {
        this.spawnPickup();
        this.spawnTimer.start();
    }
}
