// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Mario from "../character/Mario";
import Game from "../Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InputController extends cc.Component {
  @property(Game)
  game: Game = null;

  @property(cc.Node)
  leftBtn: cc.Node = null;
  @property(cc.Node)
  rightBtn: cc.Node = null;
  @property(cc.Node)
  upBtn: cc.Node = null;

  protected onLoad(): void {
    // 下面两个事件用于重新绑定触摸按钮，当切换主角形态时需要这个操作
    cc.systemEvent.on("unbindBtn", this.unbindBtn, this);
    cc.systemEvent.on("bindBtn", this.bindBtn, this);
    this.bindKey();
    this.bindBtn(this.game.mario);
  }

  onDestroy() {
    this.unbindKey();
    this.unbindBtn();
    cc.systemEvent.off("unbindBtn");
    cc.systemEvent.off("rebind");
  }

  bindKey() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.keyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.keyUp, this);
  }

  unbindKey() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);
  }

  bindBtn(mario: Mario) {
    let touchStart = cc.Node.EventType.TOUCH_START;
    let touchEnd = cc.Node.EventType.TOUCH_END;
    let touchCancel = cc.Node.EventType.TOUCH_CANCEL;
    try {
      this.leftBtn.on(touchStart, mario.onMoveLeftStart, mario);
      this.leftBtn.on(touchEnd, mario.onMoveEnd, mario);
      this.leftBtn.on(touchCancel, mario.onMoveEnd, mario);
      this.rightBtn.on(touchStart, mario.onMoveRightStart, mario);
      this.rightBtn.on(touchEnd, mario.onMoveEnd, mario);
      this.rightBtn.on(touchCancel, mario.onMoveEnd, mario);
      this.upBtn.on(touchStart, mario.onJumpStart, mario);
      this.upBtn.on(touchEnd, mario.onJumpEnd, mario);
      this.upBtn.on(touchCancel, mario.onJumpEnd, mario);
    } catch (error) {
      console.log(error);
      debugger;
    }
  }

  unbindBtn() {
    let touchStart = cc.Node.EventType.TOUCH_START;
    let touchEnd = cc.Node.EventType.TOUCH_END;
    let touchCancel = cc.Node.EventType.TOUCH_CANCEL;
    this.leftBtn.off(touchStart);
    this.leftBtn.off(touchEnd);
    this.leftBtn.off(touchCancel);
    this.rightBtn.off(touchStart);
    this.rightBtn.off(touchEnd);
    this.rightBtn.off(touchCancel);
    this.upBtn.off(touchStart);
    this.upBtn.off(touchEnd);
    this.upBtn.off(touchCancel);
  }

  keyDown(e: cc.Event.EventKeyboard) {
    switch (e.keyCode) {
      case cc.macro.KEY.a:
        this.game.mario.onMoveLeftStart();
        break;
      case cc.macro.KEY.d:
        this.game.mario.onMoveRightStart();
        break;
      case cc.macro.KEY.w:
        this.game.mario.onJumpStart();
        break;
    }
  }

  keyUp(e: cc.Event.EventKeyboard) {
    switch (e.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.d:
        this.game.mario.onMoveEnd();
        break;
      case cc.macro.KEY.w:
        this.game.mario.onJumpEnd();
        break;
    }
  }
}
