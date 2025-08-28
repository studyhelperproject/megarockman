import * as Phaser from 'phaser';
import { Bullet } from '../objects/Bullet';
import { Met } from '../objects/Met';

export default abstract class BaseLevelScene extends Phaser.Scene {
  protected player!: Phaser.Physics.Arcade.Sprite;
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected spaceKey!: Phaser.Input.Keyboard.Key;
  protected playerBullets!: Phaser.Physics.Arcade.Group;
  protected enemyBullets!: Phaser.Physics.Arcade.Group;
  protected enemies!: Phaser.Physics.Arcade.Group;
  protected playerDirection: number = 1;
  protected playerHealth: number = 28;
  protected isInvincible: boolean = false;
  protected ladderLayer?: Phaser.Tilemaps.TilemapLayer;
  protected onLadder: boolean = false;
  protected isOverlappingLadder: boolean = false;

  protected weaponEnergy: { [key: string]: number } = {};
  protected availableWeapons: string[] = ['buster'];
  protected currentWeaponIndex: number = 0;

  constructor(key: string) {
    super(key);
  }

  preload() {
    this.load.spritesheet('spritesheet', 'assets/spritesheet.png', { frameWidth: 16, frameHeight: 16 });
    this.preloadLevelAssets();
  }

  create() {
    this.cameras.main.setBackgroundColor('#1e1e1e');

    // Player
    this.player = this.physics.add.sprite(100, 500, 'spritesheet', 9).setCollideWorldBounds(true);
    this.player.setName('player');
    this.player.setGravityY(300);

    // Common Animations
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
    this.anims.create({
        key: 'met_idle',
        frames: [ { key: 'spritesheet', frame: 0 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'met_attack',
        frames: [ { key: 'spritesheet', frame: 1 } ],
        frameRate: 20
    });

    // Create level-specific content
    this.createLevel();

    // Player Bullets
    this.playerBullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 10,
        runChildUpdate: true
    });

    // Enemy Bullets
    this.enemyBullets = this.physics.add.group({
        classType: Bullet,
        runChildUpdate: true
    });

    // Enemies group
    this.enemies = this.physics.add.group({
        runChildUpdate: true,
    });

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.on('keydown-Q', this.switchWeapon, this);

    // Collisions
    this.physics.add.overlap(this.playerBullets, this.enemies, this.handleBulletEnemyCollision, undefined, this);
    this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, undefined, this);
    this.physics.add.collider(this.player, this.enemyBullets, this.handlePlayerEnemyCollision, undefined, this);

    // Launch HUD Scene
    this.scene.launch('HUDScene');
    this.events.emit('healthChanged', this.playerHealth);

    // Listen for events from other objects
    this.events.on('unlock_weapon', this.unlockWeapon, this);
  }

  protected abstract preloadLevelAssets(): void;
  protected abstract createLevel(): void;

  climbLadder() {
    this.isOverlappingLadder = true;
  }

  handleBulletEnemyCollision(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    bullet.destroy();
    // Use duck typing to check for a takeDamage method
    if ('takeDamage' in enemy && typeof (enemy as any).takeDamage === 'function') {
      (enemy as any).takeDamage(3);
    } else {
      enemy.destroy();
    }
  }

  handlePlayerEnemyCollision(player: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    if (this.isInvincible) {
      return;
    }

    this.playerHealth -= 5;
    this.events.emit('healthChanged', this.playerHealth);
    console.log(`Player health: ${this.playerHealth}`);

    if (this.playerHealth <= 0) {
      this.scene.start('GameOverScene');
      return;
    }

    this.isInvincible = true;

    const playerSprite = this.player;
    const knockbackDirection = Math.sign(playerSprite.x - (enemy as Phaser.Physics.Arcade.Sprite).x) || 1;
    playerSprite.setVelocity(knockbackDirection * 150, -150);

    const flashingTween = this.tweens.add({
      targets: this.player,
      alpha: 0.5,
      ease: 'Power1',
      duration: 100,
      yoyo: true,
      repeat: -1,
    });

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.isInvincible = false;
        flashingTween.stop();
        this.player.setAlpha(1.0);
      },
      callbackScope: this,
    });
  }

  update() {
    this.isOverlappingLadder = false;
    this.physics.world.overlap(this.player, this.ladderLayer);

    const canClimb = this.isOverlappingLadder;
    const isJumping = Phaser.Input.Keyboard.JustDown(this.cursors.up);

    if (this.onLadder) {
      this.player.body.setAllowGravity(false);
      this.player.setVelocityX(0);

      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-100);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(100);
      } else {
        this.player.setVelocityY(0);
      }

      if (isJumping || !canClimb) {
        this.onLadder = false;
        this.player.body.setAllowGravity(true);
      }

    } else {
      if (!this.player.body.allowGravity) {
          this.player.body.setAllowGravity(true);
      }

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

      if (isJumping && this.player.body.touching.down) {
          this.player.setVelocityY(-250);
      }

      if (canClimb && (this.cursors.up.isDown || this.cursors.down.isDown)) {
        this.onLadder = true;
        const tile = this.ladderLayer?.getTileAtWorldXY(this.player.x, this.player.y);
        if (tile) {
            this.player.x = tile.getCenterX();
        }
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.fireBullet();
    }
  }

  fireBullet() {
    const currentWeapon = this.availableWeapons[this.currentWeaponIndex];
    if (currentWeapon === 'buster') {
        const bullet = this.playerBullets.get(this.player.x, this.player.y) as Bullet;
        if (bullet) {
            const velocityX = 400 * this.playerDirection;
            bullet.fire(this.player.x, this.player.y, velocityX, 0, 3);
        }
    } else if (currentWeapon === 'metal_blade') {
        this.fireMetalBlade();
    }
  }

  fireMetalBlade() {
      // 8-way directional logic
      let velocityX = 0;
      let velocityY = 0;
      const speed = 400;

      if (this.cursors.up.isDown) velocityY = -1;
      if (this.cursors.down.isDown) velocityY = 1;
      if (this.cursors.left.isDown) velocityX = -1;
      if (this.cursors.right.isDown) velocityX = 1;

      if (velocityX === 0 && velocityY === 0) {
          // Default to firing in the direction player is facing
          velocityX = this.playerDirection;
      }

      const angle = Math.atan2(velocityY, velocityX);
      const finalVelocityX = Math.cos(angle) * speed;
      const finalVelocityY = Math.sin(angle) * speed;

      const bullet = this.playerBullets.get(this.player.x, this.player.y) as Bullet;
      if (bullet) {
          bullet.fire(this.player.x, this.player.y, finalVelocityX, finalVelocityY, 6); // Use frame 6 for metal blade
      }
  }

  switchWeapon() {
      this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.availableWeapons.length;
      const newWeapon = this.availableWeapons[this.currentWeaponIndex];
      console.log(`Switched to ${newWeapon}`);
  }

  unlockWeapon(weaponName: string) {
      if (!this.availableWeapons.includes(weaponName)) {
          this.availableWeapons.push(weaponName);
          this.weaponEnergy[weaponName] = 28; // Full energy
          console.log(`Unlocked ${weaponName}`);
      }
  }
}
