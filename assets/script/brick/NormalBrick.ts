// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { BoxTag } from "../tag/BoxTag";
import Brick from "./Brick";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NormalBrick extends Brick {
  @property score = 50;

  onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
    if (other.tag == BoxTag.MARIO_HEAD) {
      super.move();
    } else if (other.tag == BoxTag.SUPER_MARIO_HEAD) {
      cc.systemEvent.emit("addScore", this.score);
      this.node.destroy();
    }
  }
}
