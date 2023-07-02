import {Actor, CollisionType, Logger, Scene, Sprite, Trigger, vec} from "excalibur";
import {spriteSheet} from "./resources";
import {Player} from "./player";
import {Gun} from "./gun";

export enum PickupType {
    Range,
    Damage,
    Health,
}

export class Pickup extends Actor {
    private sprite: Sprite | null;
    private pickupTrigger: Trigger;
    constructor(private type: PickupType, private player: Player, private gun: Gun) {
        super({
            width: 32,
            height: 32,
            collisionType: CollisionType.Passive,
        });

        const position = this.getRandomPosition();
        this.pos = vec(position.x, position.y);
        this.sprite = spriteSheet.getSprite(8, 3);
        this.sprite.scale = vec(2, 2);

        this.pickupTrigger = new Trigger({
            width: 32,
            height: 32,
            pos: this.pos,
            target: this.player,
            action: () => {
                this.pickup();
            }
        });
    }

    private getRandomPosition() {
        return {
            x: Math.random() * (1280 - 32),
            y: Math.random() * (720 - 32),
        }
    }

    public onInitialize() {
        this.graphics.add(this.sprite!);

        this.player.game.currentScene.add(this.pickupTrigger);
    }

    public update(engine, delta) {
        super.update(engine, delta);
    }

    onPostKill(_scene: Scene) {
        super.onPostKill(_scene);
        Logger.getInstance().info("Pickup killed");
        this.player.game.currentScene.remove(this.pickupTrigger);
    }

    private pickup() {
        switch (this.type) {
            case PickupType.Range:
                this.gun.increaseRange(20);
                Logger.getInstance().info("Range increased");
                Logger.getInstance().info("Range: ", this.gun.getRange());
                break;
            case PickupType.Damage:
                this.gun.increaseDamage(5);
                Logger.getInstance().info("Damage increased");
                break;
            case PickupType.Health:
                this.player.heal(5);
                Logger.getInstance().info("Player healed");
                break;
        }

        this.kill();
        this.player.game.remove(this)
    }
}
