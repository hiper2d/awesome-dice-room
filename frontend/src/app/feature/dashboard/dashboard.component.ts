import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RoomService} from '../../core/service/room.service';
import {WithWebSocket} from '../../util/web-socket/with-web-socket';
import {WsMessage} from '../../model/ws-message';
import {WsDashboardMessageType} from '../../util/web-socket/ws-message-type';
import {UserService} from '../../core/service/user.service';
import {Room} from '../../model/room';
import {filter, flatMap, tap} from 'rxjs/operators';
import {ApiConst} from '../../util/api.const';
import {MatDialog} from '@angular/material';
import {NewRoomDialogComponent} from './new-room-dialog/new-room-dialog.component';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {SignUpDialogComponent} from './sign-up-dialog/sign-up-dialog.component';
import {Credentials} from '../../model/credentials';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends WithWebSocket implements OnInit, OnDestroy {

  rooms: Array<Room> = [];

  constructor(
    public roomService: RoomService,
    private router: Router,
    private dialog: MatDialog,
    userService: UserService
  ) {
    super(userService);
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

  private loadRooms() {
    this.roomService.allRooms().subscribe(rooms => {
      this.rooms = rooms;
    });
  }

  protected onMessage(result) {
    const message = JSON.parse(result.data) as WsMessage;

    if (message.senderId === this.userService.id) {
      return;
    }

    switch (message.type) {
      case WsDashboardMessageType.NEW_ROOM:
      case WsDashboardMessageType.REMOVE_ROOM:
        this.loadRooms();
    }
  }

  private notifyOthers(roomId: string, messageType: WsDashboardMessageType) {
    this.sendWsMessage({type: messageType, data: roomId});
  }
}
