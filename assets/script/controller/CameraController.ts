// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Game from "../Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Camera extends cc.Component {
  @property(cc.Node)
  cameraNode: cc.Node = null;
  @property(Game)
  game: Game = null;

  protected update(dt: number): void {
    let playerWorldPos = this.game.mario.node.convertToWorldSpaceAR(
      cc.v2(0, 0)
    );
    let cameraWorldPos = this.cameraNode.convertToWorldSpaceAR(cc.v2(0, 0));
    // 跟随主角前进
    if (playerWorldPos.x > cameraWorldPos.x) {
      this.cameraNode.x += playerWorldPos.x - cameraWorldPos.x;
    }
    // 阻止主角后退
    let worldMinX = cameraWorldPos.x - cc.winSize.width / 2;
    let minX = this.game.mario.node.parent.convertToNodeSpaceAR(
      cc.v2(worldMinX, 0)
    ).x;
    let playerHalfWidth = this.game.mario.node.width / 2;
    if (playerWorldPos.x - playerHalfWidth <= worldMinX) {
      this.game.mario.node.x = minX + playerHalfWidth;
    }
  }
}
