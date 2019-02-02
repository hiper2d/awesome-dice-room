import {WsMessage, WsMessageParam} from '../../model/ws-message';
import {UserService} from '../../core/service/user.service';
import {hostUrl} from './constants';

export abstract class WithWebSocket {
  protected wsConnection: WebSocket;

  constructor(protected userService: UserService) {}

  protected connect(topic: string) {
    this.wsConnection = new WebSocket(`${hostUrl}${topic}`);
    this.wsConnection.onmessage = (result) => this.onMessage(result);
    this.wsConnection.onopen = () => this.onOpen();
    this.wsConnection.onclose = () => this.onClose();
  }

  protected send(params: WsMessageParam) {
    this.wsConnection.send(JSON.stringify(new WsMessage({ senderId: this.userService.userId, ...params })));
  }

  protected disconnect = () => this.wsConnection.close();

  protected abstract onMessage(result);
  protected onOpen() {}
  protected onClose() {}
}
