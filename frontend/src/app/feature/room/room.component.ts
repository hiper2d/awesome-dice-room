import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material';
import {RoomDialogComponent} from './room-dialog/room-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Room} from '../../model/room';
import {UserService} from '../../core/service/user.service';
import {WsMessage, WsMessageParam} from '../../model/ws-message';
import {WsRoomMessageType} from '../../util/web-socket/ws-message-type';
import {Player} from '../../model/player';
import {Inventory} from '../../model/inventory';
import {WithWebSocket} from '../../util/web-socket/with-web-socket';
import {DashboardService} from '../../core/service/dashboard.service';
import {WsConstants} from '../../util/web-socket/ws-constants';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent extends WithWebSocket implements OnInit, OnDestroy {
  @ViewChild('chatbox') chatbox: ElementRef;
  message = '';
  room: Room;
  you: Player;

  constructor(
    userService: UserService,
    private dashboardService: DashboardService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    super(userService);
  }

  @HostListener('window:beforeunload')
  onGlobalExit() {
    this.ngOnDestroy();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const roomId = params.get('roomId');

      if (this.dashboardService.roomIds.indexOf(roomId) === -1) {
        this.leaveRoom();
        return;
      }

      this.room = new Room(roomId);

      const myPlayer = this.dashboardService.getPlayer(roomId);
      if (myPlayer) {
        this.init(myPlayer);
      } else {
        setTimeout(() => { // hack to avoid 'value has been changed before check'
          this.dialog.open(RoomDialogComponent).afterClosed().subscribe(this.onDialogClose(roomId));
        });
      }
    });
  }

  private init(player: Player) {
    this.you = player;
    this.room.addPlayer(this.you);
    this.connect(`${WsConstants.roomTopic}${this.room.id}`);
  }

  private onDialogClose(roomId: string) {
    return (name: string) => {
      if (!name) {
        this.leaveRoom();
      } else {
        this.init(new Player(this.userService.userId, name));
        this.dashboardService.addPlayer(roomId, this.you);
      }
    };
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
        this.room.pushMessage(`${this.room.getPlayerById(message.senderId).name}'s Roll result is ${message.data}`);
        break;

      case WsRoomMessageType.HI_I_AM_NEW_HERE:
        if (message.senderId !== this.userService.userId) {
          this.room.addPlayer(Player.newPlayer(message.data));
          this.room.pushMessage(`${message.data.name} joined room`);
          this.sendMessage({
            type: WsRoomMessageType.NICE_TO_MEET_YOU,
            data: this.you,
            direct: true,
            to: message.senderId
          });
        }
        break;

      case WsRoomMessageType.NICE_TO_MEET_YOU:
        if (message.direct && message.to === this.userService.userId) {
          this.room.addPlayer(Player.newPlayer(message.data));
          this.room.pushMessage(`${message.data.name} already connected`);
        }
        break;

      case WsRoomMessageType.CHAT_MESSAGE:
        this.room.pushMessage(message.data, this.room.getPlayerById(message.senderId));
        break;

      case WsRoomMessageType.DISCONNECT:
        this.room.pushMessage(`${this.room.getPlayerById(message.senderId).name} disconnected`);
        this.room.getPlayerById(message.senderId).connected = false;
        break;

      case WsRoomMessageType.INVENTORY:
        const inventory: Inventory = message.data;
        const items = inventory.items.reduce((acc, i) => `${acc}<br/> name: ${i.name} description: ${i.description}`, '');
        this.room.pushMessage(`${this.room.getPlayerById(message.senderId).name}'s items :<br/>${items}`);

        if (this.you.id !== message.senderId) {
          this.room.players.get(message.senderId).inventory = message.data;
        }
        break;
    }

    setTimeout(() => this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight);
  }

  protected onOpen() {
    this.sendMessage({ type: WsRoomMessageType.HI_I_AM_NEW_HERE, data: this.you });
    this.room.pushMessage('Connected');
  }

  protected onClose() {
    this.sendMessage({ type: WsRoomMessageType.DISCONNECT });
  }

  private sendMessage = (params: WsMessageParam) => this.send({ roomId: this.room.id, ...params });
}
