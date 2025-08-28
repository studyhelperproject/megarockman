import selectAudio from '../assets/select.ogg';

class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    preload() {
        // Sound effect from https://opengameart.org/content/8-bit-retro-sfx
        // Credit to MouthlessGames
        this.load.audio('select', selectAudio);
    }

    create() {
        this.sound.play('select');

        this.add.text(400, 250, 'Rockman Clone', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        const startButton = this.add.text(400, 350, 'Start Game', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        startButton.setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

export default TitleScene;
