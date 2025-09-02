import * as Phaser from 'phaser';
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.ts';
import GameOverScene from './scenes/GameOverScene.js';
import MetalManStageScene from './scenes/MetalManStageScene.ts';
import HUDScene from './scenes/HUDScene.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [TitleScene, GameScene, GameOverScene, MetalManStageScene, HUDScene],
  loader: {
    baseURL: import.meta.env.BASE_URL,
  },
};

new Phaser.Game(config);
