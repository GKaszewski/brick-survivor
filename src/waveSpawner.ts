import {Actor, Engine, Logger, Timer, vec} from "excalibur";
import {Enemy} from "./enemy";
import {Player} from "./player";

export class WaveSpawner extends Actor {
    public currentWave: number = 0;
    private spawnEnemiesTimer: Timer;
    private spawnWaveTimer: Timer;
    constructor(private game: Engine, private player: Player, private waves: number, private enemiesPerWave: number, private enemies: Enemy[], private timePerWave: number, private timeBetweenEnemies: number) {
        super();

        this.spawnEnemiesTimer = new Timer({
            interval: this.timeBetweenEnemies,
            fcn: () => {
                for (let i = 0; i < this.enemiesPerWave; i++) {
                    this.spawnEnemy();
                }
            },
            repeats: true,
        });

        this.spawnWaveTimer = new Timer({
            interval: this.timePerWave,
            fcn: () => {
                this.spawnWave();
            },
            repeats: true,
        });

        this.game.currentScene.add(this.spawnEnemiesTimer);
        this.game.currentScene.add(this.spawnWaveTimer);
    }

    public onInitialize() {
        this.spawnWave()
        this.spawnWaveTimer.start();
    }

    update(engine: Engine, delta: number) {
        super.update(engine, delta);

        if (this.currentWave > this.waves) {
            this.spawnEnemiesTimer.stop();
            this.spawnWaveTimer.stop();
            Logger.getInstance().info("All waves completed");
        }
    }

    private spawnWave() {
        this.currentWave++;
        this.spawnEnemiesTimer.start();
        Logger.getInstance().info("Starting wave " + this.currentWave);
    }

    private spawnEnemy() {
        const spawnpoint = vec(0, 0)
        spawnpoint.x = Math.random() * this.game.drawWidth;
        spawnpoint.y = Math.random() * this.game.drawHeight;
        const enemy = new Enemy(spawnpoint, this.player, this.game);
        this.game.add(enemy);
        this.enemies.push(enemy);
        Logger.getInstance().info("Spawned enemy at " + spawnpoint.x + ", " + spawnpoint.y);
    }
}
