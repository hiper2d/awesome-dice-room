import {Component, OnInit} from '@angular/core';
import {WebSocketUtil} from '../../util/web-socket.util';
import {MatDialog} from '@angular/material';
import {RoomDialogComponent} from './room-dialog/room-dialog.component';
import {Router} from '@angular/router';
import {PlayerModel} from '../../model/player.model';
import {RoomModel} from '../../model/room.model';
import {UserService} from '../../core/service/user.service';
import {WsMessageModel} from '../../model/ws-message.model';
import {WsMessageType} from '../../util/ws-message-type';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  rollResult: string;
  yourName: string;
  room = new RoomModel([]);

  private wsConnection: WebSocket;

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    setTimeout(() => { // hack to avoid 'value has been changed before check'
      const dialogRef = this.dialog.open(RoomDialogComponent);

      dialogRef.afterClosed().subscribe(name => {
        if (!name) {
          this.router.navigate(['/']);
        } else {
          this.yourName = name;
          this.room.players.push(new PlayerModel(name, this.userService.userId, true));
          this.wsConnection = WebSocketUtil.connect(this.getWsMessageCallback());
          this.wsConnection.onopen = () => this.notifyOtherClientsThatYouJoined();
        }
      });
    });
  }

  notifyOtherClientsThatYouJoined() {
    this.wsConnection.send(JSON.stringify(new WsMessageModel({
      type: WsMessageType.HI_I_AM_NEW_HERE,
      data: this.yourName,
      senderId: this.userService.userId
    })));
  }

  rollD6() {
    this.wsConnection.send(JSON.stringify(new WsMessageModel({
      type: WsMessageType.ROLL,
      data: 'd6',
      senderId: this.userService.userId
    })));
  }

  private getWsMessageCallback(): (string) => void {
    return (result) => {
      const message = JSON.parse(result.data) as WsMessageModel;

      switch (message.type) {
        case WsMessageType.ROLL:
          this.rollResult = message.data;
          break;

        case WsMessageType.HI_I_AM_NEW_HERE:
          if (message.senderId !== this.userService.userId) {
            this.room.players.push(new PlayerModel(message.data, message.senderId));
            this.wsConnection.send(
              JSON.stringify(new WsMessageModel({
                type: WsMessageType.NICE_TO_MEET_YOU,
                data: this.yourName,
                senderId: this.userService.userId,
                direct: true,
                to: message.senderId
              }))
            );
          }
          break;

        case WsMessageType.NICE_TO_MEET_YOU:
          if (message.direct && message.to === this.userService.userId) {
            this.room.players.push(new PlayerModel(message.data, message.senderId));
          }
      }
    };
  }
}
