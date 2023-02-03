// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
import { BoxTag } from "../../tag/BoxTag";
import Buff from "./Buff";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MagicMushroom extends Buff {
  @property
  moveSpeed = 50;

  rig: cc.RigidBody = null;

  direction = 1;

  protected onLoad(): void {
    this.rig = this.getComponent(cc.RigidBody);
    cc.tween(this.node)
      .by(1, { y: 20 })
      .call(() => {
        this.rig.type = cc.RigidBodyType.Dynamic;
      })
      .start();
  }

  protected update(dt: number): void {
    let rig = this.getComponent(cc.RigidBody);
    let currVelocity = rig.linearVelocity;
    currVelocity.x = this.moveSpeed * this.direction;
    rig.linearVelocity = currVelocity;
  }

  onCollisionEnter(other: cc.PhysicsCollider, self: cc.PhysicsCollider) {
    switch (other.tag) {
      case BoxTag.WALL:
        this.direction *= -1;
        break;
      case BoxTag.MARIO_BODY:
        this.node.destroy();
        cc.systemEvent.emit("addScore", this.score);
        break;
    }
  }
}
