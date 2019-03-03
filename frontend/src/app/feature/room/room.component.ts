import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/service/user.service';
import {WsMessage, WsMessageParam} from '../../model/ws-message';
import {WsRoomMessageType} from '../../util/web-socket/ws-message-type';
import {Player} from '../../model/player';
import {Inventory} from '../../model/inventory';
import {AbstractWebSocketHolder} from '../../util/web-socket/abstract-web-socket-holder';
import {RoomService} from '../../core/service/room.service';
import {ApiConst} from '../../util/api.const';
import {PlayerService} from '../../core/service/player.service';
import {Queue} from '../../util/queue';
import {RoomMessage} from '../../model/room-message';
import {flatMap, map, tap} from 'rxjs/operators';
import {RoomFull} from '../../model/room-rull';
import {ExceptionUtil} from '../../util/exception.util';
import {RoomSocketHolder} from './room-socket.holder';
import {Observable} from 'rxjs';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  @ViewChild('chatbox') chatbox: ElementRef;
  roomSocketHolder: RoomSocketHolder;
  chatMessages: Queue<RoomMessage> = new Queue(100);
  chatMessage = '';
  currentPlayer: Player;
  room: RoomFull;

  constructor(
    private roomService: RoomService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  @HostListener('window:beforeunload')
  onGlobalExit() {
    this.ngOnDestroy();
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('roomId')),
      flatMap(roomId => this.roomService.getRoom(roomId)),
      tap(room => ExceptionUtil.throwIfEmpty(room, 'Room cannot be found')),
      tap(room => this.room = room),
      flatMap(room => this.playerService.findOrCreatePlayer(new Player({ name: this.userService.name, roomId: room.id }))),
      tap(player => {
        this.currentPlayer = player;
        this.createAndSetupWsHandler();
      })
    ).subscribe(
      () => this.roomSocketHolder.connect(`${ApiConst.WS_ROOM}/${this.room.id}`),
      () => this.leaveRoom()
    );
  }

  ngOnDestroy() {
    this.roomSocketHolder.disconnect();
  }

  sendMessageToChatbox() {
    if (this.chatMessage) {
      this.roomSocketHolder.notifyAll({ type: WsRoomMessageType.CHAT_MESSAGE, data: this.chatMessage });
      this.chatMessage = '';
    }
  }

  saveInventory(inventory: Inventory) {
    this.roomSocketHolder.notifyAll({ type: WsRoomMessageType.INVENTORY, data: inventory });
  }

  leaveRoom() {
    if (this.roomSocketHolder.isConnected()) {
      this.roomSocketHolder.notifyAll({ type: WsRoomMessageType.DISCONNECT });
    }
    if (this.room && this.currentPlayer) {
      this.roomService.removePlayerFromRoom(this.room.id, this.currentPlayer.id).subscribe();
    }
    this.router.navigate(['/']);
  }

  private createAndSetupWsHandler() {
    this.roomSocketHolder = new RoomSocketHolder(this.room, this.currentPlayer, this.playerService);
    this.roomSocketHolder.messageObservable.pipe(
      tap(m => this.chatMessages.push(m)),
      tap(() => this.updateChatboxScrollPosition())
    ).subscribe();
  }

  private updateChatboxScrollPosition() {
    setTimeout(() => this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight);
  }
}
