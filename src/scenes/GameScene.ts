import * as Phaser from 'phaser';
import { Bullet } from '../objects/Bullet';
import { Enemy } from '../objects/Enemy';
import spritesheet from '../../assets/spritesheet.png';

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

  preload() {
    this.load.spritesheet('spritesheet', spritesheet, { frameWidth: 16, frameHeight: 16 });
  }

  create() {
    this.cameras.main.setBackgroundColor('#1e1e1e');

    // Player
    this.player = this.physics.add.sprite(400, 500, 'spritesheet', 9).setCollideWorldBounds(true);
    this.player.setGravityY(300);

    // Player Animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('spritesheet', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'spritesheet', frame: 9 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('spritesheet', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    // Ground
    const ground = this.add.rectangle(400, 580, 800, 40, 0x4d4d4d);
    this.physics.add.existing(ground, true);
    this.physics.add.collider(this.player, ground);

    // Enemies
    this.enemies = this.physics.add.group({
        classType: Enemy,
        runChildUpdate: true,
    });
    const enemy = new Enemy(this, 200, 500);
    enemy.setTexture('spritesheet', 0); // Use frame 0 for the enemy
    this.enemies.add(enemy);
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
        this.player.setVelocityX(-100);
        this.player.setFlipX(true);
        this.player.anims.play('left', true);
        this.playerDirection = -1;
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(100);
        this.player.setFlipX(false);
        this.player.anims.play('right', true);
        this.playerDirection = 1;
    } else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-250);
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
