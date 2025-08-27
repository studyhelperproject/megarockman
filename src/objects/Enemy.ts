import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private speed = 100;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '');
    this.setSize(32, 32);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.setCollideWorldBounds(true);
    this.setVelocityX(this.speed);
  }

  update() {
    if (this.body.velocity.x === 0) {
        this.speed = -this.speed;
        this.setVelocityX(this.speed);
    }

    if (this.body.blocked.right) {
        this.setVelocityX(-this.speed);
    } else if (this.body.blocked.left) {
        this.setVelocityX(this.speed);
    }
  }
}
