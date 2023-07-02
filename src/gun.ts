import {Actor, Engine, Logger, Scene, Sprite, Timer, vec} from "excalibur";
import {Player} from "./player";
import {spriteSheet} from "./resources";
import {Enemy} from "./enemy";

export class Gun extends Actor {
    private damage: number = 25;
    private bulletSpeed: number = 700;
    private range: number = 300;
    private sprite: Sprite | null;
    private readonly attackRate: number = 500;
    private readonly attackTimer: Timer;
    private bullets: Actor[] = [];
    private bulletSprite: Sprite | null;

    constructor(private player: Player, private enemies: Enemy[]) {
        super({
            width: 16,
            height: 16,
            pos: player.pos,
        });

        const gunSprite = spriteSheet.getSprite(7, 2)
        gunSprite.scale = vec(2, 2);
        this.sprite = gunSprite;

        const bulletSprite = spriteSheet.getSprite(8, 2);
        bulletSprite.scale = vec(2, 2);
        this.bulletSprite = bulletSprite;

        this.attackTimer = new Timer({
            interval: this.attackRate,
            fcn: () => {
                this.shoot();
            }
        });
    }

    onInitialize() {
        this.graphics.add(this.sprite!);
        this.player.game.currentScene.add(this.attackTimer);
    }

    onPreKill(_scene: Scene) {
        super.onPreKill(_scene);
        Logger.getInstance().info("Gun killed");
        this.player.game.currentScene.remove(this.attackTimer);
    }

    private rotateBulletTowardsVelocity(bullet: Actor) {
        const angle = bullet.vel.toAngle();
        bullet.rotation = angle + Math.PI / 2;
    }

    private shoot() {
        const closestEnemy = this.getClosestEnemy();
        if (!closestEnemy) return;

        const bullet = new Actor({
            width: 8,
            height: 8,
            pos: this.pos,
            vel: closestEnemy.pos.sub(this.pos).normalize().scale(this.bulletSpeed)
        });
        bullet.graphics.add(this.bulletSprite!);
        this.rotateBulletTowardsVelocity(bullet);

        bullet.on('precollision', (event) => {
            if (event.other instanceof Enemy) {
                event.other.takeDamage(this.damage);
                this.removeBullet(bullet);
            }
        });

        this.bullets.push(bullet);
        this.player.game.add(bullet);
        this.player.game.currentScene.camera.shake(5, 5, 100);

    }

    private getClosestEnemy(): Enemy | null {
        let closestEnemy: Enemy | null = null;
        let closestDistance: number = this.range;
        this.enemies.forEach(enemy => {
            const distance = this.pos.distance(enemy.pos);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });

        return closestEnemy;
    }

    private removeBullet(bullet: Actor) {
        bullet.kill();
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
        this.player.game.remove(bullet);
    }

    update(engine: Engine, delta: number) {
        super.update(engine, delta);
        this.pos = this.player.pos;

        if (this.enemies.some(enemy => this.pos.distance(enemy.pos) <= this.range)) {
            this.attackTimer.start();
        } else {
            this.attackTimer.stop();
        }

        this.bullets.forEach(bullet => {
            if (bullet.isOffScreen) {
                this.removeBullet(bullet)
            }
        });
    }

    public increaseDamage(amount: number) {
        this.damage += amount;
    }

    public increaseRange(amount: number) {
        this.range += amount;
    }

    public getRange(): number {
        return this.range;
    }

    public getDamage(): number {
        return this.damage;
    }
}
