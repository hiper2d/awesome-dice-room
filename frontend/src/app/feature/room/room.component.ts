import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {WsUtil} from '../../util/ws.util';
import {MatDialog} from '@angular/material';
import {RoomDialogComponent} from './room-dialog/room-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Room} from '../../model/room';
import {UserService} from '../../core/service/user.service';
import {WsMessage, WsMessageParam} from '../../model/ws-message';
import {WsMessageType} from '../../util/ws-message-type';
import {Player} from '../../model/player';
import {UuidUtil} from '../../util/uuid.util';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  message = '';
  room = new Room('1'); // todo: there will be uuid for every room stored in database

  private wsConnection: WebSocket;
  private you: Player;

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  @HostListener('window:beforeunload')
  onGlobalExit() {
    this.ngOnDestroy();
  }

  ngOnInit() {
    setTimeout(() => { // hack to avoid 'value has been changed before check'
      const dialogRef = this.dialog.open(RoomDialogComponent);

      dialogRef.afterClosed().subscribe(name => {
        if (!name) {
          this.router.navigate(['/']);
        } else {
          this.you = new Player(this.userService.userId, name);
          this.room.addPlayer(this.you);
          this.wsConnection = WsUtil.connect(this.room.id, this.getWsMessageCallback());
          this.wsConnection.onopen = () => this.notifyOtherClientsThatYouJoined();
        }
      });
    });

    window.onbeforeunload = () => {
      this.ngOnDestroy();
    };
  }

  ngOnDestroy() {
    this.sendMessage({ type: WsMessageType.DISCONNECT });
  }

  onSendMessage() {
    if (this.message) {
      this.sendMessage({ type: WsMessageType.CHAT_MESSAGE, data: this.message });
      this.message = '';
    }
  }

  notifyOtherClientsThatYouJoined() {
    this.sendMessage({ type: WsMessageType.HI_I_AM_NEW_HERE, data: this.you.name });
    this.room.pushMessage('Connected');
  }

  private getWsMessageCallback(): (any) => void {
    return (result) => {
      const message = JSON.parse(result.data) as WsMessage;

      switch (message.type) {
        case WsMessageType.ROLL:
          this.room.pushMessage(`${this.room.getPlayerById(message.senderId).name}'s Roll result is ${message.data}`);
          break;

        case WsMessageType.HI_I_AM_NEW_HERE:
          if (message.senderId !== this.userService.userId) {
            this.room.addPlayer(new Player(message.senderId, message.data));
            this.room.pushMessage(`${message.data} joined room`);
            this.sendMessage({
              type: WsMessageType.NICE_TO_MEET_YOU,
              data: this.you.name,
              direct: true,
              to: message.senderId
            });
          }
          break;

        case WsMessageType.NICE_TO_MEET_YOU:
          if (message.direct && message.to === this.userService.userId) {
            this.room.addPlayer(new Player(message.senderId, message.data));
            this.room.pushMessage(`${message.data} already connected`);
          }
          break;

        case WsMessageType.CHAT_MESSAGE:
          this.room.pushMessage(message.data, this.room.getPlayerById(message.senderId));
          break;

        case WsMessageType.DISCONNECT:
          this.room.pushMessage(`${this.room.getPlayerById(message.senderId).name} disconnected`);
          this.room.getPlayerById(message.senderId).connected = false;
          break;
      }
    };
  }

  private sendMessage(params: WsMessageParam) {
    WsUtil.send(this.wsConnection, { roomId: this.room.id, senderId: this.userService.userId, ...params });
  }
}
