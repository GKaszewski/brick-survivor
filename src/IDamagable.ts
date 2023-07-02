export interface IDamagable {
    health: number;
    getHealth(): number;
    takeDamage(damage: number): void;
    heal(heal: number): void;
}
