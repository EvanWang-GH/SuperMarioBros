// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Mario from "./character/Mario";
import { BoxTag } from "./tag/BoxTag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property(Mario)
  mario: Mario = null;
  @property(cc.Prefab)
  superMarioPrefab: cc.Prefab = null;

  marioNodePool: cc.NodePool = null;

  @property
  time = 0;
  score = 0;

  collisionManager;
  physicsManager;

  protected onLoad(): void {
    this.collisionManager = cc.director.getCollisionManager();
    this.physicsManager = cc.director.getPhysicsManager();
    // 启用碰撞检测
    this.collisionManager.enabled = true;
    // 启用物理效果
    this.physicsManager.enabled = true;

    this.marioNodePool = new cc.NodePool();
    let superMario = cc.instantiate(this.superMarioPrefab);
    this.marioNodePool.put(superMario);

    // 切换主角形态
    cc.systemEvent.on("changeMario", () => {
      // 取消原本的绑定按键操
      cc.systemEvent.emit("unbindBtn");

      // 从节点池中取到新形态
      let newMarioNode = this.marioNodePool.get();
      let newMario = newMarioNode.getComponent(Mario);

      // 应用位置
      newMarioNode.setParent(this.mario.node.parent);
      newMarioNode.setPosition(this.mario.node.position);

      // 同步状态
      newMario.direction = this.mario.direction;
      newMario.isJumpReady = this.mario.isJumpReady;
      newMario.isJumping = this.mario.isJumping;

      // 旧形态放入节点池
      this.marioNodePool.put(this.mario.node);

      // 更新单例
      this.mario = newMario;

      // 重新绑定按键操控对象
      cc.systemEvent.emit("bindBtn", newMario);

      // 暂时关闭身体碰撞检测
      newMario.getComponents(cc.BoxCollider).forEach((collider) => {
        if (collider.tag == BoxTag.MARIO_BODY) {
          collider.enabled = false;
        }
      });
      // 稍后恢复
      this.scheduleOnce(() => {
        newMario.getComponents(cc.BoxCollider).forEach((collider) => {
          if (collider.tag == BoxTag.MARIO_BODY) {
            collider.enabled = true;
          }
        });
      }, 2);

      // 闪烁动画
      cc.tween(newMarioNode)
        .to(0.5, { opacity: 0 })
        .to(0.5, { opacity: 255 })
        .to(0.5, { opacity: 0 })
        .to(0.5, { opacity: 255 })
        .start();
    });

    // 结束游戏
    cc.systemEvent.on("over", (isWin: boolean) => {
      this.collisionManager.enabled = false;
      this.physicsManager.enabled = false;
      this.scheduleOnce(() => {
        if (isWin) {
          localStorage.setItem("score", this.score.toString());
          cc.director.loadScene("rank");
        } else {
          cc.director.loadScene("main");
        }
      }, 3);
    });
  }

  protected start(): void {
    cc.director.pause();
  }

  protected onDestroy(): void {
    cc.director.resume();
    cc.systemEvent.off("changeMario");
    cc.systemEvent.off("over");
  }
}
