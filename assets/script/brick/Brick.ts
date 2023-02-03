// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { BoxTag } from "../tag/BoxTag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Brick extends cc.Component {
  @property
  moveDistance = 5;

  move() {
    cc.tween(this.node)
      .by(0.1, { y: this.moveDistance })
      .by(0.1, { y: -this.moveDistance })
      .start();
  }
}
