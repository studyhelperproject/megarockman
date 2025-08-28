import Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'spritesheet');
    this.setSize(8, 8);
  }

  fire(x: number, y: number, velocityX: number, velocityY: number, frame: string | number) {
    this.setTexture('spritesheet', frame);
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocity(velocityX, velocityY);
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
