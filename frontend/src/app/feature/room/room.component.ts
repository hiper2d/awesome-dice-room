import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/service/user.service';
import {WsMessage, WsMessageParam} from '../../model/ws-message';
import {WsRoomMessageType} from '../../util/web-socket/ws-message-type';
import {Player} from '../../model/player';
import {Inventory} from '../../model/inventory';
import {WithWebSocket} from '../../util/web-socket/with-web-socket';
import {RoomService} from '../../core/service/room.service';
import {ApiConst} from '../../util/api.const';
import {PlayerService} from '../../core/service/player.service';
import {Queue} from '../../util/queue';
import {RoomMessage} from '../../model/room-message';
import {flatMap, map, tap} from 'rxjs/operators';
import {RoomFull} from '../../model/room-rull';
import {ExceptionUtil} from '../../util/exception.util';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent extends WithWebSocket implements OnInit, OnDestroy {

  @ViewChild('chatbox') chatbox: ElementRef;
  chatMessages: Queue<RoomMessage> = new Queue(100);
  message = '';
  currentPlayer: Player;

  private room: RoomFull;

  constructor(
    private roomService: RoomService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute,
    userService: UserService
  ) {
    super(userService);
  }

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
      flatMap(room => this.playerService.findOrCreatePlayer(new Player(null, this.userService.id, room.id, this.userService.name))),
      tap(player => {
        this.currentPlayer = player;
        this.addPlayerTab(this.currentPlayer);
      })
    ).subscribe(
      () => this.connect(`${ApiConst.WS_ROOM}/${this.room.id}`),
      () => this.leaveRoom()
    );
  }

  ngOnDestroy() {
    if (this.wsConnection) {
      this.disconnect();
    }
  }

  onSendMessage() {
    if (this.message) {
      this.notifyAll({ type: WsRoomMessageType.CHAT_MESSAGE, data: this.message });
      this.message = '';
    }
  }

  onInventorySave = (inventory: Inventory) => this.notifyAll({ type: WsRoomMessageType.INVENTORY, data: inventory });

  leaveRoom() {
    if (this.wsConnection) {
      this.notifyAll({ type: WsRoomMessageType.DISCONNECT });
    }

    if (this.room && this.currentPlayer) {
      this.roomService.removePlayerFromRoom(this.room.id, this.currentPlayer.id);
    }

    this.router.navigate(['/']);
  }

  protected onWsOpen() {
    this.notifyAll({ type: WsRoomMessageType.HI_I_AM_NEW_HERE });
    this.pushMessageToChat('Connected');
  }

  protected onMessage(result) {
    const message = JSON.parse(result.data) as WsMessage;

    switch (message.type) {
      case WsRoomMessageType.ROLL:
        this.pushMessageToChat(`${this.getPlayerByUserId(message.senderId).name}'s Roll result is ${message.data}`);
        break;

      case WsRoomMessageType.HI_I_AM_NEW_HERE:
        if (!this.isMyOwnMessage(message)) {
          this.playerService.getPlayer(message.senderId).subscribe(p => {
              this.addPlayerTab(p);
              this.pushMessageToChat(`${p.name} joined room`);
            });
        }
        break;

      case WsRoomMessageType.CHAT_MESSAGE:
        this.pushMessageToChat(message.data, this.getPlayerByUserId(message.senderId));
        break;

      case WsRoomMessageType.DISCONNECT:
        this.pushMessageToChat(`${this.getPlayerByUserId(message.senderId).name} disconnected`);
        break;

      case WsRoomMessageType.INVENTORY:
        const inventory: Inventory = message.data;
        const items = inventory.items.reduce((acc, i) => `${acc}<br/> name: ${i.name} description: ${i.description}`, '');
        this.pushMessageToChat(`${this.getPlayerByUserId(message.senderId).name}'s items :<br/>${items}`);

        if (!this.isMyOwnMessage(message)) {
          this.room.players.find(p => p.userId === this.currentPlayer.userId).inventory = message.data;
        }
        break;
    }

    setTimeout(() => this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight);
  }

  private isMyOwnMessage(message): boolean {
    return message.senderId === this.currentPlayer.id;
  }

  private notifyAll = (params: WsMessageParam) => this.sendWsMessage({ roomId: this.room.id, senderId: this.currentPlayer.id, ...params });

  private addPlayerTab(player: Player) {
    if (this.room.players.indexOf(player) === -1) {
      this.room.players.push(player);
    }
  }

  private getPlayerByUserId(id: string): Player {
    return this.room.players.find(p => p.id === id);
  }

  private pushMessageToChat(
    message: string,
    author: Player = this.playerService.systemPlayer,
    timestamp: string = new Date().toLocaleTimeString()
  ) {
    this.chatMessages.push(new RoomMessage(message, author, timestamp));
  }
}
