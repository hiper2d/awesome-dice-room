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
import {BehaviorSubject} from 'rxjs';
import {Queue} from '../../util/queue';
import {RoomMessage} from '../../model/room-message';
import {flatMap, map, tap} from 'rxjs/operators';
import {RoomFull} from '../../model/room-rull';

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
  systemPlayer: Player;

  private room: RoomFull;
  private playersSbj = new BehaviorSubject<Array<Player>>([]);
  playersObj = this.playersSbj.asObservable();

  constructor(
    userService: UserService,
    private roomService: RoomService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
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
      tap(room => this.throwIfEmpty(room)),
      tap(room => {
        room.players.map(p => Player.addColorIfMissing(p));
        this.systemPlayer = Player.systemPlayer(room.id);
        this.room = room;
      }),
      flatMap(room => this.playerService.findOrCreatePlayer(new Player(null, this.userService.id, room.id, this.userService.name))),
      tap(player => {
        this.currentPlayer = Player.newPlayer(player);
        this.addPlayerTab(this.currentPlayer);
      })
    ).subscribe(
      () => {
        this.connect(`${ApiConst.WS_ROOM}/${this.room.id}`);
      },
      () => this.leaveRoom()
    );
  }

  ngOnDestroy() {
    this.leaveRoom();
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
      this.onWsClose(); // hmm, looks like a hack
    }
    if (this.room && this.currentPlayer) {
      this.roomService.removePlayerFromRoom(this.room.id, this.currentPlayer.id).subscribe(); // not sure about this, may not work stable
    }
    this.router.navigate(['/']);
  }

  protected onWsOpen() {
    this.notifyAll({ type: WsRoomMessageType.HI_I_AM_NEW_HERE });
    this.pushMessageToChat('Connected');
  }

  protected onWsClose() {
    this.notifyAll({ type: WsRoomMessageType.DISCONNECT });
  }

  protected onMessage(result) {
    const message = JSON.parse(result.data) as WsMessage;

    switch (message.type) {
      case WsRoomMessageType.ROLL:
        const text = message.data as string;
        this.pushMessageToChat(`${this.getPlayerByUser(message.senderId).name}'s Roll result is ${text}`);
        break;

      case WsRoomMessageType.HI_I_AM_NEW_HERE:
        if (!this.isMyOwnMessage(message)) {
          const joinedPlayerId = message.senderId;
          this.playerService.getPlayer(joinedPlayerId).subscribe(p => {
              this.addPlayerTab(Player.newPlayer(p));
              this.pushMessageToChat(`${p.name} joined room`);
            });
        }
        break;

      case WsRoomMessageType.CHAT_MESSAGE:
        const sender = this.getPlayerByUser(message.senderId);
        this.pushMessageToChat(message.data, sender);
        break;

      case WsRoomMessageType.DISCONNECT:
        this.pushMessageToChat(`${this.getPlayerByUser(message.senderId).name} disconnected`);
        break;

      case WsRoomMessageType.INVENTORY:
        const inventory: Inventory = message.data;
        const items = inventory.items.reduce((acc, i) => `${acc}<br/> name: ${i.name} description: ${i.description}`, '');
        this.pushMessageToChat(`${this.getPlayerByUser(message.senderId).name}'s items :<br/>${items}`);

        if (!this.isMyOwnMessage(message)) {
          this.room.players.find(p => p.userId === this.currentPlayer.userId).inventory = message.data;
        }
        break;
    }

    setTimeout(() => this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight);
  }

  private isMyOwnMessage(message) {
    return message.senderId === this.currentPlayer.id;
  }

  private notifyAll = (params: WsMessageParam) => this.sendWsMessage({ roomId: this.room.id, senderId: this.currentPlayer.id, ...params });

  private addPlayerTab(player: Player) {
    if (this.room.players.indexOf(player) === -1) {
      this.room.players.push(player);
      this.playersSbj.next(this.room.players);
    }
  }

  private getPlayerByUser(id: string) {
    return this.room.players.find(p => p.id === id);
  }

  private pushMessageToChat(message: string, author: Player = this.systemPlayer, timestamp: string = new Date().toLocaleTimeString()) {
    this.chatMessages.push(new RoomMessage(message, author, timestamp));
  }

  private throwIfEmpty(room) {
    if (room == null) {
      throw new Error('Room cannot be found');
    }
  }
}
