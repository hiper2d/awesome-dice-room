import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dice-room-frontend';

  private wsConnection: WebSocket;
  private uuid: string;

  ngOnInit(): void {
    this.uuid = this.createUuid();
    this.wsConnection = new WebSocket(`ws://${window.location.hostname}:8080/ws/echo`);
    this.wsConnection.onmessage = this.getWsMessageCallback();
    this.wsConnection.onopen = () => this.wsConnection.send(JSON.stringify({ message: 'hi', uuid: this.uuid }));
  }

  private getWsMessageCallback(): (string) => void {
    return (message) => {
      const signal = JSON.parse(message.data);
      if (signal.uuid === this.uuid) {
        console.log('Received self signal');
        return;
      }

      console.log('Received signal');
      console.log(signal);
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
