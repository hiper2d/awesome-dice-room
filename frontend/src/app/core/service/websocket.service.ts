import {Injectable} from '@angular/core';

@Injectable()
export class WebSocketService {

  connect(onMessageCallback: (string) => void): WebSocket {
    const connection = new WebSocket(`ws://${window.location.hostname}:8080/ws/echo`);
    connection.onmessage = onMessageCallback;
    return connection;
  }
}
