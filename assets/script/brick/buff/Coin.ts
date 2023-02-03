// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
import Buff from "./Buff";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin extends Buff {
  protected onLoad(): void {
    cc.tween(this.node)
      .by(0.1, { y: 25 })
      .delay(0.5)
      .call(() => {
        this.node.destroy();
        cc.systemEvent.emit("addScore", this.score);
      })
      .start();
  }
}
