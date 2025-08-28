import * as Phaser from 'phaser';

export default class HUDScene extends Phaser.Scene {
  private healthBar!: Phaser.GameObjects.Graphics;
  private maxHealth: number = 28;
  private currentHealth: number = 28;

  constructor() {
    super({ key: 'HUDScene' });
  }

  create() {
    // Get a reference to the GameScene
    const gameScene = this.scene.get('GameScene');

    // Listen for the 'healthChanged' event from the GameScene
    gameScene.events.on('healthChanged', this.handleHealthChanged, this);

    // Draw the initial health bar
    this.healthBar = this.add.graphics();
    this.drawHealthBar();
  }

  private handleHealthChanged(health: number) {
    this.currentHealth = health;
    this.drawHealthBar();
  }

  private drawHealthBar() {
    this.healthBar.clear();

    // Background of the health bar
    this.healthBar.fillStyle(0x808080); // Grey
    this.healthBar.fillRect(20, 20, 200, 20);

    // Foreground (the actual health)
    this.healthBar.fillStyle(0x00ff00); // Green
    const healthPercentage = this.currentHealth / this.maxHealth;
    this.healthBar.fillRect(20, 20, 200 * healthPercentage, 20);

    // Border
    this.healthBar.lineStyle(2, 0xffffff); // White
    this.healthBar.strokeRect(20, 20, 200, 20);
  }
}
