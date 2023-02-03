// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Enemy from "../character/Enemy";
import Game from "../Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyController extends cc.Component {
  @property(Game)
  game: Game = null;
  @property(cc.Node)
  enemiesNode: cc.Node = null;

  @property
  activeDistanceScale = 1;

  activeDistance: number = 0;

  protected onLoad(): void {
    this.activeDistance = cc.winSize.width * this.activeDistanceScale;
  }

  protected update(): void {
    this.enemiesNode.children.forEach((enemyNode) => {
      let enemyWorldX = enemyNode.convertToNodeSpaceAR(cc.v2(0, 0)).x;
      let marioWorldX =
        this.game.mario.node.convertToNodeSpaceAR(cc.v2(0, 0)).x *
        this.game.mario.node.scaleX;

      let distance = Math.abs(marioWorldX - enemyWorldX);
      if (distance <= this.activeDistance) {
        enemyNode.getComponent(Enemy).move();
      }
    });
  }
}
