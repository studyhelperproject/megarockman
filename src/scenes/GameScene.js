class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.add.text(400, 300, 'Game Scene - Press G for Game Over', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        this.input.keyboard.on('keydown-G', () => {
            this.scene.start('GameOverScene');
        });
    }
}

export default GameScene;
