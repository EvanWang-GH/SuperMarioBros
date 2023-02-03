// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { BoxTag } from "../tag/BoxTag";
import Brick from "./Brick";
import Buff from "./buff/Buff";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MysteryBlock extends Brick {
  @property(cc.SpriteFrame)
  emptySpriteFrame: cc.SpriteFrame = null;
  sprite: cc.Sprite = null;

  hp = 0;

  protected onLoad(): void {
    this.hp = this.node.childrenCount - 1;
    this.sprite = this.node.getChildByName("Sprite").getComponent(cc.Sprite);
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
    if (
      other.tag == BoxTag.MARIO_HEAD ||
      other.tag == BoxTag.SUPER_MARIO_HEAD
    ) {
      if (this.hp > 0) {
        --this.hp;
        if (this.hp == 0) {
          this.sprite.spriteFrame = this.emptySpriteFrame;
        }
        super.move();
        this.scheduleOnce(() => {
          let childrenBuffs: Buff[] = this.node.getComponentsInChildren(Buff);
          if (childrenBuffs[0]) {
            childrenBuffs[0].node.active = true;
          }
        }, 0.2);
      }
    }
  }
}
