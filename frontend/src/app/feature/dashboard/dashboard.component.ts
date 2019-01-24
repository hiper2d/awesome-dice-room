import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UuidUtil} from '../../util/uuid.util';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openRoom() {
    const roomId = UuidUtil.generateUuid();
    this.router.navigate(['/room', roomId]);
  }
}
