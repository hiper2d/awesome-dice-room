export interface WsMessageParam {
  type: string;
  roomId?: string;
  data?: any;
  sender?: string;
  direct?: boolean;
  to?: string;
}

export class WsMessage {
  type: string;
  roomId: string;
  data: any;
  sender: string;
  direct: boolean;
  to: string;

  constructor(param: WsMessageParam) {
    if (param) {
      this.type = param.type;
      this.roomId = param.roomId;
      this.data = param.data;
      this.sender = param.sender;
      this.direct = param.direct;
      this.to = param.to;
    }
  }
}
