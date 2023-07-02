import {Color, Label} from "excalibur";

export class WaveUI extends Label {
    constructor(public wave: number) {
        super({
            x: 1280 / 2,
            y: 50,
        });

        this.text = "Wave " + this.wave;
        this.font.size = 50;
        this.color = Color.White;
    }

    public onInitialize() {

    }

    public update(engine, delta) {
        super.update(engine, delta);
        this.text = "Wave " + this.wave;
    }
}
