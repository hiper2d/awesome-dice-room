import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/service/user.service';
import {WsRoomMessageType} from '../../util/web-socket/ws-message-type.enum';
import {Player} from '../../model/player';
import {Inventory} from '../../model/inventory';
import {RoomService} from '../../core/service/room.service';
import {ApiConst} from '../../util/constant/api.const';
import {PlayerService} from '../../core/service/player.service';
import {Queue} from '../../util/queue';
import {RoomMessage} from '../../model/room-message';
import {flatMap, map, tap} from 'rxjs/operators';
import {RoomFull} from '../../model/room-rull';
import {ExceptionUtil} from '../../util/exception.util';
import {RoomSocketHolder} from './room-socket.holder';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  @ViewChild('chatbox', { static: true }) chatbox: ElementRef;
  chatMessages: Queue<RoomMessage> = new Queue(100);
  roomSocketHolder: RoomSocketHolder;

  chatMessage = '';
  currentPlayer: Player;
  room: RoomFull;
  currentPlayerTabIndex = 0;

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
      flatMap(roomId => this.createRoom(roomId)),
      flatMap(room => this.createCurrentPlayer(room)),
      tap(() => {
        this.createAndSetupWsHandler();
        this.calculateCurrentPlayerTabIndex();
      })
    ).subscribe(
      () => this.roomSocketHolder.connect(`${ApiConst.WS_ROOM}/${this.room.id}`),
      () => {
        console.log('Cannot connect to room socket');
        this.leaveRoom();
      }
    );
  }

  ngOnDestroy() {
    if (this.roomSocketHolder) {
      this.roomSocketHolder.disconnect();
    }
  }

  sendMessageToChatbox() {
    if (this.chatMessage) {
      this.roomSocketHolder.notifyAll({ type: WsRoomMessageType.CHAT_MESSAGE, data: this.chatMessage });
      this.chatMessage = '';
    }
  }

  saveInventory(inventory: Inventory) {
    this.currentPlayer.inventory = inventory;
    this.playerService.updatePlayer(this.currentPlayer).subscribe(
      () => this.roomSocketHolder.notifyAll({ type: WsRoomMessageType.INVENTORY })
    );
  }

  leaveRoom() {
    if (this.roomSocketHolder && this.roomSocketHolder.isConnected()) {
      this.roomSocketHolder.notifyAll({ type: WsRoomMessageType.DISCONNECT });
    }
    if (this.room && this.currentPlayer) {
      this.roomService.removePlayerFromRoom(this.room.id, this.currentPlayer.id).subscribe();
    }
    this.router.navigate(['/']);
  }

  kick(kickedPlayerId: string, event: any) {
    event.stopPropagation();
    this.roomSocketHolder.notifyAll({ type: WsRoomMessageType.KICK, data: kickedPlayerId });
  }

  isAdminPlayer = (player: Player) => this.userService.isAdmin && player.id !== this.currentPlayer.id;

  private createAndSetupWsHandler() {
    this.roomSocketHolder = new RoomSocketHolder(this.room, this.currentPlayer, this.playerService);
    this.roomSocketHolder.messageObservable.pipe(
      tap(m => this.chatMessages.push(m)),
      tap(() => this.updateChatboxScrollPosition())
    ).subscribe();
    this.roomSocketHolder.leaveEventObservable.subscribe(() => this.leaveRoom());
  }

  private calculateCurrentPlayerTabIndex() {
    this.currentPlayerTabIndex = this.room.players.findIndex(p => p.id === this.currentPlayer.id);
  }

  private updateChatboxScrollPosition() {
    setTimeout(() => this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight);
  }

  private createRoom(roomId) {
    return this.roomService.getRoom(roomId)
      .pipe(
        tap(room => this.room = room),
        tap(room => ExceptionUtil.throwIfEmpty(room, `Room with id=${roomId} cannot be found`))
      );
  }

  private createCurrentPlayer(room: RoomFull) {
    return this.playerService.findOrCreatePlayer(new Player({ name: this.userService.name, roomId: room.id }))
      .pipe(
        tap(player => this.currentPlayer = player),
        tap(player => this.addCurrentPlayerToRoomIfNeeded(player))
      );
  }

  private addCurrentPlayerToRoomIfNeeded(player: Player) {
    if (this.room.players.map(p => p.id).indexOf(player.id) === -1) {
      this.room.players.push(player);
    }
  }
}
