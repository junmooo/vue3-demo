// interface IMessage {
//   type: string;  // 消息类型
//   params?: Record<string, any>;
// }
// 定义Bridge
export default class Bridge {
  async sendWithResult(message) {
    return new Promise((resolve) => {
      // 随机生成一个函数名称
      const callbackName = `callback_${Math.floor(Math.random() * 100000)}`;
      // 将函数挂载到window上
      window[callbackName] = (data) => {
        // 执行回调
        resolve(data);
        // 执行完毕后删除
        delete window[callbackName];
      };
      window.FlutterBridge?.postMessage(
        JSON.stringify({
          ...message,
          callback: `window.${callbackName}`,
        }),
      );
    });
  }
}