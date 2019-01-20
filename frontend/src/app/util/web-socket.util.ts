import {WsMessageModel} from "../model/ws-message.model";

export class WebSocketUtil {

  static connect(onMessageCallback: (string) => void): WebSocket {
    const connection = new WebSocket(`ws://${window.location.hostname}:8080/ws/echo`);
    connection.onmessage = onMessageCallback;
    return connection;
  }

  static send(conn: WebSocket, senderId: string, params: any): void {
    conn.send(JSON.stringify(new WsMessageModel({ senderId, ...params })));
  }
}
