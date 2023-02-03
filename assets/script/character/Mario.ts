// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
import { BoxTag } from "../tag/BoxTag";
import { MarioStateTag } from "../tag/MarioStateTag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Mario extends cc.Component {
  @property(cc.RigidBody)
  rig: cc.RigidBody = null;
  @property
  moveForce = 0;
  @property
  maxMoveVelocity = 0;
  @property
  jumpForce = 0;

  anim: cc.Animation = null;

  direction = 0;
  isJumpReady = true;
  isJumping = false;
  isDead = false;

  protected start(): void {
    this.anim = this.getComponent(cc.Animation);
    this.anim.play(MarioStateTag.IDLE);
  }

  jump() {
    if (this.isJumping || !this.isJumpReady) {
      return;
    }
    let currVelocity = this.rig.linearVelocity;
    currVelocity.y = 0;
    this.rig.linearVelocity = currVelocity;
    this.rig.applyForceToCenter(cc.v2(0, this.jumpForce), true);
    // 跳跃键被按下，在释放前，即使落地也不会继续跳跃
    this.isJumpReady = false;
    cc.systemEvent.emit("jump");
  }

  onJumpStart() {
    this.jump();
  }

  onJumpEnd() {
    if (this.isJumping) {
      this.rig.applyForceToCenter(cc.v2(0, -this.jumpForce / 3), true);
    }
    // 跳跃键已释放
    this.isJumpReady = true;
  }

  onMoveLeftStart() {
    this.direction = -1;
  }

  onMoveRightStart() {
    this.direction = 1;
  }

  onMoveEnd() {
    let currMoveForce = this.rig.linearVelocity;
    this.rig.applyForceToCenter(cc.v2(-currMoveForce.x * 8, 0), true);
    this.rig.linearVelocity = currMoveForce;
    this.direction = 0;
  }

  protected update(dt: number): void {
    if (this.isDead) {
      return;
    } else if (this.node.y < -cc.winSize.height) {
      this.lose();
      return;
    }
    if (this.direction != 0) {
      this.move(dt);
    }
  }

  move(dt: number) {
    if (Math.abs(this.rig.linearVelocity.x) >= this.maxMoveVelocity) {
      return;
    }
    if (this.isJumping) {
      this.rig.applyForceToCenter(
        cc.v2((this.direction * this.moveForce * dt) / 3, 0),
        true
      );
    } else {
      this.rig.applyForceToCenter(
        cc.v2(this.direction * this.moveForce * dt, 0),
        true
      );
    }
  }

  win() {
    cc.systemEvent.emit("win");
    cc.systemEvent.emit("over", true);
  }

  lose() {
    cc.systemEvent.emit("lose");
    cc.systemEvent.emit("over", false);
    this.isDead = true;
    cc.tween(this.node)
      .by(0.5, { y: 50 })
      .by(1, { y: -cc.winSize.height / 2 })
      .start();
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    // 抵达终点
    if (other.tag == BoxTag.FLAG) {
      this.win();
      // 吃到魔力菇
    } else if (
      self.tag == BoxTag.MARIO_BODY &&
      other.tag == BoxTag.MAGIC_MUSHROOM
    ) {
      cc.systemEvent.emit("changeMario");
      // 脚踩敌人
    } else if (self.tag == BoxTag.MARIO_FOOT && other.tag == BoxTag.ENEMY) {
      this.isJumping = false;
      this.isJumpReady = true;
      this.jumpForce /= 2;
      this.jump();
      this.isJumping = true;
      this.isJumpReady = true;
      this.jumpForce *= 2;
    }
  }

  onCollisionStay(other: cc.Collider, self: cc.Collider) {
    switch (self.tag) {
      case BoxTag.MARIO_FOOT:
        if (other.tag == BoxTag.GROUND) {
          this.isJumping = false;
        }
        break;
      case BoxTag.MARIO_BODY:
        if (other.tag == BoxTag.ENEMY) {
          this.lose();
        }
        break;
      case BoxTag.SUPER_MARIO_BODY:
        if (other.tag == BoxTag.ENEMY) {
          cc.systemEvent.emit("changeMario");
          break;
        }
    }
  }

  onCollisionExit(other: cc.Collider, self: cc.Collider) {
    if (self.tag == BoxTag.MARIO_FOOT && other.tag == BoxTag.GROUND) {
      this.isJumping = true;
    }
  }
}
