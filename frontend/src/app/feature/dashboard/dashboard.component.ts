import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DashboardService} from '../../core/service/dashboard.service';
import {WithWebSocket} from '../../util/web-socket/with-web-socket';
import {WsMessage} from '../../model/ws-message';
import {WsDashboardMessageType} from '../../util/web-socket/ws-message-type';
import {UserService} from '../../core/service/user.service';
import {UuidUtil} from '../../util/uuid.util';
import {WsConstants} from '../../util/web-socket/ws-constants';
import {Room} from '../../model/room';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends WithWebSocket implements OnInit, OnDestroy {

  private rooms: Array<Room> = [];
  private roomsSbj = new BehaviorSubject<Array<Room>>(this.rooms);
  roomsObs = this.roomsSbj.asObservable();

  constructor(
    private router: Router,
    public dashboardService: DashboardService,
    userService: UserService
  ) {
    super(userService);
  }

  ngOnInit(): void {
    this.loadRooms();
    this.connect(WsConstants.dashboardTopic);
  }

  @HostListener('window:beforeunload')
  onGlobalExit() {
    this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private loadRooms() {
    this.dashboardService.allRooms().subscribe(rooms => {
      this.rooms = rooms;
      this.roomsSbj.next(rooms);
    });
  }

  addRoom() {
    const newRoom = new Room(UuidUtil.generateUuid());
    this.dashboardService.createRoom(newRoom)
      .pipe(
        tap(createdRoom => {
          this.rooms.unshift(createdRoom);
          this.roomsSbj.next(this.rooms);
        })
      )
      .subscribe(createdRoom => this.notifyOthers(createdRoom.id, WsDashboardMessageType.NEW_ROOM));
  }

  removeRoom(id: string) {
    this.dashboardService.deleteRoom(id)
      .pipe(tap(() => {
        this.rooms.splice(this.rooms.map(r => r.id).indexOf(id), 1);
        this.roomsSbj.next(this.rooms);
      }))
      .subscribe(() => this.notifyOthers(id, WsDashboardMessageType.REMOVE_ROOM));
  }

  openRoom(roomId: string) {
    this.disconnect();
    this.router.navigate(['/room', roomId]);
  }

  protected onMessage(result) {
    const message = JSON.parse(result.data) as WsMessage;

    if (message.senderId === this.userService.userId) {
      return;
    }

    switch (message.type) {
      case WsDashboardMessageType.NEW_ROOM:
      case WsDashboardMessageType.REMOVE_ROOM:
        this.loadRooms();
    }
  }

  private notifyOthers(rooId: string, messageType: WsDashboardMessageType) {
    this.send({type: messageType, data: rooId});
  }
}
