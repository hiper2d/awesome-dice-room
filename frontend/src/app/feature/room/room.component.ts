import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Room} from '../../model/room';
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
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent extends WithWebSocket implements OnInit, OnDestroy {

  @ViewChild('chatbox') chatbox: ElementRef;
  messages: Queue<RoomMessage> = new Queue(100);
  message = '';
  room: Room;
  you: Player;

  private players: Array<Player> = [];
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
      tap(roomId => this.loadRoom(roomId))
    ).subscribe();
  }

  private loadRoom(id: string) {
    this.roomService.getRoom(id).subscribe(room => {
      console.log(room);
      if (!room) {
        this.leaveRoom();
        return;
      }

      this.room = room;
      this.you = new Player(this.userService.id, this.userService.name);
      this.addPlayer(this.you);
      this.connect(`${ApiConst.WS_ROOM}/${this.room.id}`);

      // No need to show dialog because users have names after login
      // this.dialog.open(RoomDialogComponent).afterClosed().subscribe(this.onDialogClose(id));
    });
  }

  ngOnDestroy() {
    if (this.wsConnection) {
      this.disconnect();
    }
  }

  onSendMessage() {
    if (this.message) {
      this.sendMessage({ type: WsRoomMessageType.CHAT_MESSAGE, data: this.message });
      this.message = '';
    }
  }

  getPlayers(): Array<Player> {
    return this.room && Array.from<Player>(this.room.players.values())
      .sort((a, b) => a.id === this.you.id ? -1 : 0);
  }

  onInventorySave = (inventory: Inventory) => this.sendMessage({ type: WsRoomMessageType.INVENTORY, data: inventory });

  leaveRoom() {
    if (this.wsConnection) {
      this.onClose();
    }

    this.router.navigate(['/']);
  }

  protected onMessage(result) {
    const message = JSON.parse(result.data) as WsMessage;

    switch (message.type) {
      case WsRoomMessageType.ROLL:
        this.pushMessage(`${this.getPlayerById(message.senderId).name}'s Roll result is ${message.data}`);
        break;

      case WsRoomMessageType.HI_I_AM_NEW_HERE:
        if (message.senderId !== this.userService.id) {
          this.addPlayer(Player.newPlayer(message.data));
          this.pushMessage(`${message.data.name} joined room`);
          this.sendMessage({
            type: WsRoomMessageType.NICE_TO_MEET_YOU,
            data: this.you,
            direct: true,
            to: message.senderId
          });
        }
        break;

      case WsRoomMessageType.NICE_TO_MEET_YOU:
        if (message.direct && message.to === this.userService.id) {
          this.addPlayer(Player.newPlayer(message.data));
          this.pushMessage(`${message.data.name} already connected`);
        }
        break;

      case WsRoomMessageType.CHAT_MESSAGE:
        this.pushMessage(message.data, this.getPlayerById(message.senderId));
        break;

      case WsRoomMessageType.DISCONNECT:
        this.pushMessage(`${this.getPlayerById(message.senderId).name} disconnected`);
        this.getPlayerById(message.senderId).connected = false;
        break;

      case WsRoomMessageType.INVENTORY:
        const inventory: Inventory = message.data;
        const items = inventory.items.reduce((acc, i) => `${acc}<br/> name: ${i.name} description: ${i.description}`, '');
        this.pushMessage(`${this.getPlayerById(message.senderId).name}'s items :<br/>${items}`);

        if (this.you.id !== message.senderId) {
          this.room.players.get(message.senderId).inventory = message.data;
        }
        break;
    }

    setTimeout(() => this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight);
  }

  protected onOpen() {
    this.sendMessage({ type: WsRoomMessageType.HI_I_AM_NEW_HERE, data: this.you });
    this.pushMessage('Connected');
  }

  protected onClose() {
    this.sendMessage({ type: WsRoomMessageType.DISCONNECT });
  }

  private sendMessage = (params: WsMessageParam) => this.send({ roomId: this.room.id, ...params });

  private addPlayer(player: Player) {
    this.players.push(player);
    this.playersSbj.next(this.players);
  }

  private getPlayerById(id: string) {
    return this.players.find(p => p.id === id);
  }

  private pushMessage(message: string, author: Player = Player.systemPlayer(), timestamp: string = new Date().toLocaleTimeString()) {
    this.messages.push(new RoomMessage(message, author, timestamp));
  }
}
