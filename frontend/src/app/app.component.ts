import {Component, HostBinding, OnInit} from '@angular/core';
import {WebSocketService} from './core/service/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  num: number;

  private wsConnection: WebSocket;
  private uuid: string;

  constructor(public webSocketService: WebSocketService) {
  }

  ngOnInit(): void {
    this.uuid = this.createUuid();
    this.wsConnection = this.webSocketService.connect(this.getWsMessageCallback());
  }

  roll() {
    this.wsConnection.send(JSON.stringify({ message: '1d6', uuid: this.uuid }));
  }

  private getWsMessageCallback(): (string) => void {
    return (message) => {
      const signal = JSON.parse(message.data);
      /*if (signal.uuid === this.uuid) {
        console.log('Received self signal');
        return;
      }*/
      this.num = signal;
    };
  }

  // Taken from http://stackoverflow.com/a/105074/515584
  // Strictly speaking, it's not a real UUID, but it gets the job done here
  private createUuid(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
