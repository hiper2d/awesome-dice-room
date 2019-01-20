import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebSocketUtil} from '../../util/web-socket.util';
import {MatDialog} from '@angular/material';
import {RoomDialogComponent} from './room-dialog/room-dialog.component';
import {Router} from '@angular/router';
import {RoomModel} from '../../model/room.model';
import {UserService} from '../../core/service/user.service';
import {WsMessageModel} from '../../model/ws-message.model';
import {WsMessageType} from '../../util/ws-message-type';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  yourName: string;
  message = '';
  room = new RoomModel();

  private wsConnection: WebSocket;

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    setTimeout(() => { // hack to avoid 'value has been changed before check'
      const dialogRef = this.dialog.open(RoomDialogComponent);

      dialogRef.afterClosed().subscribe(name => {
        if (!name) {
          this.router.navigate(['/']);
        } else {
          this.yourName = name;
          this.room.addPlayer(this.userService.userId, name, true);
          this.wsConnection = WebSocketUtil.connect(this.getWsMessageCallback());
          this.wsConnection.onopen = () => this.notifyOtherClientsThatYouJoined();
        }
      });
    });
  }

  ngOnDestroy() {
    this.sendMessage({ type: WsMessageType.DISCONNECT });
  }


  onSendMessage() {
    if (this.message) {
      this.sendMessage({type: WsMessageType.MESSAGE, data: this.message});
      this.message = '';
    }
  }

  notifyOtherClientsThatYouJoined() {
    this.sendMessage({type: WsMessageType.HI_I_AM_NEW_HERE, data: this.yourName});
    this.room.pushMessage('Connected');
  }

  private getWsMessageCallback(): (any) => void {
    return (result) => {
      const message = JSON.parse(result.data) as WsMessageModel;

      switch (message.type) {
        case WsMessageType.ROLL:
          this.room.pushMessage(`${this.room.getNameById(message.senderId)}'s Roll result is ${message.data}`);
          break;

        case WsMessageType.HI_I_AM_NEW_HERE:
          if (message.senderId !== this.userService.userId) {
            this.room.addPlayer(message.senderId, message.data);
            this.room.pushMessage(`${message.data} joined room`);
            this.sendMessage({
              type: WsMessageType.NICE_TO_MEET_YOU,
              data: this.yourName,
              direct: true,
              to: message.senderId
            });
          }
          break;

        case WsMessageType.NICE_TO_MEET_YOU:
          if (message.direct && message.to === this.userService.userId) {
            this.room.addPlayer(message.senderId, message.data);
            this.room.pushMessage(`${message.data} already connected`);
          }
          break;

        case WsMessageType.MESSAGE:
          this.room.pushMessage(message.data, this.room.getNameById(message.senderId));
          break;

        case WsMessageType.DISCONNECT:
          this.room.pushMessage(`${this.room.getNameById(message.senderId)} disconnected`);
          this.room.removePlayer(message.senderId);
          break;
      }
    };
  }

  private sendMessage = (params: any) => WebSocketUtil.send(this.wsConnection, this.userService.userId, params);
}
