import {Actor, CollisionType, Engine, Input, vec} from "excalibur";
import {Resources} from "./resources";
import {IDamagable} from "./IDamagable";

export class Player extends Actor implements IDamagable {
    public health: number = 100;
    private speed: number = 100;

    constructor(public game: Engine) {
        //set player position to the center of the screen
        super({
            pos: vec(640, 360),
            width: 32,
            height: 64,
            collisionType: CollisionType.Active
        });
    }

    onInitialize() {
        this.graphics.add(Resources.Player.toSprite());
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

    private handleInput(engine: Engine, delta: number) {
        const deltaTime = 1 / delta;
        let dir = vec(0, 0);
        if (engine.input.keyboard.isHeld(Input.Keys.W)) {
            dir = dir.add(vec(0, -1));
        }

        if (engine.input.keyboard.isHeld(Input.Keys.S)) {
            dir = dir.add(vec(0, 1));
        }

        if (engine.input.keyboard.isHeld(Input.Keys.A)) {
            dir = dir.add(vec(-1, 0));
        }

        if (engine.input.keyboard.isHeld(Input.Keys.D)) {
            dir = dir.add(vec(1, 0));
        }

        if (dir.size > 0) {
            dir = dir.normalize().scale(this.speed * deltaTime);
            this.pos = this.pos.add(dir);
        }
    }

    public update(engine: Engine, delta: number) {
        this.handleInput(engine, delta)
    }
}
