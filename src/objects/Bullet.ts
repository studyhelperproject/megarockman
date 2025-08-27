import Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '');
    this.setSize(8, 8);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }

  fire(x: number, y: number, velocityX: number) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityX(velocityX);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.x < 0 || this.x > this.scene.physics.world.bounds.width) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
