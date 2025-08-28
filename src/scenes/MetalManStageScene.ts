import BaseLevelScene from './BaseLevelScene';
import { Met } from '../objects/Met';
import { MetalMan } from '../objects/MetalMan';

export default class MetalManStageScene extends BaseLevelScene {
  constructor() {
    super('MetalManStageScene');
  }

  protected preloadLevelAssets(): void {
    this.load.tilemapTiledJSON('metal_man_map', 'assets/tilemaps/metal_man_level.json');
  }

  protected createLevel(): void {
    const map = this.make.tilemap({ key: 'metal_man_map' });
    const tileset = map.addTilesetImage('spritesheet', 'spritesheet');

    if (tileset) {
      const groundLayer = map.createLayer('Ground', tileset, 0, 0);
      if (groundLayer) {
        groundLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.enemies, groundLayer);
      }

      // Ladders for this level would be defined in its own json, but we reuse for now
      this.ladderLayer = map.createLayer('Ladders', tileset, 0, 0);
      if (this.ladderLayer) {
        // We'll need to add ladder tiles to metal_man_level.json for this to work
        this.ladderLayer.setTileIndexCallback(4, this.climbLadder, this);
        this.physics.add.overlap(this.player, this.ladderLayer);
      }
    }

    // Spawn a Met
    const met = new Met(this, 300, 500, this.enemyBullets);
    this.enemies.add(met);

    // Spawn Metal Man
    const metalMan = new MetalMan(this, 1400, 500, this.enemyBullets);
    this.enemies.add(metalMan);
  }
}
