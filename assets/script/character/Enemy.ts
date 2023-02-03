// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { BoxTag } from "../tag/BoxTag";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
  @property
  moveSpeed = 0;
  @property
  score = 100;

  rig: cc.RigidBody;

  direction = -1;

  protected onLoad(): void {
    this.rig = this.node.getComponent(cc.RigidBody);
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    switch (other.tag) {
      case BoxTag.WALL:
        this.direction *= -1;
        break;
      case BoxTag.MARIO_FOOT:
        this.node.destroy();
        cc.systemEvent.emit("addScore", this.score);
        break;
    }
  }

  move(): void {
    let currVelocity = this.rig.linearVelocity;
    currVelocity.x = this.moveSpeed * this.direction;
    this.rig.linearVelocity = currVelocity;
  }
}
