export class WebSocketUtil {

  static connect(onMessageCallback: (string) => void): WebSocket {
    const connection = new WebSocket(`ws://${window.location.hostname}:8080/ws/echo`);
    connection.onmessage = onMessageCallback;
    return connection;
  }
}
