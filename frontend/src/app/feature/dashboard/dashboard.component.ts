import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RoomService} from '../../core/service/room.service';
import {AbstractWebSocketHolder} from '../../util/web-socket/abstract-web-socket-holder';
import {WsMessage} from '../../model/ws-message';
import {WsDashboardMessageType} from '../../util/web-socket/ws-message-type.enum';
import {UserService} from '../../core/service/user.service';
import {Room} from '../../model/room';
import {filter, flatMap} from 'rxjs/operators';
import {ApiConst} from '../../util/constant/api.const';
import { MatDialog } from '@angular/material/dialog';
import {NewRoomDialogComponent} from './new-room-dialog/new-room-dialog.component';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {SignUpDialogComponent} from './sign-up-dialog/sign-up-dialog.component';
import {Credentials} from '../../model/credentials';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends AbstractWebSocketHolder implements OnInit, OnDestroy {

  rooms: Array<Room> = [];

  constructor(
    public userService: UserService,
    public roomService: RoomService,
    private router: Router,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadRooms();
    this.connect(ApiConst.WS_DASHBOARD);
  }

  @HostListener('window:beforeunload')
  onGlobalExit() {
    this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  login() {
    this.dialog.open<LoginDialogComponent, Credentials>(LoginDialogComponent).afterClosed().subscribe();
  }

  logout() {
    this.userService.logout();
  }

  signUp() {
    this.dialog.open(SignUpDialogComponent).afterClosed().subscribe();
  }

  addRoom() {
    this.dialog.open(NewRoomDialogComponent).afterClosed()
      .pipe(
        filter(obj => obj != null),
        flatMap((room: Room) => this.roomService.createRoom(room))
      )
      .subscribe(createdRoom => this.notifyOthers(createdRoom.id, WsDashboardMessageType.NEW_ROOM));
  }

  removeRoom(id: string) {
    this.roomService.deleteRoom(id)
      .subscribe(() => this.notifyOthers(id, WsDashboardMessageType.REMOVE_ROOM));
  }

  openRoom = (roomId: string) => this.router.navigate(['/room', roomId]);

  displayDeleteIcon = () => this.userService.isAdmin;

  private loadRooms() {
    this.roomService.allRooms().subscribe(rooms => {
      this.rooms = rooms;
    });
  }

  protected onMessage(result) {
    const message = JSON.parse(result.data) as WsMessage;
    switch (message.type) {
      case WsDashboardMessageType.NEW_ROOM:
      case WsDashboardMessageType.REMOVE_ROOM:
        this.loadRooms();
    }
  }

  private notifyOthers(roomId: string, messageType: WsDashboardMessageType) {
    this.sendWsMessage({ type: messageType, data: roomId });
  }
}
