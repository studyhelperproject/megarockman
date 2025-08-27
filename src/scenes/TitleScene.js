class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        this.add.text(400, 250, 'Rockman Clone', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        const startButton = this.add.text(400, 350, 'Start Game', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        startButton.setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

export default TitleScene;
