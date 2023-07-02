import {Resources} from "./resources";
import {Actor, CollisionType, Engine, Logger, Scene, Timer, Vector} from "excalibur";
import {IDamagable} from "./IDamagable";
import {Player} from "./player";

export class Enemy extends Actor implements IDamagable {
    public health: number = 100;
    public speed: number = 100;
    private attackRate: number = 1000;
    private damage: number = 2;
    private readonly attackTimer: Timer;

    constructor(position: Vector, private player: Player, private game: Engine) {
        super({
            width: 32,
            height: 64,
            pos: position,
            collisionType: CollisionType.Active
        });

        this.attackTimer = new Timer({
            interval: this.attackRate,
            fcn: () => {
                this.attackPlayer();
            }
        });

        game.currentScene.add(this.attackTimer)
    }

    onInitialize() {
        this.graphics.add(Resources.Enemy.toSprite());
    }

    onPreKill(_scene: Scene) {
        super.onPreKill(_scene);
        Logger.getInstance().info("Enemy killed");
        this.game.currentScene.remove(this.attackTimer);
    }

    public getHealth(): number {
        return this.health;
    }

    public takeDamage(damage: number): void {
        this.health -= damage;
        if (this.health <= 0) {
            this.kill();
        }
    }

    public heal(heal: number): void {
        this.health += heal;
    }

    private followPlayer() {
        if (this.distanceToPlayer() > 33)
            this.vel = this.player.pos.sub(this.pos).normalize().scale(this.speed);
        else
            this.vel = Vector.Zero;
    }

    private distanceToPlayer() {
        return this.player.pos.sub(this.pos).size;
    }

    private attackPlayer() {
        this.player.takeDamage(this.damage);
        this.game.currentScene.camera.shake(15, 8, 100);
    }

    update() {
        this.followPlayer();
        if (this.distanceToPlayer() < 33) {
            this.attackTimer.start();
        } else {
            this.attackTimer.stop();
        }
    }
}
