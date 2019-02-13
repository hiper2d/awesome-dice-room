import {WsMessage, WsMessageParam} from '../../model/ws-message';
import {UserService} from '../../core/service/user.service';
import {ApiConst} from '../api.const';

export abstract class WithWebSocket {
  protected wsConnection: WebSocket;

  protected constructor(protected userService: UserService) {}

  protected connect(topic: string) {
    this.wsConnection = new WebSocket(`${ApiConst.WS_HOST}/${topic}`);
    this.wsConnection.onmessage = (result) => this.onMessage(result);
    this.wsConnection.onopen = () => this.onWsOpen();
    this.wsConnection.onclose = () => this.onWsClose();
  }

  protected sendWsMessage = (params: WsMessageParam) => this.wsConnection.send(JSON.stringify(new WsMessage(params)));
  protected disconnect = () => this.wsConnection.close();

  protected abstract onMessage(result);
  protected onWsOpen() {}
  protected onWsClose() {}
}
