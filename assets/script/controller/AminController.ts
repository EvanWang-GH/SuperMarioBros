// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { MarioStateTag } from "../tag/MarioStateTag";
import Game from "../Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnimControl extends cc.Component {
  @property(Game)
  game: Game = null;

  protected update(dt: number): void {
    let nextAnimName: string = null;
    if (this.game.mario.isDead) {
      nextAnimName = MarioStateTag.DEATH;
    } else {
      let isJumping = this.game.mario.isJumping;
      let isMoving = this.game.mario.rig.linearVelocity.x != 0;

      let keyDire = this.game.mario.direction;
      let moveDire = 0;
      let currX = this.game.mario.rig.linearVelocity.x;
      if (currX > 0) {
        moveDire = 1;
      } else if (currX < 0) {
        moveDire = -1;
      } else {
        moveDire = 0;
      }

      if (keyDire != 0) {
        this.game.mario.node.scaleX = keyDire;
      }

      if (!isJumping && !isMoving) {
        nextAnimName = MarioStateTag.IDLE;
      } else if (isJumping) {
        nextAnimName = MarioStateTag.JUMP;
      } else if (moveDire == keyDire) {
        if (Math.abs(currX) < 10) {
          return;
        }
        nextAnimName = MarioStateTag.RUN;
      } else if (moveDire != keyDire && keyDire != 0) {
        nextAnimName = MarioStateTag.SLIDE;
      }
    }
    let currAnimName = this.game.mario.anim.currentClip.name;
    if (currAnimName != nextAnimName) {
      this.game.mario.anim.play(nextAnimName);
    }
  }
}
