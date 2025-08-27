class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.add.text(400, 250, 'Game Over', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        const retryButton = this.add.text(400, 350, 'Retry', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        retryButton.setInteractive();

        retryButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });
    }
}

export default GameOverScene;
