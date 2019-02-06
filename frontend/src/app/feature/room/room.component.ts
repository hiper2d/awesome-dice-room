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
import {flatMap, map, tap} from 'rxjs/operators';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent extends WithWebSocket implements OnInit, OnDestroy {

  @ViewChild('chatbox') chatbox: ElementRef;
  chatMessages: Queue<RoomMessage> = new Queue(100);
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
      flatMap(roomId => this.roomService.getRoom(roomId))
    ).subscribe(room => {
      if (!room) {
        this.leaveRoom();
      } else {
        this.setupRoom(room);
      }
    });
  }

  private setupRoom(room: Room) {
    this.room = room;
    this.playerService.getPlayers(room.playerIds)
      .pipe(tap(players => {
        this.players = players;
        this.playersSbj.next(players);
      }))
      .subscribe(players => {
        if (this.userService.isInRoom(room.id)) { // todo: we have create or find player backend method, so no need in this check
          this.takeYourExistingSeat(players, room);
        } else {
          this.setupNewSeat(room);
        }
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
        if (!this.isMyOwnMessage(message)) {
          const joinedPlayerId = message.data;
          this.playerService.getPlayer(joinedPlayerId).subscribe(p => {
              this.addPlayerTab(Player.newPlayer(p));
              this.pushMessage(`${message.data.name} joined room`);
            });
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
          this.players.find(p => p.userId === this.you.userId).inventory = message.data;
        }
        break;
    }

    setTimeout(() => this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight);
  }

  protected onOpen() {
    this.sendMessage({ type: WsRoomMessageType.HI_I_AM_NEW_HERE, data: this.you.id });
    this.pushMessage('Connected');
  }

  protected onClose() {
    this.sendMessage({ type: WsRoomMessageType.DISCONNECT });
  }

  private takeYourExistingSeat(players: Array<Player>, room: Room) {
    const yourPlayerId = this.userService.getPlayerId(room.id);
    this.players = players;
    this.playersSbj.next(players);
    this.you = players.find(p => p.id === yourPlayerId);
    this.you.connected = true;
    this.connect(`${ApiConst.WS_ROOM}/${this.room.id}`);
  }

  private setupNewSeat(room: Room) {
    const newPlayer = new Player(null, this.userService.id, room.id, this.userService.name);
    this.playerService.createPlayer(newPlayer)
      .pipe(
        tap(player => {
          this.you = Player.newPlayer(player);
          this.addPlayerTab(this.you);
        }),
        flatMap(player => this.roomService.addPlayerToRoom(room.id, player.id))
      )
      .subscribe(() => this.connect(`${ApiConst.WS_ROOM}/${this.room.id}`));
  }

  private isMyOwnMessage(message) {
    return message.senderId === this.userService.id;
  }

  private sendMessage = (params: WsMessageParam) => this.send({ roomId: this.room.id, ...params });

  private addPlayerTab(player: Player) {
    this.players.push(player);
    this.playersSbj.next(this.players);
  }

  private getPlayerById(id: string) {
    return this.players.find(p => p.id === id);
  }

  // todo: extract system player to global var to be inited only once
  private pushMessage(message: string, author: Player = Player.systemPlayer(this.room.id),
                      timestamp: string = new Date().toLocaleTimeString()) {
    this.chatMessages.push(new RoomMessage(message, author, timestamp));
  }
}
