import Phaser from 'phaser';
import { Bullet } from '../objects/Bullet';
import { Enemy } from '../objects/Enemy';

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private bullets!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private playerDirection: number = 1; // 1 for right, -1 for left

  constructor() {
    super('GameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1e1e1e');

    // Player
    this.player = this.physics.add.sprite(400, 500, '').setSize(32, 48).setCollideWorldBounds(true);
    this.player.setGravityY(500);

    // Ground
    const ground = this.add.rectangle(400, 580, 800, 40, 0x4d4d4d);
    this.physics.add.existing(ground, true);
    this.physics.add.collider(this.player, ground);

    // Enemies
    this.enemies = this.physics.add.group({
        classType: Enemy,
        runChildUpdate: true,
    });
    this.enemies.add(new Enemy(this, 200, 500));
    this.physics.add.collider(this.enemies, ground);

    // Bullets
    this.bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 10,
        runChildUpdate: true
    });

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Collisions
    this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletEnemyCollision, undefined, this);
  }

  handleBulletEnemyCollision(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    bullet.destroy();
    enemy.destroy();
  }

  update() {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.playerDirection = -1;
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.playerDirection = 1;
    } else {
        this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-400);
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.fireBullet();
    }
  }

  fireBullet() {
    const bullet = this.bullets.get(this.player.x, this.player.y) as Bullet;
    if (bullet) {
        const velocityX = 400 * this.playerDirection;
        bullet.fire(this.player.x, this.player.y, velocityX);
    }
  }
}
