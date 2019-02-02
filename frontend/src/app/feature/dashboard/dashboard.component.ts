import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DashboardService} from '../../core/service/dashboard.service';
import {WithWebSocket} from '../../util/web-socket/with-web-socket';
import {WsMessage} from '../../model/ws-message';
import {WsDashboardMessageType} from '../../util/web-socket/ws-message-type';
import {UserService} from '../../core/service/user.service';
import {UuidUtil} from '../../util/uuid.util';
import {WsConstants} from '../../util/web-socket/ws-constants';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends WithWebSocket implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    public service: DashboardService,
    userService: UserService
  ) {
    super(userService);
  }

  ngOnInit(): void {
    this.connect(WsConstants.dashboardTopic);
  }

  @HostListener('window:beforeunload')
  onGlobalExit() {
    this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  addRoom = () => this.send({ type: WsDashboardMessageType.NEW_ROOM, data: UuidUtil.generateUuid() });
  removeRoom = (roomId: string) => this.send({ type: WsDashboardMessageType.REMOVE_ROOM, data: roomId });
  openRoom = (roomId: string) => this.router.navigate(['/room', roomId]);

  protected onMessage(result) {
    const message = JSON.parse(result.data) as WsMessage;

    switch (message.type) {
      case WsDashboardMessageType.NEW_ROOM:
        this.service.addRoom(message.data);
        break;
      case WsDashboardMessageType.REMOVE_ROOM:
        this.service.removeRoom(message.data);
        break;
    }
  }
}
