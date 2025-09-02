import * as Phaser from 'phaser';
import { Bullet } from './Bullet';

enum MetState {
  Hiding,
  Attacking,
}

export class Met extends Phaser.Physics.Arcade.Sprite {
  private currentState: MetState = MetState.Hiding;
  private stateTimer: Phaser.Time.TimerEvent;
  private enemyBullets: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, enemyBullets: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 'met', 0); // Start with frame 0 (hiding)
    this.enemyBullets = enemyBullets;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.setCollideWorldBounds(true);

    // Initial state timer
    this.stateTimer = this.scene.time.addEvent({
      delay: this.getRandomWait(),
      callback: this.changeState,
      callbackScope: this,
      loop: true,
    });
  }

  private getRandomWait(): number {
      return Phaser.Math.Between(2000, 4000); // Wait 2-4 seconds
  }

  private changeState() {
    if (!this.active) {
        return;
    }

    if (this.currentState === MetState.Hiding) {
      this.currentState = MetState.Attacking;
      this.play('met_attack');
      this.fireBullets();
      this.stateTimer.delay = 1000; // Stay in attack state for 1 second
    } else {
      this.currentState = MetState.Hiding;
      this.play('met_idle');
      this.stateTimer.delay = this.getRandomWait();
    }
  }

  private fireBullets() {
    const bulletSpeed = 200;
    const angle = Phaser.Math.DegToRad(15); // 15 degrees spread

    // Straight
    const bullet1 = this.enemyBullets.get(this.x, this.y) as Bullet;
    if (bullet1) {
        bullet1.fire(this.x, this.y, bulletSpeed, 0, 2);
    }

    // Angled up
    const bullet2 = this.enemyBullets.get(this.x, this.y) as Bullet;
    if (bullet2) {
        const velocityX = bulletSpeed * Math.cos(angle);
        const velocityY = -bulletSpeed * Math.sin(angle);
        bullet2.fire(this.x, this.y, velocityX, velocityY, 2);
    }

    // Angled down
    const bullet3 = this.enemyBullets.get(this.x, this.y) as Bullet;
    if (bullet3) {
        const velocityX = bulletSpeed * Math.cos(angle);
        const velocityY = bulletSpeed * Math.sin(angle);
        bullet3.fire(this.x, this.y, velocityX, velocityY, 2);
    }
  }

  destroy(fromScene?: boolean) {
    this.stateTimer.destroy();
    super.destroy(fromScene);
  }
}
