import {WsMessage, WsMessageParam} from '../../model/ws-message';
import {WsRoomMessageType} from '../../util/web-socket/ws-message-type.enum';
import {BehaviorSubject, Subject} from 'rxjs';
import {Player} from '../../model/player';
import {RoomMessage} from '../../model/room-message';
import {PlayerService} from '../../core/service/player.service';
import {RoomFull} from '../../model/room-rull';
import {AbstractWebSocketHolder} from '../../util/web-socket/abstract-web-socket-holder';

export class RoomSocketHolder extends AbstractWebSocketHolder {

  private readonly messagePublisher = new Subject<RoomMessage>();
  readonly messageObservable = this.messagePublisher.asObservable();

  private readonly playersPublisher = new BehaviorSubject<Array<Player>>([]);
  readonly playersObservable = this.playersPublisher.asObservable();

  constructor(private readonly room: RoomFull, private readonly currentPlayer: Player, private playerService: PlayerService) {
    super();
    this.playersPublisher.next(room.players);
  }

  notifyAll(params: WsMessageParam) {
    return this.sendWsMessage({
      roomId: this.room.id,
      senderId: this.currentPlayer.id,
      ...params
    });
  }

  protected onMessage(result: any) {
    const message = JSON.parse(result.data) as WsMessage;

    switch (message.type) {
      case WsRoomMessageType.ROLL:
        this.pushMessageToChat(`${this.getPlayerNameById(message.senderId)}'s Roll result is ${message.data}`);
        break;

      case WsRoomMessageType.HI_I_AM_NEW_HERE:
        if (!this.isOwnMessage(message)) {
          this.playerService.getPlayer(message.senderId).subscribe(p => {
            this.addPlayerTab(p);
            this.pushMessageToChat(`${p.name} joined room`);
          });
        }
        break;

      case WsRoomMessageType.CHAT_MESSAGE:
        this.pushMessageToChat(message.data, this.getPlayerById(message.senderId));
        break;

      case WsRoomMessageType.DISCONNECT:
        this.pushMessageToChat(`${this.getPlayerNameById(message.senderId)} disconnected`);
        this.removePlayerTab(this.getPlayerById(message.senderId));
        break;

      case WsRoomMessageType.INVENTORY:
        this.pushMessageToChat(`${this.getPlayerNameById(message.senderId)} updated inventory`);
        this.updatePlayerInventory(message.senderId);
        break;

      case WsRoomMessageType.KICK:
        const kickedPlayerId = message.data;
        const kickedPlayer = this.getPlayerById(kickedPlayerId);
        if (this.currentPlayer.id === kickedPlayerId) {
          console.log('You were kicked'); // todo: make yourself leave the room
        } else {
          this.pushMessageToChat(`${kickedPlayer.name} was kicked`);
          this.removePlayerTab(kickedPlayer);
        }
        break;
    }
  }

  protected onWsOpen() {
    this.notifyAll({ type: WsRoomMessageType.HI_I_AM_NEW_HERE });
    this.pushMessageToChat('Connected');
  }

  private addPlayerTab(player: Player) {
    if (this.room.players.map(p => p.id).indexOf(player.id) === -1) {
      this.room.players.push(player);
      this.playersPublisher.next(this.room.players);
    }
  }

  private removePlayerTab(player: Player) {
    const pIndex = this.room.players.map(p => p.id).indexOf(player.id);
    if (pIndex !== -1) {
      this.room.players.splice(pIndex, 1);
      this.playersPublisher.next(this.room.players);
    }
  }

  private updatePlayerInventory(updatedPlayerId: string) {
    this.playerService.getPlayer(updatedPlayerId).subscribe(updatedPlayer => {
      this.getPlayerById(updatedPlayer.id).inventory = updatedPlayer.inventory;
      this.playersPublisher.next(this.room.players);
    });
  }

  private pushMessageToChat(
    message: string,
    author: Player = this.playerService.systemPlayer,
    timestamp: string = new Date().toLocaleTimeString()
  ) {
    this.messagePublisher.next(new RoomMessage(message, author, timestamp));
  }

  private isOwnMessage = (message: WsMessage) => message.senderId === this.currentPlayer.id;
  private getPlayerById = (id: string) => this.room.players.find(p => p.id === id);
  private getPlayerNameById = (id: string) => this.getPlayerById(id).name;
}
