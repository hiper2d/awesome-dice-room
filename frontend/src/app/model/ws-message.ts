export interface WsMessageParam {
  type: string;
  data?: string;
  senderId?: string;
  direct?: boolean;
  to?: string;
}

export class WsMessage {
  type: string;
  data: string;
  senderId: string;
  direct: boolean;
  to: string;

  constructor(param: WsMessageParam) {
    if (param) {
      this.type = param.type;
      this.data = param.data;
      this.senderId = param.senderId;
      this.direct = param.direct;
      this.to = param.to;
    }
  }
}
