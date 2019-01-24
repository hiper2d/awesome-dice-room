export interface WsMessageParam {
  type: string;
  roomId?: string;
  data?: string;
  senderId?: string;
  direct?: boolean;
  to?: string;
}

export class WsMessage {
  type: string;
  roomId: string;
  data: string;
  senderId: string;
  direct: boolean;
  to: string;

  constructor(param: WsMessageParam) {
    if (param) {
      this.type = param.type;
      this.roomId = param.roomId;
      this.data = param.data;
      this.senderId = param.senderId;
      this.direct = param.direct;
      this.to = param.to;
    }
  }
}
