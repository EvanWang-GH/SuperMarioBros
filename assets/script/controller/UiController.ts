// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Game from "../Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UiControl extends cc.Component {
  @property(Game)
  game: Game = null;

  @property(cc.Label)
  scoreLabel: cc.Label = null;
  @property(cc.Label)
  timeLabel: cc.Label = null;
  @property(cc.Node)
  gameOver: cc.Node = null;
  @property(cc.Node)
  gameWin: cc.Node = null;

  @property(cc.Node)
  startMenuNode: cc.Node = null;
  @property(cc.Node)
  leftBtn: cc.Node = null;
  @property(cc.Node)
  rightBtn: cc.Node = null;
  @property(cc.Node)
  upBtn: cc.Node = null;

  protected onLoad(): void {
    // 加分
    cc.systemEvent.on("addScore", (score: number) => {
      this.game.score += score;
      this.scoreLabel.string = "Score:" + this.game.score;
    });

    cc.systemEvent.on("win", () => {
      this.gameWin.active = true;
      this.unschedule(this.timeCount);
      this.upBtn.active = false;
      this.leftBtn.active = false;
      this.rightBtn.active = false;
    });

    cc.systemEvent.on("lose", () => {
      this.gameOver.active = true;
      this.unschedule(this.timeCount);
      this.upBtn.active = false;
      this.leftBtn.active = false;
      this.rightBtn.active = false;
    });

    this.timeLabel.string = "Time:" + this.game.time;
    this.schedule(this.timeCount, 1);
  }

  protected onDestroy(): void {
    cc.systemEvent.off("addScore");
    cc.systemEvent.off("win");
    cc.systemEvent.off("lose");
  }

  gameStart() {
    this.upBtn.active = true;
    this.leftBtn.active = true;
    this.rightBtn.active = true;

    this.startMenuNode.active = false;
    cc.director.resume();
  }

  loadRank() {
    cc.director.loadScene("rank");
  }

  timeCount() {
    this.game.time--;
    this.timeLabel.string = "Time:" + this.game.time;
    if (this.game.time == 0) {
      this.game.mario.lose();
      this.unschedule(this.timeCount);
    }
  }
}
