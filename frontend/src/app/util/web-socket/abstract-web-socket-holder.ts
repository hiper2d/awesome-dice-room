import {WsMessage, WsMessageParam} from '../../model/ws-message';
import {UserService} from '../../core/service/user.service';
import {ApiConst} from '../api.const';

export abstract class AbstractWebSocketHolder {

  protected wsConnection: WebSocket;
  protected constructor() {}

  connect(topic: string) {
    this.wsConnection = new WebSocket(`${ApiConst.WS_HOST}/${topic}`);
    this.wsConnection.onmessage = (result) => this.onMessage(result);
    this.wsConnection.onopen = () => this.onWsOpen();
    this.wsConnection.onclose = () => this.onWsClose();
  }

  isConnected = () => this.wsConnection != null;

  sendWsMessage(params: WsMessageParam) {
    if (this.wsConnection) {
      this.wsConnection.send(JSON.stringify(params));
    } else {
      throw new Error('Connection is already closed');
    }
  }

  disconnect() {
    if (this.isConnected) {
      this.wsConnection.close();
    }
  }

  protected abstract onMessage(result);
  protected onWsOpen() {}
  protected onWsClose() {}
}
