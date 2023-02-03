// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.AudioSource)
  musicSource: cc.AudioSource = null;
  @property(cc.AudioSource)
  effSource: cc.AudioSource = null;

  @property(cc.AudioClip)
  winAudioClip: cc.AudioClip = null;
  @property(cc.AudioClip)
  loseAudioClip: cc.AudioClip = null;
  @property(cc.AudioClip)
  coinAudioClip: cc.AudioClip = null;
  @property(cc.AudioClip)
  jumpAudioClip: cc.AudioClip = null;

  protected onLoad(): void {
    cc.systemEvent.on("win", () => {
      this.musicSource.clip = this.winAudioClip;
      this.musicSource.play();
    });
    cc.systemEvent.on("lose", () => {
      this.musicSource.clip = this.loseAudioClip;
      this.musicSource.play();
    });
    cc.systemEvent.on("addScore", () => {
      this.effSource.clip = this.coinAudioClip;
      this.effSource.play();
    });
    cc.systemEvent.on("jump", () => {
      this.effSource.clip = this.jumpAudioClip;
      this.effSource.play();
    });
  }

  protected onDestroy(): void {
    cc.systemEvent.off("win");
    cc.systemEvent.off("lose");
    cc.systemEvent.off("addScore");
    cc.systemEvent.off("jump");
  }
}
