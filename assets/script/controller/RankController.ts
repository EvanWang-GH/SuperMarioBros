// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
const { ccclass, property } = cc._decorator;

@ccclass
export default class RankController extends cc.Component {
  protected onLoad(): void {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      let openDataContext = wx.getOpenDataContext();
      // 尝试清空排行榜，如果子域没完成加载则不会收到这条消息
      openDataContext.postMessage({ type: "reset" });
      // 循环提交分数，确保子域能够收到
      this.schedule(() => {
        let localStorage: Storage = cc.sys.localStorage;
        let data = {
          type: "submitScore",
          value: localStorage.getItem("score"),
        };
        openDataContext.postMessage(data);
      }, 0.5);
    }
  }

  loadMain() {
    cc.director.loadScene("main");
  }
}
