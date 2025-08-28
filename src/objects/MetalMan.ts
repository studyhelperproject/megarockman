import * as Phaser from 'phaser';
import { Bullet } from './Bullet';
import BaseLevelScene from '../scenes/BaseLevelScene';

enum MetalManState {
  Jumping,
  Shooting,
}

export class MetalMan extends Phaser.Physics.Arcade.Sprite {
  private currentState: MetalManState = MetalManState.Jumping;
  private stateTimer: Phaser.Time.TimerEvent;
  private enemyBullets: Phaser.Physics.Arcade.Group;
  public health: number = 28;

  constructor(scene: Phaser.Scene, x: number, y: number, enemyBullets: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 'spritesheet', 5); // Using frame 5 as placeholder for Metal Man
    this.enemyBullets = enemyBullets;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.stateTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: this.changeState,
      callbackScope: this,
      loop: true,
    });
  }

  private changeState() {
    if (!this.active) return;

    if (this.currentState === MetalManState.Jumping) {
      this.currentState = MetalManState.Shooting;
      this.shoot();
      this.stateTimer.delay = 1500; // Time spent shooting
    } else {
      this.currentState = MetalManState.Jumping;
      this.jump();
      this.stateTimer.delay = 2000; // Time between jumps/actions
    }
  }

  private jump() {
      if (this.body.touching.down) {
          const jumpHeight = Phaser.Math.Between(200, 350);
          this.setVelocityY(-jumpHeight);

          const targetX = this.scene.children.getByName('player')?.x || this.x;
          const direction = Math.sign(targetX - this.x);
          this.setVelocityX(direction * 100);
      }
  }

  private shoot() {
    // Stop moving to shoot
    this.setVelocity(0, 0);

    // Fire a metal blade (just a regular bullet for now)
    const bullet = this.enemyBullets.get(this.x, this.y) as Bullet;
    if (bullet) {
        // Aim at player
        const target = this.scene.children.getByName('player');
        if (target) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
            const speed = 300;
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            bullet.fire(this.x, this.y, velocityX, velocityY, 6); // Frame 6 for metal blade
        }
    }
  }

  public takeDamage(damage: number) {
      this.health -= damage;
      if (this.health <= 0) {
          (this.scene as BaseLevelScene).unlockWeapon('metal_blade');
          this.destroy();
      }
  }

  destroy(fromScene?: boolean) {
    this.stateTimer.destroy();
    super.destroy(fromScene);
  }
}
